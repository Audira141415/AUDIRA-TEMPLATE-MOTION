// Seeded, deterministic noise for world-building. Every function is a pure function of its
// inputs (no Math.random), so terrain, scatter and textures are identical in every render tab.

export const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Integer hash → [0, 1). */
export const hash2 = (x: number, y: number, seed = 0) => {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 2147483647)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};

// 2D gradient (Perlin) noise with a seeded permutation table.
const P = new Uint16Array(512);
const GX = new Float32Array(256);
const GY = new Float32Array(256);
{
  const rnd = mulberry32(0x6a52);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) P[i] = p[i & 255];
  for (let i = 0; i < 256; i++) {
    const a = rnd() * Math.PI * 2;
    GX[i] = Math.cos(a);
    GY[i] = Math.sin(a);
  }
}

/** Perlin noise, roughly in [-1, 1]. */
export const noise2 = (x: number, y: number) => {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const X = xi & 255, Y = yi & 255;
  const a = P[X] + Y, b = P[X + 1] + Y;
  const g00 = P[a], g01 = P[a + 1], g10 = P[b], g11 = P[b + 1];
  const d00 = GX[g00] * xf + GY[g00] * yf;
  const d10 = GX[g10] * (xf - 1) + GY[g10] * yf;
  const d01 = GX[g01] * xf + GY[g01] * (yf - 1);
  const d11 = GX[g11] * (xf - 1) + GY[g11] * (yf - 1);
  const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10);
  const v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
  const x0 = d00 + (d10 - d00) * u;
  const x1 = d01 + (d11 - d01) * u;
  return (x0 + (x1 - x0) * v) * 1.414;
};

// Octaves are rotated ~37° against each other so the lattice never lines up.
const RC = 0.8, RS = 0.6;

/** Fractal sum, roughly in [-1, 1]. */
export const fbm = (x: number, y: number, oct: number, gain = 0.5) => {
  let s = 0, a = 1, n = 0;
  for (let i = 0; i < oct; i++) {
    s += a * noise2(x, y);
    n += a;
    const nx = (RC * x - RS * y) * 2.03 + 17.1;
    y = (RS * x + RC * y) * 2.03 + 3.7;
    x = nx;
    a *= gain;
  }
  return s / n;
};

/** Ridged multifractal in [0, 1]: sharp crests, eroded-looking valleys. */
export const ridged = (x: number, y: number, oct: number, gain = 0.5) => {
  let s = 0, a = 1, n = 0, w = 1;
  for (let i = 0; i < oct; i++) {
    let r = 1 - Math.abs(noise2(x, y));
    r *= r;
    r *= w;
    w = Math.min(1, r * 1.8);
    s += a * r;
    n += a;
    const nx = (RC * x - RS * y) * 2.07 + 31.3;
    y = (RS * x + RC * y) * 2.07 + 7.9;
    x = nx;
    a *= gain;
  }
  return s / n;
};

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Polynomial smooth minimum. */
export const smin = (a: number, b: number, k: number) => {
  const h = clamp01(0.5 + (0.5 * (b - a)) / k);
  return lerp(b, a, h) - k * h * (1 - h);
};
