// CYBERFORGE Camera Rig — deterministic spline interpolation with aim lock and smooth orbital motion.

import { lerp, seg, ease } from "../core/motion";

export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getCyberCameraPose = (f: number, totalFrames = 480): CameraPose => {
  // 3 Distinct cinematic acts across 8 seconds (at 60fps, 480 frames):
  // 1. Frames 0 - 150: Low angle floor glide approaching the core
  // 2. Frames 150 - 330: Dynamic rising orbital swoop
  // 3. Frames 330 - 480: Heroic pull back with locked focus on center

  if (f < 150) {
    const t = seg(f, 0, 150, ease.camera);
    return {
      position: [
        lerp(-4.5, -2.5, t),
        lerp(-1.2, 0.5, t),
        lerp(7.0, 5.0, t),
      ],
      target: [0, 0, 0],
      fov: lerp(48, 44, t),
    };
  } else if (f < 330) {
    const t = seg(f, 150, 330, ease.camera);
    // Orbital rotation around Y
    const angle = lerp(0, Math.PI * 0.75, t);
    const radius = lerp(5.0, 4.2, t);
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const y = lerp(0.5, 2.2, t);

    return {
      position: [x, y, z],
      target: [0, 0.2, 0],
      fov: 42,
    };
  } else {
    const t = seg(f, 330, 480, ease.telemetry);
    // Smooth pull back to majestic vertical hero lock
    return {
      position: [
        lerp(3.2, 0, t),
        lerp(2.2, 0.8, t),
        lerp(3.8, 6.2, t),
      ],
      target: [0, 0, 0],
      fov: lerp(42, 45, t),
    };
  }
};
