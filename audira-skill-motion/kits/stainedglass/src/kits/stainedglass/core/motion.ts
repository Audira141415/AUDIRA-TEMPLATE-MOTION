// Deterministic, frame-driven motion for STAINEDGLASS. Everything derives from t (seconds).

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

/** Ease-out with a small settle overshoot: pane "clicks" into its lead came. */
export const easeOutBack = (k: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  const x = clamp01(k) - 1;
  return 1 + c3 * x * x * x + c1 * x * x;
};

export const FLIGHT = 0.95; // seconds a pane takes to fly in

/** 0 before the pane starts, 1 once seated. */
export const paneProgress = (t: number, delay: number) => clamp01((t - delay) / FLIGHT);

/** Brightness of the sun behind the glass: dawn glow, then a full burst at the payoff. */
export const sunGlow = (t: number) => 0.55 + 0.45 * smooth(1, 7, t) + 0.75 * smooth(8.6, 10.2, t) + 0.05 * Math.sin(t * 1.3);

/** Fraction of the window assembled (drives floor light pools and HUD counter). */
export const assembled = (t: number) => smooth(0.4, 8.4, t);

type Key = { t: number; v: [number, number, number] };
/** Catmull-Rom through keyframes (time-uniform), so the camera never stops between keys. */
export const track = (keys: Key[], t: number): [number, number, number] => {
  if (t <= keys[0].t) return keys[0].v;
  const last = keys[keys.length - 1];
  if (t >= last.t) return last.v;
  let i = 0;
  while (t > keys[i + 1].t) i++;
  const p0 = keys[Math.max(0, i - 1)].v;
  const p1 = keys[i].v;
  const p2 = keys[i + 1].v;
  const p3 = keys[Math.min(keys.length - 1, i + 2)].v;
  const u = (t - keys[i].t) / (keys[i + 1].t - keys[i].t);
  const u2 = u * u;
  const u3 = u2 * u;
  return [0, 1, 2].map(
    (a) => 0.5 * (2 * p1[a] + (-p0[a] + p2[a]) * u + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * u2 + (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * u3),
  ) as [number, number, number];
};
