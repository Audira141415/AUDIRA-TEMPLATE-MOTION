import { lerp, smooth, track } from "../core/motion";
import type { DreamShot } from "../lib/post";

type V = [number, number, number];

/**
 * Slow floating camera: hovers just above the pool water watching a door open by itself, drifts
 * down the tiled room under the indoor clouds, passes through the great arch and rises toward
 * the stairs to nowhere as the door at the top lights up.
 */
const POS: { t: number; v: V }[] = [
  { t: 0, v: [-0.7, 1.0, 8.9] },
  { t: 3, v: [-0.3, 1.25, 6.2] },
  { t: 6, v: [0.2, 1.6, 2.2] },
  { t: 9, v: [0.4, 2.0, -1.8] },
  { t: 12, v: [0.7, 2.4, -4.6] },
];
const TARGET: { t: number; v: V }[] = [
  { t: 0, v: [1.0, 1.0, 4.6] },
  { t: 3, v: [0.4, 1.6, 0] },
  { t: 6, v: [0.5, 2.0, -6] },
  { t: 9, v: [1.4, 2.6, -12] },
  { t: 12, v: [1.8, 3.1, -14.5] },
];

export const getDreamCamera = (t: number): DreamShot => ({
  pos: track(POS, t),
  target: track(TARGET, t),
  fov: lerp(48, 56, smooth(5, 11, t)),
  roll: Math.sin(t * 0.33) * 0.025,
  exposure: 0.68,
});
