// SKETCHFORGE timeline. Everything derives from f (60 fps-normalised frame), so the
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
  draw: [0.15, 2.7] as const,
  extrude: [2.5, 4.9] as const,
  clay: [4.7, 7.0] as const,
  colour: [6.9, 9.2] as const,
  lift: [9.0, 10.6] as const,
  end: 12,
};

/** Oblique "drawing" projection of a 3D point onto the sketchbook page (y = 0):
 *  height runs up the page (-z), depth recedes diagonally — reads like a hand-drawn 3/4 sketch from above. */
export const flatten = (p: V3): V3 => [p[0] + p[2] * 0.42, 0.004, p[2] * 0.5 - p[1] * 0.95 + 0.35];

export interface SketchState {
  t: number;
  draw: number; // 0..1 portion of strokes drawn
  extrude: number; // 0..1 global lift progress
  clay: number; // clip-plane fill 0..1
  colour: number; // clay -> colour 0..1
  wire: number; // wire visibility 1 -> 0
  lift: number; // house float height
  spin: number; // house yaw on the payoff
  smoke: number; // chimney puff clock
}

export const computeSketchState = (f: number): SketchState => {
  const t = f / 60;
  const lift = easeOutBack(ramp(t, BEAT.lift[0], BEAT.lift[1]), 1.4);
  return {
    t,
    draw: ramp(t, BEAT.draw[0], BEAT.draw[1]),
    extrude: ramp(t, BEAT.extrude[0], BEAT.extrude[1]),
    clay: easeInOut(ramp(t, BEAT.clay[0], BEAT.clay[1])),
    colour: easeInOut(ramp(t, BEAT.colour[0], BEAT.colour[1])),
    wire: 1 - smooth(ramp(t, BEAT.colour[0] + 0.4, BEAT.colour[1])),
    lift: lift * 0.55 + Math.sin(Math.max(0, t - BEAT.lift[1]) * 2.2) * 0.04 * smooth(ramp(t, BEAT.lift[1], BEAT.lift[1] + 0.5)),
    spin: easeInOut(ramp(t, BEAT.lift[0], BEAT.end)) * 0.5,
    smoke: Math.max(0, t - BEAT.colour[1]),
  };
};
