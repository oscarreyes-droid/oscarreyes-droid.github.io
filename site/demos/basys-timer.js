/* Browser interaction layer. The independent model contains the Verilog behavior. */
(function () {
  'use strict';
  const Timer = window.BasysTimer;
  // Symmetric, straight seven-segment geometry with consistent gaps and thickness.
  const polygons = ['12,6 44,6 50,12 44,18 12,18 6,12', '46,20 52,14 58,20 58,45 52,51 46,45',
    '46,61 52,55 58,61 58,86 52,92 46,86', '12,88 44,88 50,94 44,100 12,100 6,94',
    '0,61 6,55 12,61 12,86 6,92 0,86', '0,20 6,14 12,20 12,45 6,51 0,45', '12,47 44,47 50,53 44,59 12,59 6,53'];
  let dispose = function () {};
  function render() {
    const digits = [0, 1, 2, 3].map(i => '<svg viewBox="-2 0 72 108" class="basys-digit" aria-hidden="true">' +
      polygons.map((points, segment) => '<polygon points="' + points + '" data-segment="' + segment + '"/>').join('') +
      '<circle class="decimal' + (i === 1 ? ' on' : '') + '" cx="64" cy="94" r="3"/>' + '</svg>').join('');
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
      '<div class="board-connectors" aria-hidden="true"><span class="connector-power">POWER</span><span class="connector-jtag">MICRO USB / JTAG</span><span class="connector-vga">VGA</span><span class="connector-usb">USB HOST</span></div><div class="pmod-headers" aria-hidden="true"><span>JA</span><span>JB</span><span>JC</span><span>JXADC</span></div><span class="board-mount bottom-left" aria-hidden="true"></span><span class="board-mount bottom-right" aria-hidden="true"></span><div class="board-brand"><strong>BASYS 3</strong><span>DIGILENT · ARTIX-7 FPGA</span></div>' +
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
