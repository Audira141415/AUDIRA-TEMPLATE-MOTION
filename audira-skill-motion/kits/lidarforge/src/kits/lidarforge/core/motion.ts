// LIDARFORGE deterministic motion core — 60 FPS clock, laser scan front & drone kinematics.

export const clamp = (v: number, min: number, max: number): number => Math.min(Math.max(v, min), max);

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const remap = (v: number, inMin: number, inMax: number, outMin = 0, outMax = 1): number => {
  const t = clamp((v - inMin) / (inMax - inMin), 0, 1);
  return outMin + (outMax - outMin) * t;
};

export const ease = {
  smooth: (t: number): number => t * t * (3 - 2 * t),
  // Drone flight curve: gradual velocity ramp
  droneGlide: (t: number): number => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  scanSweep: (t: number): number => Math.sin(t * (Math.PI / 2)),
};

export const seg = (f: number, start: number, end: number, easing = ease.smooth): number => {
  return easing(remap(f, start, end, 0, 1));
};

/** Compute scanline plane coordinate along Z axis */
export const scanFrontZ = (f: number, startZ = -8, endZ = 8, startFrame = 30, endFrame = 360): number => {
  const progress = clamp(remap(f, startFrame, endFrame, 0, 1), 0, 1);
  return lerp(startZ, endZ, progress);
};

