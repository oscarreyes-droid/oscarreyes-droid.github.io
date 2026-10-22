/* Behavioral port of stateMachine.v and button_edge.v from Oscar Reyes and
   Zoe Gonzalez's Lab 6. One step is one rising edge of clkdiv2's COUNT[19].
   No synthesis, analog effects, or display-scan flicker are simulated. */
(function (root) {
  'use strict';
  const SEGMENTS = [0b0000001, 0b1001111, 0b0010010, 0b0000110, 0b1001100,
    0b0100100, 0b0100000, 0b0001111, 0b0000000, 0b0000100];
  const STATES = ['IDLE', 'HOLD UP', 'HOLD DOWN', 'COUNT UP', 'COUNT DOWN', 'PAUSED', 'MAXIMUM', 'ZERO'];
  const MODES = ['Count up from 00.00', 'Count up from preset', 'Count down from 99.99', 'Count down from preset'];
  class BasysTimer {
    constructor() {
      this.switches = 0;
      this.state = 0;
      this.digits = [0, 0, 0, 0]; // total1 through total4, right to left
      this.segments = [1, 1, 1, 1];
      this.sync0 = this.sync1 = this.previous = this.edge = false;
      this.reset();
    }
    get mode() { return this.switches & 3; }
    get preset() { return (this.switches >>> 8) & 255; }
    get validPreset() { return (this.preset & 15) <= 9 && (this.preset >>> 4) <= 9; }
    get text() {
      const d = this.digits.map(n => n <= 9 ? String(n) : '?');
      return d[3] + d[2] + '.' + d[1] + d[0];
    }
    get stateName() { return STATES[this.state]; }
    get running() { return this.state === 3 || this.state === 4; }
    setSwitch(index, on) {
      if (!Number.isInteger(index) || index < 0 || index > 15) return;
      this.switches = (on ? this.switches | (1 << index) : this.switches & ~(1 << index)) & 65535;
    }
    // Direct FSM transition, preserving old-state actions and 4-bit arithmetic.
    step(startStopEdge = false, reset = false) {
      const state = this.state, d = this.digits;
      let next = state;
      switch (state) {
        case 0: next = this.mode < 2 ? 1 : 2; break;
        case 1: next = startStopEdge ? 3 : 1; break;
        case 2: next = startStopEdge ? 4 : 2; break;
        case 3: next = startStopEdge ? 5 : d.every(n => n === 9) ? 6 : 3; break;
        case 4: next = startStopEdge ? 5 : d.every(n => n === 0) ? 7 : 4; break;
        case 5: next = startStopEdge ? (this.mode < 2 ? 3 : 4) : 5; break;
      }
      if (reset) { this.state = 0; return; }
      this.state = next;
      if ((state === 1 && this.mode === 0) || (state === 2 && this.mode === 2)) {
        d.fill(this.mode === 0 ? 0 : 9);
      } else if ((state === 1 && this.mode === 1) || (state === 2 && this.mode === 3)) {
        d[0] = d[1] = 0; d[2] = this.preset & 15; d[3] = this.preset >>> 4;
      } else if (state === 3 && !d.every(n => n === 9)) {
        for (let i = 0; i < 4; i++) {
          d[i] = (d[i] + 1) & 15;
          if (i === 3 || d[i] !== 10) break;
          d[i] = 0;
        }
      } else if (state === 4 && !d.every(n => n === 0)) {
        for (let i = 0; i < 4; i++) {
          d[i] = (d[i] - 1) & 15;
          if (i === 3 || d[i] !== 15) break;
          d[i] = 9;
        }
      }
      // The supplied decoder has no default: invalid BCD keeps its last pattern.
      d.forEach((n, i) => { if (n <= 9) this.segments[i] = SEGMENTS[n]; });
    }
    clock(button = false) {
      this.step(this.edge);
      const old0 = this.sync0, old1 = this.sync1;
      this.edge = old1 && !this.previous;
      this.previous = old1;
      this.sync1 = old0;
      this.sync0 = Boolean(button);
    }
    reset() {
      this.sync0 = this.sync1 = this.previous = this.edge = false;
      this.step(false, true);
      this.step(); this.step(); // settle IDLE -> HOLD and load initial digits
    }
  }
  BasysTimer.TICK_HZ = 100000000 / (2 ** 20);
  BasysTimer.MODES = MODES;
  if (typeof module !== 'undefined' && module.exports) module.exports = BasysTimer;
  else root.BasysTimer = BasysTimer;
})(typeof window !== 'undefined' ? window : globalThis);
