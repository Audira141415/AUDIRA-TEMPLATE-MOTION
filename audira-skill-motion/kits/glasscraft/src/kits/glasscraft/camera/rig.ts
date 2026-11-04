// GLASSCRAFT Camera Rig — fluid spatial computing camera trajectory with macro focal drift.

import { lerp, seg, ease } from "../core/motion";

export interface GlassCameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getGlassCameraPose = (f: number, totalFrames = 480): GlassCameraPose => {
  // 3-Act Spatial Computing Showcase:
  // 1. Frames 0 - 150: Macro glance across the beveled frosted edge
  // 2. Frames 150 - 320: Smooth arc into a dynamic 3/4 floating spatial card view
  // 3. Frames 320 - 480: Wide telephoto hero pull-back capturing the full refractive sanctuary

  if (f < 150) {
    const t = seg(f, 0, 150, ease.spatialFloat);
    return {
      position: [lerp(-1.8, -0.6, t), lerp(0.8, 0.4, t), lerp(3.2, 3.8, t)],
      target: [0, 0.2, 0],
      fov: lerp(36, 34, t),
    };
  } else if (f < 320) {
    const t = seg(f, 150, 320, ease.spatialFloat);
    return {
      position: [lerp(-0.6, 2.2, t), lerp(0.4, 1.2, t), lerp(3.8, 5.2, t)],
      target: [0, 0, 0],
      fov: 34,
    };
  } else {
    const t = seg(f, 320, 480, ease.spatialFloat);
    return {
      position: [lerp(2.2, 0, t), lerp(1.2, 0.8, t), lerp(5.2, 6.2, t)],
      target: [0, 0, 0],
      fov: 35,
    };
  }
};

