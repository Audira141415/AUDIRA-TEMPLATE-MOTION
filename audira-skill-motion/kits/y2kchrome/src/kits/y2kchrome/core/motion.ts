// Y2KCHROME motion core — pure functions of the 60-FPS-normalised frame `f`.
// Playful bounce, liquid wobble and a final morph into a four-point chrome sparkle.

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const win = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const smooth = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
export const easeInOutCubic = (x: number) => {
  const t = clamp01(x);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
export const easeOutElastic = (x: number) => {
  const t = clamp01(x);
  if (t === 0 || t === 1) return t;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
};

export const mulberry32 = (seed: number) => () => {
  let s = (seed = (seed + 0x6d2b79f5) | 0);
  s = Math.imul(s ^ (s >>> 15), s | 1);
  s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
  return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
};

// ---- Story clock (seconds) ----
export const DROP_HIT = 1.05; // falling chrome drop splashes into the blob
export const MERGE = [4.6, 5.6, 6.6]; // satellite droplets merge
export const MORPH_A = 8.6; // blob → sparkle star
export const MORPH_B = 9.9;
export const BURST = 10.1; // bubbles pop + flare

export interface BlobState {
  t: number;
  /** squash/stretch from impacts (−1..1, + = tall) */
  squash: number;
  /** wobble amplitude for liquid noise */
  wobble: number;
  /** 0 = liquid blob, 1 = sparkle star */
  morph: number;
  /** vertical bounce offset */
  bounceY: number;
}

const impact = (t: number, at: number, amp: number) => {
  const a = t - at;
  return a > 0 ? Math.sin(a * 13) * Math.exp(-a * 3.2) * amp : 0;
};

export const computeBlobState = (f: number): BlobState => {
  const t = f / 60;
  let squash = impact(t, DROP_HIT, -0.32);
  for (const m of MERGE) squash += impact(t, m, 0.12);
  squash += impact(t, MORPH_B, 0.18);
  const wobble = 0.05 + 0.07 * Math.exp(-Math.max(0, t - DROP_HIT) * 1.2) * (t > DROP_HIT ? 1 : 0) + 0.02 * Math.sin(t * 0.7) ** 2;
  const morph = easeOutElastic(win(t, MORPH_A, MORPH_B));
  const bounceY = Math.abs(Math.sin(t * 2.2)) * 0.08 * (1 - smooth(win(t, MORPH_A, MORPH_B)));
  return { t, squash, wobble, morph, bounceY };
};
