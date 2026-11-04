// DRAFTFORGE Camera Rig — isometric and orthographic-style trajectory for architectural drafting review.

import { lerp, seg, ease } from "../core/motion";

export interface DraftCameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getDraftCameraPose = (f: number, totalFrames = 480): DraftCameraPose => {
  // 3-Act Engineering Review:
  // 1. Frames 0 - 150: Top-Down orthographic draft view (looking down at the drafting board)
  // 2. Frames 150 - 330: Smooth 3D tilt and arc into Isometric projection
  // 3. Frames 330 - 480: Heroic exploded assembly inspection hold

  if (f < 150) {
    const t = seg(f, 0, 150, ease.pan);
    return {
      position: [lerp(0.5, 0, t), lerp(8.5, 7.0, t), lerp(1.5, 3.5, t)],
      target: [0, 0, 0],
      fov: lerp(38, 35, t),
    };
  } else if (f < 330) {
    const t = seg(f, 150, 330, ease.pan);
    // Move into true 30-degree isometric drafting angle
    return {
      position: [
        lerp(0, 5.5, t),
        lerp(7.0, 4.2, t),
        lerp(3.5, 5.5, t),
      ],
      target: [0, 0, 0],
      fov: 34,
    };
  } else {
    const t = seg(f, 330, 480, ease.snap);
    // Subtle drift during exploded assembly hold
    return {
      position: [
        lerp(5.5, 6.2, t),
        lerp(4.2, 4.6, t),
        lerp(5.5, 6.2, t),
      ],
      target: [0, 0.2, 0],
      fov: 35,
    };
  }
};
