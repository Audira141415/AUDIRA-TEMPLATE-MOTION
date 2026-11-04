// INNERWORKS Camera Rig — Cinematic technical zoom & cross-section inspection trajectory.

import { lerp, seg, ease } from "../core/motion";

export interface InnerworksCameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getInnerworksCameraPose = (f: number, totalFrames = 480): InnerworksCameraPose => {
  // Act 1: Frames 0 - 130 -> Outside approach to the industrial enclosure
  // Act 2: Frames 130 - 320 -> Penetrating cutaway dive directly into the interlocking gear teeth
  // Act 3: Frames 320 - 480 -> Broad diagonal cross-section reveal

  if (f < 130) {
    const t = seg(f, 0, 130, ease.smooth);
    return {
      position: [0, 0, lerp(6.2, 5.0, t)],
      target: [0, 0, 0],
      fov: 38,
    };
  } else if (f < 320) {
    const t = seg(f, 130, 320, ease.cubicInOut);
    return {
      position: [lerp(0, -1.2, t), lerp(0, 0.4, t), lerp(5.0, 3.2, t)],
      target: [-0.6, 0.2, 0],
      fov: lerp(38, 32, t),
    };
  } else {
    const t = seg(f, 320, 480, ease.smooth);
    return {
      position: [lerp(-1.2, 1.8, t), lerp(0.4, 0.8, t), lerp(3.2, 5.4, t)],
      target: [0, 0, 0],
      fov: 36,
    };
  }
};
