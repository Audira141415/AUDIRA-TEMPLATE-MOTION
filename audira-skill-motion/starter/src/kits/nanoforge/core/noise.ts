// NANOFORGE deterministic seeded noise — pseudo-random distribution for bio-particles & molecular nodes.

export const hash = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

export const hash3 = (x: number, y: number, z: number): number => {
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return n - Math.floor(n);
};

/** Deterministic pseudo-random position in sphere */
export const randomPointInSphere = (seed: number, radius: number): [number, number, number] => {
  const u = hash(seed);
  const v = hash(seed + 100);
  const theta = u * 2.0 * Math.PI;
  const phi = Math.acos(2.0 * v - 1.0);
  const r = Math.cbrt(hash(seed + 200)) * radius;
  const sinPhi = Math.sin(phi);
  return [
    r * sinPhi * Math.cos(theta),
    r * sinPhi * Math.sin(theta),
    r * Math.cos(phi),
  ];
};
