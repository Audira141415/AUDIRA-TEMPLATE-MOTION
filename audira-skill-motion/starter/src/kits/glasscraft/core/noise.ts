// GLASSCRAFT noise & caustics shimmer utilities.

export const hash = (n: number): number => {
  const s = Math.sin(n * 187.3 + 371.9) * 43758.5453;
  return s - Math.floor(s);
};

export const hash2 = (x: number, y: number): number => {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return s - Math.floor(s);
};

/** Deterministic caustics light intensity shimmer */
export const causticsShimmer = (x: number, z: number, f: number): number => {
  return Math.sin(x * 2.0 + f * 0.08) * Math.cos(z * 2.0 + f * 0.07) * 0.15 + 0.85;
};
