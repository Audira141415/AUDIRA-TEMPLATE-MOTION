// RISOFORGE timeline. Everything derives from f (60 fps-normalised frame), so the
// preview (30 fps) and the final (60 fps) show identical poses at identical seconds.

export type V3 = [number, number, number];

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const ramp = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const smooth = (x: number) => {
  const c = clamp01(x);
  return c * c * (3 - 2 * c);
};
export const easeInOut = (x: number) => {
  const c = clamp01(x);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};
export const easeOutBack = (x: number, k = 2.2) => {
  const c = clamp01(x) - 1;
  return 1 + (k + 1) * c * c * c + k * c * c;
};
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const lerp3 = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
export const bezier3 = (a: V3, c: V3, b: V3, k: number): V3 => lerp3(lerp3(a, c, k), lerp3(c, b, k), k);

/** Seeded PRNG (mulberry32) — never use Math.random in a render. */
export const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// Story beats (seconds)
export const BEAT = {
  popStart: 1.5,
  popEnd: 4.6,
  dollyStart: 4.8,
  sunRise: [8.4, 10.6] as const,
  end: 12,
};

/** Pop-up layer: lies flat (printed) on the floor page, then hinges up to stand. */
export const layerLift = (t: number, index: number) => {
  const a = BEAT.popStart + index * 0.42;
  return easeOutBack(ramp(t, a, a + 0.9), 1.3);
};

/**
 * Misregistration: each ink drum drifts a little and re-jitters at 10 fps (stepped), like paper creeping
 * through the drum. Returns a small world-space offset (x, y) for that drum.
 */
export const misregister = (t: number, drum: number, amount = 0.028): [number, number] => {
  const step = Math.floor(t * 10);
  const r = rng(1000 + drum * 7919 + step * 31);
  const settle = 1 - 0.55 * smooth(ramp(t, 10.4, 11.2)); // registration tightens on the payoff
  return [(r() - 0.5) * 2 * amount * settle + drum * 0.006, (r() - 0.5) * 2 * amount * settle - drum * 0.004];
};

export interface RisoState {
  t: number;
  lifts: number[];
  sunY: number;
  plantGrow: number;
  birdsX: number;
  printFlash: number;
}

export const computeRisoState = (f: number): RisoState => {
  const t = f / 60;
  return {
    t,
    lifts: [0, 1, 2, 3, 4, 5].map((i) => layerLift(t, i)),
    sunY: lerp(1.2, 4.1, easeInOut(ramp(t, BEAT.sunRise[0], BEAT.sunRise[1]))) + lerp(0, 0.6, smooth(ramp(t, 0.2, 3.5))),
    plantGrow: smooth(ramp(t, 5.6, 9.6)),
    birdsX: -3 + t * 0.55,
    printFlash: Math.max(0, 1 - t / 0.35),
  };
};
