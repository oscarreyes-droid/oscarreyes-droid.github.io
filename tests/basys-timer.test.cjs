const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const Timer = require('../site/demos/basys-timer-model.js');
function setup(mode, preset = 0) {
  const timer = new Timer(); timer.switches = (preset << 8) | mode; timer.reset(); return timer;
}
function ticks(timer, n) { for (let i = 0; i < n; i++) timer.step(); }
test('mode presets, BCD carry and borrow, and saturating limits', () => {
  for (const [mode, preset, value] of [[0, 0, '00.00'], [1, 0x42, '42.00'], [2, 0, '99.99'], [3, 0x05, '05.00']]) {
    const timer = setup(mode, preset); assert.equal(timer.text, value);
    timer.step(true); ticks(timer, 100);
    assert.equal(timer.text, ['01.00', '43.00', '98.99', '04.00'][mode]);
  }
  const up = setup(1, 0x99); up.step(true); ticks(up, 100); assert.equal(up.text, '99.99'); assert.equal(up.state, 6);
  up.step(true); assert.equal(up.state, 6); up.reset(); assert.equal(up.text, '99.00');
  const down = setup(3, 0x01); down.step(true); ticks(down, 101); assert.equal(down.text, '00.00'); assert.equal(down.state, 7);
});
test('pause uses the old state for the last tick; resume direction follows mode', () => {
  const timer = setup(0); timer.step(true); ticks(timer, 99); timer.step(true);
  assert.equal(timer.text, '01.00'); assert.equal(timer.stateName, 'PAUSED'); ticks(timer, 50); assert.equal(timer.text, '01.00');
  timer.setSwitch(1, true); timer.step(true); assert.equal(timer.state, 4); timer.step(); assert.equal(timer.text, '00.99');
});
test('raw mode switches do not reset the controller; unused switches have no effect', () => {
  const timer = setup(0); timer.setSwitch(1, true); timer.step(); assert.equal(timer.state, 1); assert.equal(timer.text, '00.00');
  timer.reset(); assert.equal(timer.state, 2); assert.equal(timer.text, '99.99');
  for (let i = 2; i < 8; i++) timer.setSwitch(i, true);
  timer.reset(); assert.equal(timer.text, '99.99');
});
test('button synchronizer produces one rising edge for a held press', () => {
  const timer = setup(0);
  for (let i = 0; i < 3; i++) timer.clock(true);
  assert.equal(timer.state, 1); timer.clock(true); assert.equal(timer.state, 3);
  for (let i = 0; i < 20; i++) timer.clock(true);
  assert.equal(timer.state, 3);
  for (let i = 0; i < 5; i++) timer.clock(false);
  for (let i = 0; i < 4; i++) timer.clock(true);
  assert.equal(timer.state, 5);
});
test('invalid BCD retains decoder output; original clock rate is preserved', () => {
  const timer = setup(1, 0x19); const mask = timer.segments[2];
  timer.switches = (0x1f << 8) | 1; timer.step();
  assert.equal(timer.validPreset, false); assert.equal(timer.segments[2], mask);
  assert.equal(Timer.TICK_HZ, 95.367431640625);
});
test('differential comparison against supplied Verilog FSM and seven-segment decoder', { skip: !process.env.BASYS_RTL_DIR && 'Set BASYS_RTL_DIR to the extracted original .v files for HDL comparison.' }, () => {
  const rtl = process.env.BASYS_RTL_DIR;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'basys-rtl-'));
  try {
    const rows = [];
    function add(mode, preset, edge, reset = false, count = 1) {
      for (let i = 0; i < count; i++) rows.push({mode, preset, edge, reset});
    }
    for (const [mode, preset, count] of [[0, 0, 10005], [1, 0x98, 205], [2, 0, 110], [3, 0x01, 105]]) {
      add(mode, preset, false, true); add(mode, preset, false, false, 2); add(mode, preset, true);
      add(mode, preset, false, false, count); add(mode, preset, true); add(mode, preset, false, false, 3);
      add(mode, preset, true); add(mode, preset, false, false, 3);
    }
    let seed = 0x517ac;
    function random() { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed; }
    for (let i = 0; i < 5000; i++) add(random() & 3, random() & 255, (random() % 7) === 0, (random() % 43) === 0);
    const stimulus = rows.map((r, i) => `mode=2'd${r.mode}; preset=8'd${r.preset}; edge_in=1'b${+r.edge}; reset=1'b${+r.reset}; #5 clk=1; #1 $display("${i} %d %d %d %d %d %d %d %d %d",uut.state,d0,d1,d2,d3,s0,s1,s2,s3); #4 clk=0;`).join('\n');
    fs.writeFileSync(path.join(dir, 'tb.v'), `module tb; reg clk=0, reset=0, edge_in=0; reg[1:0] mode=0; reg[7:0] preset=0; wire[3:0] d0,d1,d2,d3; wire[6:0] s0,s1,s2,s3;
stateMachine uut(.clk(clk),.resetButton(reset),.startStop_edge(edge_in),.mode(mode),.preset(preset),.total1(d0),.total2(d1),.total3(d2),.total4(d3));
hexto7segment a(d0,s0), b(d1,s1), c(d2,s2), d(d3,s3);
initial begin #1; ${stimulus} $finish; end endmodule`);
    const binary = path.join(dir, 'sim');
    const args = ['-g2012', '-s', 'tb', '-o', binary, path.join(rtl, 'stateMachine.v'), path.join(rtl, 'hexto7segment.v'), path.join(dir, 'tb.v')];
    if (process.env.IVERILOG_BASE) args.unshift('-B', process.env.IVERILOG_BASE);
    execFileSync(process.env.IVERILOG || 'iverilog', args, {encoding:'utf8'});
    const output = execFileSync(process.env.VVP || 'vvp', [binary], {encoding:'utf8', maxBuffer:8 * 1024 * 1024});
    const model = new Timer(); let compared = 0;
    for (const line of output.trim().split('\n')) {
      if (!/^\d+\s/.test(line)) continue;
      const parts = line.trim().split(/\s+/), index = Number(parts[0]), row = rows[index];
      model.switches = (row.preset << 8) | row.mode; model.step(row.edge, row.reset);
      if (parts.some(s => /[xz]/i.test(s))) continue; // source has uninitialized outputs until HOLD executes
      assert.deepEqual([model.state, ...model.digits, ...model.segments], parts.slice(1).map(Number), `Verilog mismatch at tick ${index}`);
      compared++;
    }
    assert.ok(compared > 15000, 'Expected more than 15,000 RTL comparisons');
    console.log(`Compared ${compared} tick states and decoder outputs to original Verilog.`);
  } finally { fs.rmSync(dir, {recursive:true, force:true}); }
});
