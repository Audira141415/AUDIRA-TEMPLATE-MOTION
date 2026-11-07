import { lerp, smooth, track } from "../core/motion";
import type { MosaicShot } from "../lib/post";

type V = [number, number, number];

/**
 * Low glide across the bed just behind the settling wave (tiles rain past the lens), then a
 * continuous rise to an almost-overhead view that reveals the whole picture at the payoff.
 */
const POS: { t: number; v: V }[] = [
  { t: 0, v: [0.5, 0.6, 6.4] },
  { t: 2.5, v: [0.3, 0.5, 3.6] },
  { t: 5, v: [-0.4, 0.75, 0.9] },
  { t: 7, v: [-0.2, 2.6, 1.2] },
  { t: 9.2, v: [0, 10.4, 2.4] },
  { t: 12, v: [0, 12.6, 2.1] },
];
const TARGET: { t: number; v: V }[] = [
  { t: 0, v: [0, 0.0, 3.6] },
  { t: 2.5, v: [0, 0.05, 0.2] },
  { t: 5, v: [0, 0.0, -2.4] },
  { t: 7, v: [0, 0, -2.2] },
  { t: 9.2, v: [0, 0, -0.2] },
  { t: 12, v: [0, 0, -0.1] },
];

export const getMosaicCamera = (t: number): MosaicShot => ({
  pos: track(POS, t),
  target: track(TARGET, t),
  fov: lerp(52, 50, smooth(7, 11, t)),
  roll: Math.sin(t * 0.5) * 0.02 * (1 - smooth(7, 9, t)),
  exposure: 0.95,
});
