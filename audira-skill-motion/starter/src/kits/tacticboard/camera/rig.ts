// TACTICBOARD camera — broadcast-analysis sweep: high tactical overhead -> low pitch-side angle at the goal.
// Catmull-Rom through timed keys, so the camera never stops between beats.
import { clamp, lerp } from "../core/motion";

export type TacticPose = { position: [number, number, number]; target: [number, number, number]; fov: number };

type CamKey = { t: number; pos: [number, number, number]; tgt: [number, number, number]; fov: number };

const KEYS: CamKey[] = [
  { t: 0, pos: [0.4, 12.6, 6.2], tgt: [0.2, 0, -0.4], fov: 44 },
  { t: 3.0, pos: [1.6, 10.4, 5.4], tgt: [0.9, 0, -1.2], fov: 42 },
  { t: 5.6, pos: [4.6, 5.6, 1.4], tgt: [1.4, 0, -2.8], fov: 40 },
  { t: 7.8, pos: [2.9, 1.55, -1.6], tgt: [0.1, 0.35, -4.7], fov: 40 },
  { t: 9.8, pos: [2.7, 2.3, -1.9], tgt: [0.5, 0.1, -3.9], fov: 40 },
  { t: 12, pos: [-1.0, 1.6, -2.2], tgt: [0.0, 0.15, -4.6], fov: 40 },
];

const cr = (p0: number, p1: number, p2: number, p3: number, k: number) =>
  0.5 * (2 * p1 + (-p0 + p2) * k + (2 * p0 - 5 * p1 + 4 * p2 - p3) * k * k + (-p0 + 3 * p1 - 3 * p2 + p3) * k * k * k);

export const getTacticCamera = (t: number): TacticPose => {
  const tt = clamp(t, 0, 12);
  let i = 0;
  while (i < KEYS.length - 2 && tt > KEYS[i + 1].t) i++;
  const a = KEYS[Math.max(0, i - 1)];
  const b = KEYS[i];
  const c = KEYS[i + 1];
  const d = KEYS[Math.min(KEYS.length - 1, i + 2)];
  const raw = clamp((tt - b.t) / (c.t - b.t));
  const k = raw * raw * (3 - 2 * raw) * 0.5 + raw * 0.5; // never fully stops at a key
  const v = (sel: (x: CamKey) => [number, number, number]) =>
    [0, 1, 2].map((j) => cr(sel(a)[j], sel(b)[j], sel(c)[j], sel(d)[j], k)) as [number, number, number];
  return { position: v((x) => x.pos), target: v((x) => x.tgt), fov: lerp(b.fov, c.fov, k) };
};
