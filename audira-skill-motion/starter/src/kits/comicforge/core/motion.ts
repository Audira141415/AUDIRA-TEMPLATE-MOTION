// COMICFORGE timeline. Everything derives from f (60 fps-normalised frame), so the
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
  pushThroughPanels: [0, 3.6] as const,
  crouch: 4.2,
  leap: 4.7,
  impact: 8.8,
  end: 12,
};

export const HERO_START: V3 = [-0.6, 0, 0.6];
export const DRONE_HIT: V3 = [2.7, 5.6, -5.4];
export const HERO_TARGET: V3 = [DRONE_HIT[0] - 0.55, DRONE_HIT[1] - 0.35, DRONE_HIT[2] + 0.75];

export interface ComicState {
  t: number;
  heroPos: V3;
  heroPitch: number; // 0 standing, ~1.25 flying horizontal
  heroYaw: number;
  heroCrouch: number; // 0..1
  capeFlutter: number;
  punch: number; // fist extension 0..1
  flying: number; // 0..1 speed-line intensity
  dronePos: V3;
  droneAlive: number; // 1 alive, 0 destroyed
  boom: number; // 0..1 time since impact (normalised over 3.2 s)
  balloon: number; // speech balloon visibility 0..1
  shake: number;
}

export const computeComicState = (f: number): ComicState => {
  const t = f / 60;
  const leapK = easeInOut(ramp(t, BEAT.leap, BEAT.impact));
  const crouch = smooth(ramp(t, BEAT.crouch, BEAT.leap)) * (1 - smooth(ramp(t, BEAT.leap, BEAT.leap + 0.25)));

  // flight arc: rooftop -> above the street -> drone (hero stops just short of the drone centre)
  const target = HERO_TARGET;
  let heroPos: V3 = t < BEAT.leap ? HERO_START : bezier3(HERO_START, [-1.2, 6.2, -1.0], target, leapK);
  if (t >= BEAT.impact) {
    const after = t - BEAT.impact;
    const recoil = Math.exp(-after * 3.2) * 0.5;
    heroPos = [target[0] - recoil, target[1] + 0.18 * Math.sin(after * 2.6) - recoil * 0.3, target[2] + recoil * 0.4];
  }

  const heroPitch = t < BEAT.leap ? 0 : t < BEAT.impact ? 1.15 * smooth(ramp(t, BEAT.leap, BEAT.leap + 0.6)) : 1.15 * (1 - smooth(ramp(t, BEAT.impact + 0.4, BEAT.impact + 1.4))) + 0.15;
  // hero faces the reader on the roof, turns into the flight line (away from camera), then turns back to pose
  const FLIGHT_YAW = Math.atan2(target[0] - HERO_START[0], target[2] - HERO_START[2]);
  const heroYaw =
    t < BEAT.impact
      ? lerp(0.35, FLIGHT_YAW, smooth(ramp(t, BEAT.leap - 0.1, BEAT.leap + 0.5)))
      : lerp(FLIGHT_YAW, 0.3, smooth(ramp(t, BEAT.impact + 0.5, BEAT.impact + 1.9)));
  const punch = smooth(ramp(t, BEAT.impact - 0.45, BEAT.impact)) * (1 - smooth(ramp(t, BEAT.impact + 1.6, BEAT.impact + 2.2))) + (t > BEAT.impact + 2.2 ? smooth(ramp(t, BEAT.impact + 2.2, BEAT.impact + 2.6)) * 0.9 : 0);

  const approach = smooth(ramp(t, 1.0, BEAT.impact));
  const dronePos: V3 = lerp3([7.5, 9.5, -16], DRONE_HIT, approach);
  dronePos[1] += Math.sin(t * 3.1) * 0.12 * (t < BEAT.impact ? 1 : 0);
  const droneAlive = t < BEAT.impact ? 1 : 0;
  const boom = ramp(t, BEAT.impact, BEAT.impact + 3.2);

  const balloon = smooth(ramp(t, 5.1, 5.45)) * (1 - smooth(ramp(t, 8.2, 8.5)));
  const shake = t > BEAT.impact ? Math.exp(-(t - BEAT.impact) * 5) : 0;

  return {
    t,
    heroPos,
    heroPitch,
    heroYaw,
    heroCrouch: crouch,
    capeFlutter: Math.sin(t * 9.0) * (0.35 + 0.65 * smooth(ramp(t, BEAT.leap, BEAT.leap + 0.4))),
    punch,
    flying: smooth(ramp(t, BEAT.leap + 0.15, BEAT.leap + 0.6)) * (1 - smooth(ramp(t, BEAT.impact - 0.05, BEAT.impact + 0.2))),
    dronePos,
    droneAlive,
    boom,
    balloon,
    shake,
  };
};
