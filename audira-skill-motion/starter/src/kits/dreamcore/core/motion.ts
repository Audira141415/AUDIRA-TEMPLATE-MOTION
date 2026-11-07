// Deterministic, frame-driven motion for DREAMCORE. Everything derives from t (seconds).

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

/** Slow floating bob: two incommensurate sines so it never loops visibly. */
export const float = (t: number, seed: number, amp = 0.08) => (Math.sin(t * 0.55 + seed) * 0.65 + Math.sin(t * 0.31 + seed * 2.3) * 0.35) * amp;

/** The hook door in the pool swings open, light spilling through. */
export const hookDoorOpen = (t: number) => smooth(0.3, 3.2, t) * 1.15;

/** Outside "sun door" glow for the payoff. */
export const sunDoor = (t: number) => smooth(8.5, 10.5, t);

type Key = { t: number; v: [number, number, number] };
/** Catmull-Rom through time keys so the floating camera never stops. */
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
