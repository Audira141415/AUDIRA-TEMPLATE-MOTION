// NANOFORGE Camera Rig — Microscopic focal drift with helical ascending sweep.

import { lerp, seg, ease, brownianDrift } from "../core/motion";

export interface NanoCameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getNanoCameraPose = (f: number, totalFrames = 480): NanoCameraPose => {
  const microJitterX = brownianDrift(f, 0.05, 0.03);
  const microJitterY = brownianDrift(f, 0.04, 0.03);

  // 3-Act Molecular Journey:
  // Act 1: Frames 0 - 140 -> Macro close-up on nucleotide base pairing
  // Act 2: Frames 140 - 320 -> Helical ascending orbital ascent along the major groove
  // Act 3: Frames 320 - 480 -> Broad telephoto pull-back revealing the cellular cosmos

  if (f < 140) {
    const t = seg(f, 0, 140, ease.smooth);
    return {
      position: [lerp(1.8, 1.2, t) + microJitterX, lerp(-1.0, 0.5, t) + microJitterY, lerp(2.8, 3.4, t)],
      target: [0, 0, 0],
      fov: lerp(35, 32, t),
    };
  } else if (f < 320) {
    const t = seg(f, 140, 320, ease.bioFlow);
    const angle = lerp(0.4, Math.PI * 1.5, t);
    const radius = lerp(3.4, 5.0, t);
    return {
      position: [Math.cos(angle) * radius + microJitterX, lerp(0.5, 2.4, t) + microJitterY, Math.sin(angle) * radius],
      target: [0, lerp(0, 1.2, t), 0],
      fov: 34,
    };
  } else {
    const t = seg(f, 320, 480, ease.smooth);
    return {
      position: [lerp(-2.8, 0, t) + microJitterX, lerp(2.4, 1.0, t) + microJitterY, lerp(5.0, 7.8, t)],
      target: [0, 0, 0],
      fov: 36,
    };
  }
};
