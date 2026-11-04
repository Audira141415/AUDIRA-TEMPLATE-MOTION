// INKSTORY deterministic motion core — 60 FPS clock, ink dispersion bleeding & poetic zen easing.

export const clamp = (v: number, min: number, max: number): number => Math.min(Math.max(v, min), max);

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const remap = (v: number, inMin: number, inMax: number, outMin = 0, outMax = 1): number => {
  const t = clamp((v - inMin) / (inMax - inMin), 0, 1);
  return outMin + (outMax - outMin) * t;
};

export const ease = {
  // Gentle, contemplative, meditative motion
  zenFloat: (t: number): number => Math.sin(t * (Math.PI / 2)),
  // Calligraphic brush stroke: decisive entry, sweeping flow, tapering lift
  brushStroke: (t: number): number => {
    return t < 0.2 ? (t / 0.2) * 1.2 : 1.2 - 0.2 * ((t - 0.2) / 0.8);
  },
  smoothWash: (t: number): number => t * t * (3 - 2 * t),
};

export const seg = (f: number, start: number, end: number, easing = ease.smoothWash): number => {
  return easing(remap(f, start, end, 0, 1));
};

/** Deterministic mist billow oscillation across Xuan paper canvas */
export const mistBillow = (f: number, freq = 0.02, amp = 0.15, phase = 0): number => {
  return (
    Math.sin(f * freq + phase) * amp * 0.7 +
    Math.sin(f * freq * 1.8 + phase * 2.0) * amp * 0.3
  );
};

