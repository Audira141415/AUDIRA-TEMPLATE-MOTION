// Deterministic, frame-driven motion for ABYSSFORGE. Everything derives from t (seconds).

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

export const DESCENT_UNITS = 38;
export const DURATION = 12;

/** 0..1 progress of the descent: steady glide blended with an ease so it never stops. */
export const descent = (t: number) => {
  const k = clamp01(t / DURATION);
  return 0.55 * k + 0.45 * k * k * (3 - 2 * k);
};

/** Camera world height at time t. */
export const cameraDepthY = (t: number) => 1.2 - descent(t) * DESCENT_UNITS;

/** Displayed depth in metres (HUD): 60 m at the hook, ~3,900 m at the trench floor. */
export const depthMetres = (t: number) => 60 + descent(t) * 3840;

export const zoneName = (m: number) => (m < 200 ? "SUNLIGHT ZONE" : m < 1000 ? "TWILIGHT ZONE" : m < 4000 ? "MIDNIGHT ZONE" : "ABYSSAL ZONE");

/** How much surface light survives (1 near surface, 0 below ~1,000 m). */
export const surfaceLight = (t: number) => 1 - smooth(0.0, 0.42, descent(t));

/** Jellyfish bell contraction 0..1 (sharp squeeze, slow relax). */
export const pulse = (t: number, rate: number, phase: number) => {
  const s = Math.sin(t * rate + phase);
  return s > 0 ? Math.pow(s, 2.4) : 0;
};

/** Lure ignition for the payoff: flickers on at ~8.7 s, steady from ~9.4 s. */
export const lureLight = (t: number) => {
  if (t < 8.6) return 0;
  if (t < 9.4) {
    const k = (t - 8.6) / 0.8;
    const flick = Math.sin(t * 61) > 0.1 ? 1 : 0.15;
    return k * flick;
  }
  return 1 + 0.08 * Math.sin(t * 5.3);
};
