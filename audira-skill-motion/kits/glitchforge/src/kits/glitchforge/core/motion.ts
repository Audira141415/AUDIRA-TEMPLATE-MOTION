// GLITCHFORGE timeline. Everything derives from f (60 fps-normalised frame), so the
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
  hookBurst: [1.1, 1.45] as const, // a single sharp burst, then clean again
  creep: [2.2, 4.4] as const, // RGB split + tears creep in
  corrupt: [4.4, 7.4] as const, // blocks, datamosh, pixel sorting escalate
  lost: [7.4, 8.4] as const, // signal lost
  snap: 8.45, // snaps back clean
  stamp: [10.8, 11.05] as const, // last tiny glitch "stamp" on the hero frame
  end: 12,
};

/** Glitch cadence: corruption re-rolls at 12 Hz (stepped), so every frame is reproducible. */
export const GLITCH_HZ = 12;

export interface GlitchState {
  t: number;
  seed: number; // stepped seed
  split: number;
  tear: number;
  block: number;
  mosh: number;
  sort: number;
  lost: number;
  ghost: number; // 3D ghost copies of the object
  slice: number; // 3D slice displacement of the object
  hud: number; // HUD error intensity
}

export const computeGlitchState = (f: number): GlitchState => {
  const t = f / 60;
  const step = Math.floor(t * GLITCH_HZ);
  const r = rng(6800 + step * 13);
  const burst = r(); // 0..1 random strength for this step
  const on = (p: number) => (burst < p ? 0.5 + 0.5 * r() : 0.12 * r());

  const hook = t >= BEAT.hookBurst[0] && t < BEAT.hookBurst[1] ? 1 : 0;
  const creep = smooth(ramp(t, BEAT.creep[0], BEAT.creep[1]));
  const corrupt = smooth(ramp(t, BEAT.corrupt[0], BEAT.corrupt[1]));
  const lost = t >= BEAT.lost[0] && t < BEAT.lost[1] ? 1 : 0;
  const clean = t >= BEAT.snap ? 1 : 0;
  const stamp = t >= BEAT.stamp[0] && t < BEAT.stamp[1] ? 1 : 0;
  const live = (1 - clean) * (1 - lost);

  const split = Math.max(hook * 0.9, live * (creep * 0.35 + corrupt * 0.65) * (0.4 + on(0.6)), stamp * 0.6);
  const tear = Math.max(hook * 0.8, live * creep * on(0.35 + 0.4 * corrupt), stamp * 0.5);
  const block = Math.max(hook * 0.6, live * corrupt * on(0.75));
  const mosh = live * corrupt * corrupt * (0.35 + 0.65 * on(0.6));
  const sort = live * smooth(ramp(t, 5.2, 7.2)) * (0.5 + 0.5 * on(0.7));
  return {
    t,
    seed: (step % 997) + 0.37,
    split,
    tear,
    block,
    mosh,
    sort,
    lost: lost * (0.85 + 0.15 * r()),
    ghost: Math.max(hook * 0.8, live * (creep * 0.4 + corrupt * 0.6) * on(0.5)),
    slice: Math.max(hook * 0.5, live * corrupt * on(0.6)),
    hud: Math.max(hook, live * (creep * 0.5 + corrupt), lost, stamp),
  };
};
