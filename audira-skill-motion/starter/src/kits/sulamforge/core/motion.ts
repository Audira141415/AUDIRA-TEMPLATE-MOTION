// SULAMFORGE motion core. Everything derives from the 60-based frame clock `f`.

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ramp = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const smooth = (x: number) => x * x * (3 - 2 * x);
export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export const mulberry32 = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** Seconds a single stitch takes to be laid (thread pulled taut). */
export const STITCH_LAY = 0.14;

/** 0..1 growth of a stitch that starts at `start` seconds. */
export const stitchGrow = (t: number, start: number) => smooth(clamp((t - start) / STITCH_LAY));

export interface SulamState {
  t: number;
  /** gold glint sweep light, -1..1 across the hoop (payoff) */
  sweep: number;
  /** extra intensity of the sweep light */
  sweepPower: number;
}

export const computeSulamState = (f: number): SulamState => {
  const t = f / 60;
  const k = smooth(ramp(t, 8.6, 11.2));
  return { t, sweep: lerp(-1.4, 1.4, k), sweepPower: Math.sin(Math.PI * k) };
};
