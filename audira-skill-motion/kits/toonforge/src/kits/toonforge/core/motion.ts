// TOONFORGE motion primitives — deterministic curves for anime snap zooms, whip pans, and impact physics.

export const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const remap = (x: number, inMin: number, inMax: number, outMin = 0, outMax = 1) =>
  outMin + ((clamp(x, inMin, inMax) - inMin) / (inMax - inMin)) * (outMax - outMin);

export const bezier = (x1: number, y1: number, x2: number, y2: number) => {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    const X = clamp(x);
    let t = X;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - X;
      const d = dx(t);
      if (Math.abs(e) < 1e-6) return sy(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    let lo = 0, hi = 1;
    t = X;
    for (let i = 0; i < 20; i++) {
      const v = sx(t);
      if (Math.abs(v - X) < 1e-6) break;
      if (v < X) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
    return sy(t);
  };
};

export const ease = {
  /** Anime snap: fast instant jump, sharp stop */
  animeSnap: bezier(0.05, 0.95, 0.1, 1.05),
  /** High-speed whip pan */
  whip: bezier(0.7, 0, 0.1, 1),
  /** Power charge up */
  charge: bezier(0.5, 0, 0.9, 0.3),
  sine: (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(t)),
};

/** Impact camera shake with exponential decay */
export const impactShake = (tAfterImpact: number, intensity = 0.35, decay = 0.18): number => {
  if (tAfterImpact < 0 || tAfterImpact > 30) return 0;
  return Math.sin(tAfterImpact * 1.4) * intensity * Math.exp(-decay * tAfterImpact);
};

export const seg = (f: number, start: number, end: number, curve: (t: number) => number = ease.animeSnap) =>
  curve(clamp((f - start) / (end - start)));

