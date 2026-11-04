// PRECISION deterministic motion core — 60 FPS clock functions, mechanical easing & monotonic explode physics.

export const clamp = (v: number, min: number, max: number): number => Math.min(Math.max(v, min), max);

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const remap = (v: number, inMin: number, inMax: number, outMin = 0, outMax = 1): number => {
  const t = clamp((v - inMin) / (inMax - inMin), 0, 1);
  return outMin + (outMax - outMin) * t;
};

export const ease = {
  // Industrial product motion: buttery smooth start, gradual acceleration, zero jerk
  smoothStep: (t: number): number => t * t * (3 - 2 * t),
  quinticInOut: (t: number): number => (t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2),
  // Magnetic latch: swift deceleration into a rigid mechanical seating
  magneticSnap: (t: number): number => {
    const s = 1.4;
    return 1 - Math.pow(1 - t, 4) * Math.cos(t * Math.PI * s);
  },
  // Exploded view expansion
  explodeEase: (t: number): number => 1 - Math.pow(1 - t, 3),
};

export const seg = (f: number, start: number, end: number, easing = ease.smoothStep): number => {
  return easing(remap(f, start, end, 0, 1));
};
