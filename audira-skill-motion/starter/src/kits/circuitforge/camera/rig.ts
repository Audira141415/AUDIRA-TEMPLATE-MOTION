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
      position: [lerp(-1.8, 2.6, t), lerp(0.9, 2.4, t), lerp(1.8, 3.8, t)],
      target: [0, 0.2, 0],
      fov: 34,
    };
  } else {
    const t = seg(f, 320, 480, ease.macroGlide);
    return {
      position: [lerp(2.6, 0, t), lerp(2.4, 7.8, t), lerp(3.8, 2.2, t)],
      target: [0, 0, 0],
      fov: 36,
    };
  }
};
