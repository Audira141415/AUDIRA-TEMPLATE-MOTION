// SATISFYFORGE motion core — pure functions of the 60-FPS-normalised frame `f`.
// Satisfying motion = exact targets, eased arrivals, tiny damped overshoot, no chaos.

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const win = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const smooth = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
export const easeInOutCubic = (x: number) => {
  const t = clamp01(x);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
export const easeInQuad = (x: number) => clamp01(x) * clamp01(x);
export const easeOutBack = (x: number, k = 1.4) => {
  const t = clamp01(x) - 1;
  return 1 + (k + 1) * t * t * t + k * t * t;
};

export const mulberry32 = (seed: number) => () => {
  let s = (seed = (seed + 0x6d2b79f5) | 0);
  s = Math.imul(s ^ (s >>> 15), s | 1);
  s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
  return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
};

/** Damped settle after an arrival at time `at`: decaying sine, 0 before `at`. */
export const settle = (t: number, at: number, amp = 0.03, freq = 18, damp = 8) => {
  const a = t - at;
  return a > 0 ? Math.sin(a * freq) * Math.exp(-a * damp) * amp : 0;
};

// ---- Story clock (seconds) ----
// Station A: kinetic sand slicing   0.0 – 3.9
// Station B: layered liquid fill    4.2 – 7.6
// Station C: shape drop / exact fit 8.0 – 11.2 (payoff star at ~10.3)
export const SLICE_TIMES = [0.35, 0.75, 1.15, 1.55, 1.95, 2.35, 2.75, 3.15];
export const FILL_LAYERS = [
  { a: 4.5, b: 5.5 },
  { a: 5.55, b: 6.45 },
  { a: 6.5, b: 7.3 },
];
export const DROP_TIMES = [8.55, 9.1, 9.65, 10.3];

/** Which station the camera is visiting, as a continuous x coordinate. */
export const stationX = (t: number) => {
  const ab = easeInOutCubic(win(t, 3.5, 4.5));
  const bc = easeInOutCubic(win(t, 7.4, 8.4));
  return -3.2 + ab * 3.2 + bc * 3.2;
};
