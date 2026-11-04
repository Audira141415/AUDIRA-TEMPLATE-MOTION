// PRECISION Camera Rig — Physically motivated macro lens trajectory with focal pull.

import { lerp, seg, ease } from "../core/motion";

export interface PrecisionCameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getPrecisionCameraPose = (f: number, totalFrames = 480): PrecisionCameraPose => {
  // Act 1: Frames 0 - 140 -> Macro glance on acoustic seam
  // Act 2: Frames 140 - 320 -> Wide 3/4 orbital glide around exploded parts
  // Act 3: Frames 320 - 480 -> Smooth magnetic reassembly into hero packshot

  if (f < 140) {
    const t = seg(f, 0, 140, ease.smoothStep);
    return {
      position: [lerp(1.2, 0.6, t), lerp(0.4, 0.2, t), lerp(2.8, 3.4, t)],
      target: [0, 0, 0],
      fov: lerp(32, 30, t),
    };
  } else if (f < 320) {
    const t = seg(f, 140, 320, ease.smoothStep);
    return {
      position: [lerp(0.6, -2.4, t), lerp(0.2, 0.8, t), lerp(3.4, 5.2, t)],
      target: [0, 0, 0],
      fov: 30,
    };
  } else {
    const t = seg(f, 320, 480, ease.smoothStep);
    return {
      position: [lerp(-2.4, 0, t), lerp(0.8, 0.1, t), lerp(5.2, 4.8, t)],
      target: [0, 0, 0],
      fov: 32,
    };
  }
};
