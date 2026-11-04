// INKSTORY Camera Rig — Meditative horizontal scroll pan & vertical mountain ascent.

import { lerp, seg, ease } from "../core/motion";

export interface InkCameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getInkCameraPose = (f: number, totalFrames = 480): InkCameraPose => {
  // 3-Act Zen Scroll Unfolding:
  // Act 1: Frames 0 - 150 -> Slow rightward pan tracking the fresh ink stroke
  // Act 2: Frames 150 - 320 -> Vertical rising tilt revealing the misty mountain heights
  // Act 3: Frames 320 - 480 -> Broad, peaceful contemplative hero framing of the full painting

  if (f < 150) {
    const t = seg(f, 0, 150, ease.zenFloat);
    return {
      position: [lerp(-1.8, 0.4, t), lerp(-0.4, 0.2, t), lerp(4.4, 4.8, t)],
      target: [lerp(-0.8, 0.2, t), 0, 0],
      fov: 36,
    };
  } else if (f < 320) {
    const t = seg(f, 150, 320, ease.smoothWash);
    return {
      position: [lerp(0.4, 1.2, t), lerp(0.2, 1.4, t), lerp(4.8, 5.8, t)],
      target: [0.2, lerp(0, 0.6, t), 0],
      fov: 35,
    };
  } else {
    const t = seg(f, 320, 480, ease.zenFloat);
    return {
      position: [lerp(1.2, 0, t), lerp(1.4, 0.2, t), lerp(5.8, 6.6, t)],
      target: [0, 0, 0],
      fov: 34,
    };
  }
};
