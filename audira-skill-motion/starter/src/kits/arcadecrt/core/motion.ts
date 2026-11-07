// ARCADECRT timeline. Everything derives from f (60 fps-normalised frame), so the
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
  powerOn: [0.25, 0.9] as const, // CRT warm-up: line -> full raster
  pushIn: [1.6, 7.25] as const, // dolly into the screen
  dive: 7.3, // flash + we are inside the game
  grab: 10.1, // hero grabs the star
  end: 12,
};

export interface ArcadeState {
  t: number;
  power: number; // 0..1 CRT warm-up
  inside: boolean; // camera is inside the pixel world
  flash: number; // dive flash 0..1
  stick: number; // joystick tilt (-1..1)
  buttonPress: number; // 0..1 (A button)
  coinBlink: number; // INSERT COIN blink 0/1
}

export const computeArcadeState = (f: number): ArcadeState => {
  const t = f / 60;
  const flashIn = smooth(ramp(t, BEAT.dive - 0.25, BEAT.dive));
  const flashOut = 1 - smooth(ramp(t, BEAT.dive, BEAT.dive + 0.55));
  return {
    t,
    power: easeInOut(ramp(t, BEAT.powerOn[0], BEAT.powerOn[1])),
    inside: t >= BEAT.dive,
    flash: t < BEAT.dive ? flashIn : flashOut,
    stick: Math.sin(t * 5.2) * 0.6 * smooth(ramp(t, 1.0, 1.4)) + (Math.sin(t * 13) > 0.7 ? 0.3 : 0),
    buttonPress: Math.max(0, Math.sin(t * 6.5)) > 0.85 ? 1 : 0,
    coinBlink: Math.floor(t * 2.4) % 2,
  };
};
