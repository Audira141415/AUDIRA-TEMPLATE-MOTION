// POLYVERSE deterministic noise utilities for terrain vertices and cloud scattering.

export const hash = (n: number): number => {
  const s = Math.sin(n * 149.3 + 491.7) * 43758.5453;
  return s - Math.floor(s);
};

export const hash2 = (x: number, y: number): number => {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return s - Math.floor(s);
};
