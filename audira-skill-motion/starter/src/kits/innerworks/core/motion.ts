// INNERWORKS deterministic motion core — mechanical gear ratios, x-ray slicing & piston kinematics.

export const clamp = (v: number, min: number, max: number): number => Math.min(Math.max(v, min), max);

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const remap = (v: number, inMin: number, inMax: number, outMin = 0, outMax = 1): number => {
  const t = clamp((v - inMin) / (inMax - inMin), 0, 1);
  return outMin + (outMax - outMin) * t;
};

export const ease = {
  smooth: (t: number): number => t * t * (3 - 2 * t),
  cubicInOut: (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};

export const seg = (f: number, start: number, end: number, easing = ease.smooth): number => {
  return easing(remap(f, start, end, 0, 1));
};

/** Compute exact angular rotation for meshed gears based on teeth ratio */
export const gearRotation = (baseAngle: number, ratio: number, direction: 1 | -1 = 1): number => {
  return baseAngle * ratio * direction;
};
