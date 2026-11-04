// CYBERFORGE motion primitives — deterministic mathematical curves for sci-fi robotics and HUDs.
// Every function is a pure mapping of time/frame, ensuring deterministic rendering across 30 and 60 fps.

export const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const remap = (x: number, inMin: number, inMax: number, outMin = 0, outMax = 1) =>
  outMin + ((clamp(x, inMin, inMax) - inMin) / (inMax - inMin)) * (outMax - outMin);

export const smoothstep = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

export const smootherstep = (t: number) => {
  const x = clamp(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

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
  /** Decisive robotic start with ultra-crisp brake */
  telemetry: bezier(0.16, 1, 0.3, 1),
  /** Smooth cinematic camera arc */
  camera: bezier(0.65, 0, 0.35, 1),
  /** Fast power surge followed by slow sustain */
  surge: bezier(0.08, 0.82, 0.17, 1),
  /** Symmetric smooth sine */
  sine: (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(t)),
  /** Step / Quantize for digital radar ticks */
  quantize: (t: number, steps: number) => Math.floor(clamp(t) * steps) / steps,
  smoother: smootherstep,
};

/** Eased progression through [start, end] frames */
export const seg = (f: number, start: number, end: number, curve: (t: number) => number = ease.camera) =>
  curve(clamp((f - start) / (end - start)));

/** Digital HUD blink pattern: returns 1 or 0 deterministically */
export const blink = (f: number, period = 20, duty = 0.5) => ((f % period) / period < duty ? 1 : 0);
