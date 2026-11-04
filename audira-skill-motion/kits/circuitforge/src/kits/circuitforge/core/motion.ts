// CIRCUITFORGE deterministic motion core — 60 FPS clock, electron pulse travel & clock signal cycles.

export const clamp = (v: number, min: number, max: number): number => Math.min(Math.max(v, min), max);

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const remap = (v: number, inMin: number, inMax: number, outMin = 0, outMax = 1): number => {
  const t = clamp((v - inMin) / (inMax - inMin), 0, 1);
  return outMin + (outMax - outMin) * t;
};

export const ease = {
  smooth: (t: number): number => t * t * (3 - 2 * t),
  // Microcurrent surge: swift linear propagation with snap arrival
  currentSnap: (t: number): number => Math.min(1, t * 1.5),
  macroGlide: (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};

export const seg = (f: number, start: number, end: number, easing = ease.smooth): number => {
  return easing(remap(f, start, end, 0, 1));
};

/** Compute cyclic electron pulse position along a circuit track */
export const pulseProgress = (f: number, speed = 0.02, offset = 0): number => {
  return ((f * speed + offset) % 1.0);
};

