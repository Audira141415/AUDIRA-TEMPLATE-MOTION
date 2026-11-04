// LIDARFORGE terrain elevation synthesis — deterministic topography generator for point cloud returns.

export const hash = (n: number): number => {
  const x = Math.sin(n * 157.1 + 423.7) * 43758.5453;
  return x - Math.floor(x);
};

export const hash2 = (x: number, z: number): number => {
  const n = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
  return n - Math.floor(n);
};

/** Multi-octave terrain elevation */
export const terrainHeight = (x: number, z: number): number => {
  const h1 = Math.sin(x * 0.35) * Math.cos(z * 0.35) * 1.8;
  const h2 = Math.sin(x * 0.75 + 1.2) * Math.cos(z * 0.82) * 0.7;
  const h3 = (hash2(Math.floor(x * 2), Math.floor(z * 2)) - 0.5) * 0.35;
  // Natural valley basin profile
  const basin = 0.5 + 0.5 * Math.sin(z * 0.2);
  return (h1 + h2 + h3) * basin;
};

