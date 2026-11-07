// MISTISFORGE motion core: every value is derived from the 60-based frame clock `f`.
// No Date, no unseeded Math.random: use `mulberry32(seed)` for any scatter.

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ramp = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const smooth = (x: number) => x * x * (3 - 2 * x);
export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export const mulberry32 = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** Smooth 1D value noise in [0,1]. */
export const vnoise = (x: number, seed = 0) => {
  const i = Math.floor(x);
  const fr = x - i;
  const a = hash(i + seed * 57.3);
  const b = hash(i + 1 + seed * 57.3);
  return a + (b - a) * smooth(fr);
};

/** Oil-lamp (pelita) flicker multiplier around 1.0. */
export const pelitaFlicker = (t: number, seed: number) =>
  0.82 + 0.12 * vnoise(t * 7.0, seed) + 0.06 * vnoise(t * 19.0, seed + 3);

export interface MistisState {
  t: number;
  /** 0..1 fog density build-up across the film. */
  fogBuild: number;
  /** 0..1 visibility of the pale silhouette in the fog. */
  apparition: number;
  /** lantern brightness multiplier (gutters during the payoff). */
  lanternGutter: number;
  /** moon brightening during payoff. */
  moonSurge: number;
  /** wind used for bamboo and roots. */
  wind: number;
}

export const computeMistisState = (f: number): MistisState => {
  const t = f / 60;
  const fogBuild = 0.55 + 0.45 * smooth(ramp(t, 2, 9));
  // Apparition: faint at 6s, clear at ~9.6s, gone by 11s
  const rise = smooth(ramp(t, 5.6, 8.6));
  const fall = 1 - smooth(ramp(t, 10.6, 11.3));
  const apparition = rise * fall;
  // Lanterns gutter together during the payoff then flare back
  const gutter = smooth(ramp(t, 8.9, 9.5)) * (1 - smooth(ramp(t, 10.7, 11.2)));
  const lanternGutter = 1 - 0.78 * gutter;
  const moonSurge = gutter;
  const wind = Math.sin(t * 0.9) * 0.6 + Math.sin(t * 2.3 + 1.2) * 0.25 + gutter * Math.sin(t * 9) * 0.5;
  return { t, fogBuild, apparition, lanternGutter, moonSurge, wind };
};
