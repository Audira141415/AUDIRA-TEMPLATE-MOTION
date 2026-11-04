// GLASSCRAFT motion primitives — deterministic curves for floating spatial glass, buoyancy, and optical refractions.

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
  /** Fluid spatial float with ultra-soft settle */
  spatialFloat: bezier(0.2, 0.8, 0.2, 1),
  /** Decisive glass card reveal */
  cardSnap: bezier(0.16, 1, 0.3, 1),
  sine: (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(t)),
};

/** Deterministic zero-gravity buoyancy bobbing */
export const buoyancy = (f: number, freq = 0.04, amp = 0.08, phase = 0): number => {
  return Math.sin(f * freq + phase) * amp + Math.cos(f * freq * 0.6 + phase) * (amp * 0.35);
};

/** Deterministic liquid surface tension wobble */
export const liquidWobble = (f: number, freq = 0.08, phase = 0): number => {
  return Math.sin(f * freq + phase) * 0.04;
};

export const seg = (f: number, start: number, end: number, curve: (t: number) => number = ease.spatialFloat) =>
  curve(clamp((f - start) / (end - start)));
