import { cameraDepthY, lerp, smooth } from "../core/motion";
import type { AbyssShot } from "../lib/post";
import { ANGLER_POS } from "../scene/Lanternmaw3D";

/** Slow descending camera: drifts in a lazy helix, looks down the water column, then locks onto the lure. */
export const getAbyssCamera = (t: number): AbyssShot => {
  const y = cameraDepthY(t);
  const x = Math.sin(t * 0.32) * 1.3;
  const z = 5.4 - t * 0.09;
  const lock = smooth(7.8, 10.2, t);
  const freeTarget: [number, number, number] = [x * 0.3, y - 2.6, -1.5];
  const lureTarget: [number, number, number] = [ANGLER_POS[0], ANGLER_POS[1] + 0.55, ANGLER_POS[2]];
  return {
    pos: [x, y, z],
    target: [lerp(freeTarget[0], lureTarget[0], lock), lerp(freeTarget[1], lureTarget[1], lock), lerp(freeTarget[2], lureTarget[2], lock)],
    fov: lerp(46, 38, smooth(8, 12, t)),
    roll: Math.sin(t * 0.4) * 0.03,
    exposure: 1.15,
  };
};
