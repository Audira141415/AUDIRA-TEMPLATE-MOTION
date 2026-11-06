// CIRCUITFORGE Camera Rig — Macro trace tracking, 3/4 orbital chip reveal & schematic pull-back.

import { lerp, seg, ease } from "../core/motion";

export interface CircuitCameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getCircuitCameraPose = (f: number, totalFrames = 480): CircuitCameraPose => {
  // Act 1: Frames 0 - 140 -> Macro close-up tracking the power pulse along the copper trace
  // Act 2: Frames 140 - 320 -> Dynamic 3/4 orbital sweep revealing the central BGA processor
  // Act 3: Frames 320 - 480 -> Vertical pull-back into a crisp top-down engineering view

  if (f < 140) {
    const t = seg(f, 0, 140, ease.macroGlide);
    return {
      position: [lerp(-4.2, -1.8, t), lerp(1.2, 0.9, t), lerp(2.2, 1.8, t)],
      target: [lerp(-3.0, -1.0, t), 0.1, 0],
      fov: lerp(32, 30, t),
    };
  } else if (f < 320) {
    const t = seg(f, 140, 320, ease.smooth);
    return {
      // Wide enough for a 9:16 frame: the 3.2-unit BGA package plus nearby traces stay in view.
      position: [lerp(-1.8, 4.2, t), lerp(0.9, 4.0, t), lerp(1.8, 6.4, t)],
      target: [0, 0.2, 0],
      fov: lerp(30, 38, t),
    };
  } else {
    const t = seg(f, 320, 480, ease.macroGlide);
    return {
      // Top-down engineering view; in 9:16 this frames about 6 units across (chip, traces, test pads).
      position: [lerp(4.2, 0, t), lerp(4.0, 13.5, t), lerp(6.4, 4.0, t)],
      target: [0, 0, lerp(0, 0.4, t)],
      fov: lerp(38, 40, t),
    };
  }
};
