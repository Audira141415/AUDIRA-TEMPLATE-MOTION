// DISASTERSIM camera — starts nose-to-nose with the locked fault on the cut face, pulls back to a 3/4
// overview at the rupture, then travels with the wave toward the coastal town. Small damped shake at the slip.
import { clamp, lerp, shake } from "../core/motion";

export type DisasterPose = { position: [number, number, number]; target: [number, number, number]; fov: number };
type CamKey = { t: number; pos: [number, number, number]; tgt: [number, number, number]; fov: number };

const KEYS: CamKey[] = [
  { t: 0, pos: [1.6, -0.8, 7.6], tgt: [0.9, -1.45, 1.8], fov: 40 },
  { t: 2.6, pos: [0.6, -0.3, 10.6], tgt: [0.6, -1.5, 0.6], fov: 40 },
  { t: 5.0, pos: [-5.2, 4.6, 13.5], tgt: [0.3, -1.1, 0.0], fov: 40 },
  { t: 7.8, pos: [5.0, 4.2, 11.5], tgt: [1.5, -0.5, 0.0], fov: 40 },
  { t: 10.2, pos: [0.4, 2.3, 8.2], tgt: [2.2, -0.1, 0.0], fov: 40 },
  { t: 12, pos: [-0.4, 2.9, 7.2], tgt: [2.5, 0.0, -0.2], fov: 40 },
];

const cr = (p0: number, p1: number, p2: number, p3: number, k: number) =>
  0.5 * (2 * p1 + (-p0 + p2) * k + (2 * p0 - 5 * p1 + 4 * p2 - p3) * k * k + (-p0 + 3 * p1 - 3 * p2 + p3) * k * k * k);

export const getDisasterCamera = (t: number): DisasterPose => {
  const tt = clamp(t, 0, 12);
  let i = 0;
  while (i < KEYS.length - 2 && tt > KEYS[i + 1].t) i++;
  const a = KEYS[Math.max(0, i - 1)];
  const b = KEYS[i];
  const c = KEYS[i + 1];
  const d = KEYS[Math.min(KEYS.length - 1, i + 2)];
  const raw = clamp((tt - b.t) / (c.t - b.t));
  const k = raw * raw * (3 - 2 * raw) * 0.5 + raw * 0.5;
  const v = (sel: (x: CamKey) => [number, number, number]) =>
    [0, 1, 2].map((j) => cr(sel(a)[j], sel(b)[j], sel(c)[j], sel(d)[j], k)) as [number, number, number];
  const pos = v((x) => x.pos);
  const [sx, sy] = shake(t);
  return { position: [pos[0] + sx, pos[1] + sy, pos[2]], target: v((x) => x.tgt), fov: lerp(b.fov, c.fov, k) };
};
