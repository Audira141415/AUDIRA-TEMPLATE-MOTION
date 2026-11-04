// POLYVERSE Camera Rig — majestic isometric telephoto orbit around low-poly floating islands.

import { lerp, seg, ease } from "../core/motion";

export interface PolyCameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getPolyCameraPose = (f: number, totalFrames = 480): PolyCameraPose => {
  // 3-Act Aerial Odyssey:
  // 1. Frames 0 - 150: Low 3/4 isometric approach from the pine grove side
  // 2. Frames 150 - 320: Rising continuous orbital arc passing above the river
  // 3. Frames 320 - 480: Wide telephoto hero hold showcasing island and subterranean cone

  if (f < 150) {
    const t = seg(f, 0, 150, ease.glide);
    return {
      position: [lerp(7.0, 5.8, t), lerp(3.2, 4.2, t), lerp(6.0, 7.5, t)],
      target: [0, 0.4, 0],
      fov: lerp(32, 30, t),
    };
  } else if (f < 320) {
    const t = seg(f, 150, 320, ease.glide);
    // Smooth 90-degree orbital sweep around the island
    const angle = lerp(0.8, 2.2, t);
    const radius = lerp(9.5, 10.5, t);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = lerp(4.2, 5.8, t);

    return {
      position: [x, y, z],
      target: [0, 0.2, 0],
      fov: 29,
    };
  } else {
    const t = seg(f, 320, 480, ease.glide);
    return {
      position: [lerp(-6.2, -7.5, t), lerp(5.8, 5.0, t), lerp(8.2, 9.2, t)],
      target: [0, -0.2, 0],
      fov: 30,
    };
  }
};

