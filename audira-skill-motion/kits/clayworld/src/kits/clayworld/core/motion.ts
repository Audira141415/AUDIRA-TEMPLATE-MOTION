// CLAYWORLD motion primitives — deterministic stop-motion stepped timing & squash-and-stretch physics.

export const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const remap = (x: number, inMin: number, inMax: number, outMin = 0, outMax = 1) =>
  outMin + ((clamp(x, inMin, inMax) - inMin) / (inMax - inMin)) * (outMax - outMin);

/** Quantizes continuous film frames into authentic stop-motion stepped cadence (default step=4 gives 15 FPS animation in a 60 FPS timeline) */
export const stepFrame = (f: number, step = 4): number => Math.floor(f / step) * step;

/** Volume-preserving squash and stretch scale vector [sx, sy, sz] based on compression factor (-1 to +1) */
export const squashScale = (factor: number): [number, number, number] => {
  const sy = Math.max(0.2, 1.0 + factor);
  const sLateral = Math.sqrt(1.0 / sy); // Preserves plasticine volume
  return [sLateral, sy, sLateral];
};

export const ease = {
  /** Soft, doughy deceleration into a clay rest */
  dough: (t: number) => {
    const x = clamp(t);
    return x * x * (3 - 2 * x);
  },
  /** Clay elastic bounce overshoot */
  clayBounce: (t: number) => {
    const x = clamp(t);
    return Math.sin(x * Math.PI * 0.5);
  },
  sine: (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(t)),
};

/** Eased progression through [start, end] */
export const seg = (f: number, start: number, end: number, curve: (t: number) => number = ease.dough) =>
  curve(clamp((f - start) / (end - start)));

