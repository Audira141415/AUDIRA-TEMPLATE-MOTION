// FOODFORGE motion core — every value is a pure function of the 60-FPS-normalised frame `f`.
// No useFrame, no Date, no unseeded Math.random: renders are identical frame by frame.

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
export const easeInOutCubic = (x: number) => {
  const t = clamp01(x);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
export const easeOutCubic = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
/** 0→1 progress of a window [a, b] in seconds. */
export const win = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

/** Seeded PRNG (mulberry32) — the only randomness allowed in the kit. */
export const mulberry32 = (seed: number) => () => {
  let s = (seed = (seed + 0x6d2b79f5) | 0);
  s = Math.imul(s ^ (s >>> 15), s | 1);
  s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
  return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
};

/**
 * Slow-motion "drop and land": an ingredient hangs in the air (tiny drift), falls with gravity
 * feel during [land - fall, land], then settles with one soft damped bounce.
 * Returns 0 (in the air) → 1 (resting) plus a squash amount for the landing frame.
 */
export const dropLand = (t: number, land: number, fall = 1.1) => {
  const p = win(t, land - fall, land);
  const fallP = p * p; // accelerating fall
  const after = Math.max(0, t - land);
  const bounce = after > 0 ? Math.exp(-after * 7) * Math.abs(Math.sin(after * 16)) * 0.08 : 0;
  const squash = after > 0 ? Math.exp(-after * 10) * 0.25 : 0;
  return { fallP, bounce, squash, landed: after > 0 };
};

export interface FoodState {
  t: number;
  /** steam intensity 0..1 (rises during payoff) */
  steam: number;
  /** chopstick lift 0..1 (payoff, 9–11 s) */
  lift: number;
  /** chopstick entry 0..1 */
  chopIn: number;
}

export const computeFoodState = (f: number): FoodState => {
  const t = f / 60;
  return {
    t,
    steam: 0.55 + 0.45 * smooth(win(t, 7, 10)),
    chopIn: easeOutCubic(win(t, 8.2, 9.2)),
    lift: easeInOutCubic(win(t, 9.1, 11.0)),
  };
};
