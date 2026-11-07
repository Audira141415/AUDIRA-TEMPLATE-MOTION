// SCALEFORGE motion core — the logarithmic zoom. Objects live in real metres; every frame they are drawn at
// (P - C) / S where S = metres per render unit (10^exponent) and C = the real-space focus point.
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const smooth = (k: number) => {
  const x = clamp(k);
  return x * x * (3 - 2 * x);
};
export const seg = (t: number, a: number, b: number) => smooth((t - a) / (b - a));

/** Seeded PRNG (mulberry32). Never use Math.random in a kit. */
export const prng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let r = Math.imul(s ^ (s >>> 15), 1 | s);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

export type ScaleObj = {
  key: string;
  name: string;
  size: number; // characteristic size in metres (the measured dimension)
  pos: [number, number]; // real centre (x, y) in metres
  height: number; // vertical extent used for the bracket
};

const R_EARTH = 6.371e6;
const R_SUN = 6.957e8;

export const OBJECTS: ScaleObj[] = [
  { key: "ant", name: "ANT", size: 0.005, pos: [0, 0.0009], height: 0.0018 },
  { key: "person", name: "HUMAN", size: 1.75, pos: [1.2, 0.875], height: 1.75 },
  { key: "tower", name: "SKYSCRAPER", size: 330, pos: [60, 165], height: 330 },
  { key: "mountain", name: "MOUNTAIN", size: 8800, pos: [12000, 4400], height: 8800 },
  { key: "earth", name: "EARTH", size: 2 * R_EARTH, pos: [7.2e6, R_EARTH], height: 2 * R_EARTH },
  { key: "sun", name: "SUN", size: 2 * R_SUN, pos: [7.2e6 + R_EARTH + R_SUN + 2.4e7, R_SUN], height: 2 * R_SUN },
];
export const RADII = { earth: R_EARTH, sun: R_SUN };

/** Zoom keys: exponent = log10(metres per render unit), focus = real point at the screen centre. */
type ZKey = { t: number; e: number; c: [number, number] };
const at = (k: string) => OBJECTS.find((o) => o.key === k)!;
const KEYS: ZKey[] = [
  { t: 0, e: Math.log10(0.0016), c: [0.0004, 0.0012] },
  { t: 1.5, e: Math.log10(0.0019), c: [0.0002, 0.001] },
  { t: 3.1, e: Math.log10(1.75 / 3.8), c: [1.0, 0.95] },
  { t: 5.0, e: Math.log10(330 / 4.0), c: [55, 175] },
  { t: 6.8, e: Math.log10(19000 / 3.6), c: [11000, 4600] },
  { t: 8.7, e: Math.log10((2 * R_EARTH) / 3.0), c: [at("earth").pos[0], R_EARTH] },
  { t: 10.6, e: Math.log10((2 * R_SUN) / 2.7), c: [at("sun").pos[0] - 0.42 * R_SUN, R_SUN * 0.8] },
  { t: 12, e: Math.log10((2 * R_SUN) / 2.45), c: [at("sun").pos[0] - 0.42 * R_SUN, R_SUN * 0.8] },
];

/** Hold briefly on each object, then zoom with an ease; focus follows linearly in S, not in log S. */
export const zoomAt = (t: number) => {
  const tt = clamp(t, 0, 12);
  let i = 0;
  while (i < KEYS.length - 2 && tt > KEYS[i + 1].t) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const raw = clamp((tt - a.t) / (b.t - a.t));
  const sm5 = raw * raw * raw * (raw * (raw * 6 - 15) + 10);
  const k = raw * 0.08 + sm5 * 0.92; // long holds on each subject, quick decade jumps between
  const e = lerp(a.e, b.e, k);
  const S = Math.pow(10, e);
  const Sa = Math.pow(10, a.e);
  const Sb = Math.pow(10, b.e);
  const w = Sb === Sa ? k : clamp((S - Sa) / (Sb - Sa));
  const c: [number, number] = [lerp(a.c[0], b.c[0], w), lerp(a.c[1], b.c[1], w)];
  return { e, S, c };
};

/** Real metres -> render units for this frame. */
export const toRender = (p: [number, number], z: { S: number; c: [number, number] }): [number, number] => [
  (p[0] - z.c[0]) / z.S,
  (p[1] - z.c[1]) / z.S,
];

/** Visible render size window: hide sub-pixel and gigantic objects. */
export const visibleSize = (renderSize: number) => renderSize > 0.004 && renderSize < 800;

/** 0 = white studio, 1 = deep space (by exponent). */
export const spaceMix = (e: number) => smooth((e - 3.6) / 2.6);

/** Human-readable length. */
export const fmtLen = (m: number) => {
  if (m < 0.01) return `${(m * 1000).toFixed(m < 0.001 ? 2 : 1)} mm`;
  if (m < 1) return `${(m * 100).toFixed(1)} cm`;
  if (m < 1000) return `${m.toFixed(m < 10 ? 2 : 0)} m`;
  if (m < 1e4) return `${(m / 1000).toFixed(1)} km`;
  if (m < 1e8) return `${Math.round(m / 1000).toLocaleString("en-US")} km`;
  return `${(m / 1e9).toFixed(2)} million km`;
};

/** Order of magnitude of the measured size (for labels like 10^-3 m). */
export const order = (m: number) => Math.floor(Math.log10(m) + 1e-9);

/** Superscript an integer exponent. */
export const sup = (n: number) =>
  String(n)
    .split("")
    .map((ch) => ({ "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" })[ch] ?? ch)
    .join("");
