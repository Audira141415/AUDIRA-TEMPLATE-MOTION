// CLAYWORLD Camera Rig — miniature tabletop camera trajectory with subtle physical stop-motion drift.

import { lerp, seg, ease, stepFrame } from "../core/motion";

export interface ClayCameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getClayCameraPose = (f: number, totalFrames = 480): ClayCameraPose => {
  // Stepped micro-drift simulating a physical stop-motion multi-plane camera rig
  const sf = stepFrame(f, 4);
  const driftX = Math.sin(sf * 0.04) * 0.08;
  const driftY = Math.cos(sf * 0.035) * 0.06;

  // 3-Act Miniature Narrative:
  // 1. Frames 0 - 150: Ground-level macro close-up on the clay creature
  // 2. Frames 150 - 320: Camera pulls back and rises slightly as creature hops joyfully
  // 3. Frames 320 - 480: Tabletop wide hero hold framing character and diorama

  if (f < 150) {
    const t = seg(f, 0, 150, ease.dough);
    return {
      position: [lerp(-1.2, 0.4, t) + driftX, lerp(1.2, 1.4, t) + driftY, lerp(4.2, 3.8, t)],
      target: [0, 0.7, 0],
      fov: lerp(36, 34, t),
    };
  } else if (f < 320) {
    const t = seg(f, 150, 320, ease.dough);
    return {
      position: [lerp(0.4, 1.8, t) + driftX, lerp(1.4, 2.2, t) + driftY, lerp(3.8, 5.2, t)],
      target: [0, 0.6, 0],
      fov: 34,
    };
  } else {
    const t = seg(f, 320, 480, ease.dough);
    return {
      position: [lerp(1.8, 0, t) + driftX, lerp(2.2, 1.8, t) + driftY, lerp(5.2, 5.8, t)],
      target: [0, 0.5, 0],
      fov: 35,
    };
  }
};
