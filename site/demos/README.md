# Basys3 timer demo

The `fpga-timer` project opts into this component with `demo: "basys3"` in
`content.js`. `BasysDemo.render()` produces its markup, and `site/app.js` calls
`BasysDemo.mount()` after rendering. Remounting disposes the previous listeners
and animation loop. The demo runs entirely in the browser and fetches only local static assets; no
backend or runtime CDN is needed. Three.js 0.180.0 and OrbitControls are served
locally under their MIT license.

## Behavior and source mapping

The behavior comes from the Verilog and XDC in the Lab 6 project archive
supplied by Oscar Reyes:

- `stateMachine.v`: eight controller states, old-state counter actions, BCD
  carries/borrows, presets, and saturation at 00.00 or 99.99.
- `button_edge.v`: two synchronizer stages, rising-edge detection, and its
  one-cycle output latency. A UI activation provides a stable six-tick pulse.
- `hexto7segment.v`: the same active-low seven-segment encodings. Invalid BCD
  retains the previous decoder pattern because the source has no default case.
- `clkdiv2.v`: 100,000,000 / 2^20 = 95.367431640625 counter ticks per second.
  The displayed hundredths are therefore not exact wall-clock hundredths.
- `time_mux_state_machine.v`: the decimal point is after the second digit from
  the left. Scanning flicker is represented by a continuous display.
- `Basys3_Master.xdc`: SW1:0 selects the mode; SW15:8 is the two-digit BCD
  preset; BTNU is start/stop and BTNC is reset. SW7:2 and LED outputs are unused.

Mode 00 counts up from zero, 01 up from preset, 10 down from 99.99, and 11 down
from preset. Raw mode switches do not reset the state machine; users must reset
after changing them. The clearly labeled quick mode picker and preset loader
apply their values and reset together. Reset settles the IDLE/HOLD transitions
immediately for a deterministic, readable starting display. The source's
uninitialized power-up behavior and electrical effects are not simulated.

Closed or hidden demos freeze their simulation clock; reopening resumes it.
Fast-forward changes playback speed, not the controller logic. The board is a
stylized interactive illustration, not a physical FPGA or Verilog compiler.

## Validation

Run the dependency-free model checks:

```sh
node --test tests/basys-timer.test.cjs
```

The optional differential test needs Icarus Verilog and the original extracted
`.v` files, which are not distributed with the website:

```sh
BASYS_RTL_DIR=/path/to/extracted/verilog node --test tests/basys-timer.test.cjs
```

`IVERILOG`, `VVP`, and `IVERILOG_BASE` can point to a local tool installation.
The differential test compares more than 15,000 controller and decoder results
against the original RTL, including all modes, limits, pauses, resets, invalid
BCD, and randomized switch changes. The initial unknown HDL outputs are skipped
until the source loads its first held value.

To run the browser checks with Playwright and Chromium available, first serve
the repository with `python3 -m http.server 8000 --bind 127.0.0.1`, then run:

```sh
node tests/basys-ui.cjs
```

Use `PLAYWRIGHT_MODULE` for a nonstandard module installation,
`CHROMIUM_EXECUTABLE` for another Chromium binary, and `BASE_URL` for a different
server address. The browser checks exercise all four modes, preset loading,
start/pause/resume, reset, both limits, invalid BCD, raw switches, close/reopen,
keyboard controls, and desktop/tablet/phone layout.

## 3D view and asset refresh

`basys-board-3d.js` loads a rotatable model tessellated from the supplied STEP assembly with
mesh-level raycasting for the real mode/preset switches and BTNU/BTNC controls.
The community CAD model comes from the supplied GrabCAD archive; it has not been independently measured against the physical unit.
The same timer model drives both the 3D display and the keyboard-accessible 2D
controls. WebGL-unavailable browsers retain the working 2D controls.

Three.js 0.180.0 was downloaded from its npm distribution with SHA-512 integrity
verification. The local vendor directory includes its MIT license. Vendored example modules have their import paths adjusted to the local Three.js files.
There are no external runtime CDN requests.

Run the 3D interaction checks with Playwright/Chromium available:

```sh
node tests/basys-3d.cjs
```

After changing scripts or CSS, run `python3 scripts/version-assets.py`. This
updates the content hashes in the HTML and in each theme's stylesheet URL to
prevent previously cached resources from hiding an update. It is idempotent;
there is still no production build step.
