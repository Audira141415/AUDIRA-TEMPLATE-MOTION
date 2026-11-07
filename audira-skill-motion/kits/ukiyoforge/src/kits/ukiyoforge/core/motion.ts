// UKIYOFORGE motion core. Everything derives from the 60-based frame clock `f`.

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ramp = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const smooth = (x: number) => x * x * (3 - 2 * x);
export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const easeOutBack = (x: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export const mulberry32 = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * Print-space mapping. The composition is authored as a flat 4.4 x 7.8 print at z = 0.
 * A layer placed deeper at z is scaled by (PRINT_EYE - z) / PRINT_EYE so that, seen from the
 * "print camera" at z = PRINT_EYE, every layer lines up into one flat woodblock image.
 * Any other camera position reveals the paper layers in depth (parallax).
 */
export const PRINT_EYE = 9;
export const PRINT = { width: 4.4, height: 7.8 };
export const depthScale = (z: number) => (PRINT_EYE - z) / PRINT_EYE;

export interface UkiyoState {
  t: number;
  heave: (phase: number, amp?: number) => number;
  /** 0..1 the big crest breaking forward (payoff) */
  breakK: number;
  /** 0..1 foam spray burst */
  burst: number;
  /** 0..1 seal stamp */
  stamp: number;
  /** 0..1 sun rise */
  sunRise: number;
}

export const computeUkiyoState = (f: number): UkiyoState => {
  const t = f / 60;
  return {
    t,
    heave: (phase: number, amp = 0.06) => Math.sin(t * 1.6 + phase) * amp + Math.sin(t * 0.7 + phase * 1.7) * amp * 0.5,
    breakK: smooth(ramp(t, 8.8, 10.0)),
    burst: ramp(t, 9.2, 11.6),
    stamp: easeOutBack(ramp(t, 10.1, 10.5)),
    sunRise: smooth(ramp(t, 0.5, 9.5)),
  };
};
