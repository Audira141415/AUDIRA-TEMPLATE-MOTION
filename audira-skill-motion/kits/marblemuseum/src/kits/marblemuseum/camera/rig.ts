import { BUST_HEAD, easeInOut, lerp, smooth } from "../core/motion";
import type { MarbleShot } from "../lib/post";

/**
 * Slow reverent orbit: opens a hand's breadth from the carved eye, pulls back while circling
 * from the bust's right to its left, and settles on a heroic three-quarter view as the sun lands.
 */
export const getMarbleCamera = (t: number): MarbleShot => {
  const theta = lerp(0.38, -0.62, easeInOut(t / 12));
  const r = lerp(1.75, 4.3, smooth(0.6, 8.5, t));
  const h = lerp(BUST_HEAD[1] + 0.05, 2.45, smooth(1, 9, t));
  const target: [number, number, number] = [0, lerp(BUST_HEAD[1] + 0.02, 2.2, smooth(1.5, 9, t)), 0];
  return {
    pos: [Math.sin(theta) * r, h, Math.cos(theta) * r],
    target,
    fov: lerp(30, 36, smooth(1, 9, t)),
    roll: 0,
    exposure: 0.85,
  };
};
