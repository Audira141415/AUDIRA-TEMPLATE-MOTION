// MANUSCRIPT motion core. Everything derives from the 60-based frame clock `f`.

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ramp = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const smooth = (x: number) => x * x * (3 - 2 * x);
export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

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
export const vnoise = (x: number, seed = 0) => {
  const i = Math.floor(x);
  const fr = x - i;
  const a = hash(i + seed * 57.3);
  const b = hash(i + 1 + seed * 57.3);
  return a + (b - a) * smooth(fr);
};
export const candleFlicker = (t: number, seed: number) => 0.84 + 0.11 * vnoise(t * 5.5, seed) + 0.05 * vnoise(t * 15, seed + 2);

/** Lectern tilt (rotation about X) and placement. Pages live in the lectern's local XY plane. */
export const LECTERN = { pos: [0, 0.55, -0.25] as [number, number, number], tilt: -0.5 };
/** Local page point -> world point (for camera targets). */
export const pageToWorld = (x: number, y: number, z = 0.04): [number, number, number] => {
  const c = Math.cos(LECTERN.tilt);
  const s = Math.sin(LECTERN.tilt);
  return [LECTERN.pos[0] + x, LECTERN.pos[1] + y * c - z * s, LECTERN.pos[2] + y * s + z * c];
};

/** Ink lines on the right page: 12 lines written one after the other. */
export const INK_LINES = 12;
export const INK_START = 1.9;
export const INK_STEP = 0.55;
export const INK_DUR = 0.5;
export const lineProgress = (t: number, i: number) => smooth(clamp((t - (INK_START + i * INK_STEP)) / INK_DUR));
export const LINE_X0 = 0.08;
export const LINE_W = 0.48;
export const lineY = (i: number) => 0.3 - i * 0.052;

export interface ManuscriptState {
  t: number;
  /** gold-leaf gleam sweep position -1..1 and power (hook + payoff) */
  gleamX: number;
  gleamPower: number;
  /** lontar cover lift and leaf fan, 0..1 */
  coverLift: number;
  fan: number;
}

export const computeManuscriptState = (f: number): ManuscriptState => {
  const t = f / 60;
  const hook = ramp(t, 0.0, 2.2);
  const pay = ramp(t, 9.0, 11.2);
  const gleamX = t < 5 ? lerp(-1, 1, smooth(hook)) : lerp(-1, 1, smooth(pay));
  const gleamPower = t < 5 ? Math.sin(Math.PI * hook) : Math.sin(Math.PI * pay);
  return { t, gleamX, gleamPower, coverLift: easeInOut(ramp(t, 5.6, 6.6)), fan: easeInOut(ramp(t, 6.2, 9.2)) };
};
