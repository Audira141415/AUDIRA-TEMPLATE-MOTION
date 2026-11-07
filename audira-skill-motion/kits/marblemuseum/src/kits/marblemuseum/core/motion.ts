// Deterministic, frame-driven motion for MARBLEMUSEUM. Everything derives from t (seconds).

export const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
};

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const smooth = (a: number, b: number, x: number) => {
  const k = clamp01((x - a) / (b - a));
  return k * k * (3 - 2 * k);
};
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** Gentle ease in-out over the whole film: reverent, never abrupt. */
export const easeInOut = (k: number) => {
  const x = clamp01(k);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

export const BUST_HEAD: [number, number, number] = [0, 2.58, 0];

/** Skylight strength: soft gallery light, then the sun finds the face at the payoff. */
export const skylight = (t: number) => 0.55 + 0.25 * smooth(0, 4, t) + 0.6 * smooth(8.4, 10.2, t);

/** Museum label card visibility. */
export const labelIn = (t: number) => smooth(9.0, 9.9, t);
