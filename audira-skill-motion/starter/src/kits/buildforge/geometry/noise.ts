// Seeded randomness and smooth value noise. Everything procedural derives from fixed seeds,
// so a frame renders identically on every machine and every render pass.

export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const hash2 = (x: number, y: number) => {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

const fade = (t: number) => t * t * (3 - 2 * t);

/** 2D value noise in [0, 1]. */
export const noise2 = (x: number, y: number) => {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = fade(x - xi), yf = fade(y - yi);
  const a = hash2(xi, yi), b = hash2(xi + 1, yi), c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
};

/** Fractal noise centred on 0, roughly in [-0.5, 0.5]. */
export const fbm2 = (x: number, y: number, octaves = 4) => {
  let s = 0, amp = 0.5, f = 1, norm = 0;
  for (let i = 0; i < octaves; i++) {
    s += amp * (noise2(x * f + i * 17.3, y * f - i * 9.1) - 0.5);
    norm += amp;
    amp *= 0.5;
    f *= 2.03;
  }
  return s / norm;
};

/** Cheap 3D noise for organic displacement (foliage), in [-0.5, 0.5]. */
export const noise3 = (x: number, y: number, z: number) => (noise2(x + z * 1.7, y - z * 0.6) + noise2(y * 1.3 - z, x * 0.8 + z * 1.1)) * 0.5 - 0.5;
