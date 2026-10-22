/* Browser interaction layer. The independent model contains the Verilog behavior. */
(function () {
  'use strict';
  const Timer = window.BasysTimer;
  const polygons = ['10,4 44,4 49,9 44,14 10,14 5,9', '45,16 50,11 54,16 50,43 45,48 41,43',
    '44,53 49,48 53,53 49,84 44,89 40,84', '8,86 41,86 46,91 41,96 8,96 3,91',
    '3,53 8,48 12,53 8,84 3,89 0,84', '5,16 10,11 14,16 10,43 5,48 1,43', '10,45 42,45 47,50 42,55 10,55 5,50'];
  let dispose = function () {};
  function render() {
    const digits = [0, 1, 2, 3].map(i => '<svg viewBox="0 0 63 102" class="basys-digit" aria-hidden="true">' +
      polygons.map((points, segment) => '<polygon points="' + points + '" data-segment="' + segment + '"/>').join('') +
      (i === 1 ? '<circle class="decimal on" cx="59" cy="91" r="3"/>' : '') + '</svg>').join('');
    const switches = Array.from({ length: 16 }, (_, n) => 15 - n).map(n => {
      const used = n < 2 || n >= 8;
      const purpose = n < 2 ? 'mode bit ' + n : n >= 12 ? 'preset tens bit ' + (n - 12) : n >= 8 ? 'preset ones bit ' + (n - 8) : 'not connected';
      return '<div class="basys-switch-unit"><span class="board-led" aria-hidden="true"></span><button type="button" role="switch" aria-checked="false" aria-label="SW' + n + ' · ' + purpose + '" title="SW' + n + ': ' + purpose + '" data-switch="' + n + '"' + (!used ? ' disabled' : '') + '><span></span></button><span class="switch-label">' + n + '</span></div>';
    }).join('');
    return '<details class="basys-demo" id="basys3-demo"><summary><span>Try the FPGA timer</span><span class="demo-summary-hint">Interactive Basys3 board <span aria-hidden="true">＋</span></span></summary>' +
      '<div class="basys-content"><div class="basys-intro"><div><p class="eyebrow">Hands on / Digital logic</p><h4>Flip a switch. Start the clock.</h4><p>A browser simulation of the timer designed by Oscar Reyes and Zoe Gonzalez. Choose a mode, then press the board’s top button to start or pause.</p></div><span class="simulation-badge">Browser simulation</span></div>' +
      '<div class="basys-quick-controls"><label>Choose mode & reset<select data-mode>' + Timer.MODES.map((m, i) => '<option value="' + i + '">' + m + '</option>').join('') + '</select></label>' +
      '<div class="preset-controls"><label>Preset seconds<input type="number" min="0" max="99" step="1" value="5" data-preset></label><button type="button" class="basys-action" data-load>Load preset & reset</button></div>' +
      '<label>Demo speed<select data-speed><option value="1">1× · original clock</option><option value="10">10× · fast forward</option><option value="100">100× · fast forward</option></select></label></div>' +
      '<p class="basys-feedback" data-feedback aria-live="polite">Mode 00: count up from zero. Press Start/stop.</p>' +
      '<div class="basys-board-scroll" tabindex="0" role="region" aria-label="Interactive board; scroll sideways on small screens"><div class="basys-board" aria-label="Stylized Basys3 FPGA board">' +
      '<div class="board-connectors" aria-hidden="true"><span>PMOD JA</span><span>USB / JTAG</span><span>VGA</span></div><div class="board-brand"><strong>BASYS 3</strong><span>ARTIX-7 FPGA · TIMER LAB</span></div>' +
      '<div class="board-body"><div class="board-left"><span class="board-silkscreen">FOUR-DIGIT SEVEN-SEGMENT DISPLAY</span><div class="basys-display" role="img" aria-label="Timer display 00.00">' + digits + '</div><span class="board-silkscreen display-unit">SECONDS . HUNDREDTHS</span></div>' +
      '<div class="fpga-chip" aria-hidden="true"><span>ARTIX-7</span><strong>XC7A35T</strong><small>LOGIC / CONTROL</small></div>' +
      '<div class="board-buttons"><button type="button" class="board-button start-button" data-start aria-label="BTNU Start or stop timer"><small>BTNU</small>Start/stop</button><span class="unused-button button-left" aria-hidden="true"></span><button type="button" class="board-button reset-button" data-reset aria-label="BTNC Reset timer"><small>BTNC</small>Reset</button><span class="unused-button button-right" aria-hidden="true"></span><span class="unused-button button-down" aria-hidden="true"></span></div></div>' +
      '<div class="board-switches">' + switches + '</div><div class="switch-groups" aria-hidden="true"><span>SW15–12 / TENS</span><span>SW11–8 / ONES</span><span>SW7–2 / UNUSED</span><span>SW1–0 / MODE</span></div>' +
      '<div class="board-footer"><span>100 MHz OSC</span><span>SWITCHES: UP = 1 · DOWN = 0</span><span class="board-power">● POWER</span></div></div></div>' +
      '<p class="board-scroll-hint">On a phone, swipe sideways across the board to reach all controls.</p>' +
      '<div class="basys-readout"><div><span>Controller state</span><strong data-state aria-live="polite">HOLD UP</strong></div><div><span>Mode · SW1:0</span><strong data-mode-bits>00</strong></div><div><span>Preset · SW15:8</span><strong data-preset-bits>0000 0000</strong></div><div><span>Display</span><strong data-value>00.00</strong></div></div>' +
      '<div class="basys-guide"><div><h5>Try a countdown</h5><ol><li>Choose “Count down from preset.”</li><li>Enter 5 seconds and select “Load preset & reset.”</li><li>Press Start/stop. Press again to pause or resume.</li></ol></div><div><h5>Try the actual board inputs</h5><p>SW1–0 select the four modes. SW15–12 set the tens digit and SW11–8 set the ones digit in binary-coded decimal (0–9). Reset after changing mode; the live switches do not reset automatically. SW7–2 are unused.</p></div></div>' +
      '<details class="basys-notes"><summary>About this simulation</summary><p>The counter and button-edge logic follow the uploaded Verilog. At a 100 MHz input, COUNT[19] produces about 95.37 counter ticks per second, so a displayed second takes about 1.049 real seconds at 1×. Fast forward only changes playback speed.</p><p>This is a behavioral JavaScript simulation, not an FPGA or an in-browser Verilog compiler. The display is shown continuously instead of scanning its anodes. Power-up is initialized deterministically, and simulation time freezes while this demo is closed or the tab is hidden. Invalid BCD presets retain the last decoded segment pattern, as in the supplied decoder.</p></details></div></details>';
  }
  function mount() {
    dispose();
    const root = document.querySelector('#basys3-demo');
    if (!root) { dispose = function () {}; return; }
    const model = new Timer();
    let speed = 1, last = 0, remainder = 0, raf = 0, pressTicks = 0, stateText = '';
    const query = s => root.querySelector(s);
    function paint() {
      const masks = model.segments.slice().reverse();
      root.querySelectorAll('.basys-digit').forEach((digit, i) => {
        digit.querySelectorAll('[data-segment]').forEach(el => {
          el.classList.toggle('on', !(masks[i] & (1 << (6 - Number(el.dataset.segment)))));
        });
      });
      query('.basys-display').setAttribute('aria-label', 'Timer display ' + model.text);
      query('[data-value]').textContent = model.text;
      if (stateText !== model.stateName) { stateText = model.stateName; query('[data-state]').textContent = stateText; }
      query('[data-mode-bits]').textContent = model.mode.toString(2).padStart(2, '0');
      const bits = model.preset.toString(2).padStart(8, '0');
      query('[data-preset-bits]').textContent = bits.slice(0, 4) + ' ' + bits.slice(4);
      query('[data-mode]').value = String(model.mode);
      root.querySelectorAll('[data-switch]').forEach(el => {
        const on = Boolean(model.switches & (1 << Number(el.dataset.switch)));
        el.setAttribute('aria-checked', String(on));
      });
      query('[data-start]').classList.toggle('board-active', model.running);
      const feedback = !model.validPreset && (model.mode & 1)
        ? 'Invalid BCD preset: set each four-switch group to 0–9, then reset. The decoder keeps its previous segment pattern.'
        : 'Mode ' + model.mode.toString(2).padStart(2, '0') + ': ' + Timer.MODES[model.mode].toLowerCase() + '. ' +
          (model.state === 6 || model.state === 7 ? 'Limit reached. Press Reset to start again.' : model.running ? 'Running. Press Start/stop to pause.' : 'Press Start/stop to run.');
      if (query('[data-feedback]').textContent !== feedback) query('[data-feedback]').textContent = feedback;
    }
    function frame(time) {
      if (!root.open || document.hidden) { raf = 0; last = 0; return; }
      if (last) remainder += Math.max(0, time - last) * Timer.TICK_HZ * speed / 1000;
      last = time;
      const ticks = Math.floor(remainder); remainder -= ticks;
      for (let i = 0; i < ticks; i++) { model.clock(pressTicks > 0); if (pressTicks > 0) pressTicks--; }
      if (ticks) paint();
      raf = requestAnimationFrame(frame);
    }
    function startFrame() { if (root.open && !document.hidden && !raf) { last = 0; raf = requestAnimationFrame(frame); } }
    function stopFrame() { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0; }
    function reset() { model.reset(); pressTicks = 0; remainder = 0; last = 0; paint(); }
    function click(event) {
      const button = event.target.closest('button');
      if (!button || !root.contains(button)) return;
      if (button.matches('[data-switch]')) {
        const i = Number(button.dataset.switch); model.setSwitch(i, !(model.switches & (1 << i))); paint();
      } else if (button.matches('[data-start]')) {
        // A stable six-tick pulse passes through the source's two-stage synchronizer.
        if (!pressTicks) pressTicks = 6;
      } else if (button.matches('[data-reset]')) reset();
      else if (button.matches('[data-load]')) {
        const input = query('[data-preset]');
        if (!input.reportValidity()) return;
        const value = Number(input.value);
        if (!Number.isInteger(value) || value < 0 || value > 99 || input.value === '') { input.setCustomValidity('Enter a whole number from 0 to 99.'); input.reportValidity(); return; }
        const preset = (Math.floor(value / 10) << 4) | (value % 10);
        model.switches = (model.switches & 255) | (preset << 8); reset();
      }
    }
    function change(event) {
      if (event.target.matches('[data-mode]')) { model.switches = (model.switches & ~3) | Number(event.target.value); reset(); }
      if (event.target.matches('[data-speed]')) { speed = Number(event.target.value); last = 0; remainder = 0; }
    }
    function input(event) { if (event.target.matches('[data-preset]')) event.target.setCustomValidity(''); }
    const openObserver = new MutationObserver(function () { if (root.open) startFrame(); else stopFrame(); });
    openObserver.observe(root, { attributes: true, attributeFilter: ['open'] });
    function visibility() { if (document.hidden) stopFrame(); else startFrame(); }
    root.addEventListener('click', click); root.addEventListener('change', change); root.addEventListener('input', input);
    document.addEventListener('visibilitychange', visibility);
    dispose = function () { stopFrame(); root.removeEventListener('click', click); root.removeEventListener('change', change); root.removeEventListener('input', input); openObserver.disconnect(); document.removeEventListener('visibilitychange', visibility); };
    paint(); startFrame();
  }
  window.BasysDemo = { render, mount };
})();
