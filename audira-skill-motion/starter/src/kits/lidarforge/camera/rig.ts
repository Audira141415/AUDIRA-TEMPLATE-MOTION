// LIDARFORGE Camera Rig — Aerial survey drone flight trajectory with dynamic altitude changes.

import { lerp, seg, ease } from "../core/motion";

export interface LidarCameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getLidarCameraPose = (f: number, totalFrames = 480): LidarCameraPose => {
  // Act 1: Frames 0 - 140 -> High nadir oblique survey glide
  // Act 2: Frames 140 - 320 -> Low skimming canopy flythrough catching laser reflections
  // Act 3: Frames 320 - 480 -> Ascending orbital pull-back revealing the full surveyed valley

  if (f < 140) {
    const t = seg(f, 0, 140, ease.droneGlide);
    return {
      position: [lerp(-2.5, 0, t), lerp(6.5, 4.2, t), lerp(-8.5, -3.5, t)],
      target: [0, 0, lerp(-4, 0, t)],
      fov: 38,
    };
  } else if (f < 320) {
    const t = seg(f, 140, 320, ease.smooth);
    return {
      position: [lerp(0, 3.8, t), lerp(4.2, 2.8, t), lerp(-3.5, 4.2, t)],
      target: [0, 0.4, lerp(0, 2.5, t)],
      fov: 36,
    };
  } else {
    const t = seg(f, 320, 480, ease.droneGlide);
    return {
      position: [lerp(3.8, 0, t), lerp(2.8, 8.5, t), lerp(4.2, 9.5, t)],
      target: [0, 0, 0],
      fov: 40,
    };
  }
};
