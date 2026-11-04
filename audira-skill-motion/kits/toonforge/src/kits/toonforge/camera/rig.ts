// TOONFORGE Camera Rig — dramatic anime snap zooms, Dutch tilt angles, and impact shake.

import { lerp, seg, ease, impactShake } from "../core/motion";

export interface ToonCameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getToonCameraPose = (f: number, totalFrames = 480): ToonCameraPose => {
  // Impact shake triggered at the thruster ignite beat (Frame 160)
  const shakeY = impactShake(f - 160, 0.45);
  const shakeX = impactShake(f - 160, 0.3);

  // 3-Act Anime Action Trajectory:
  // 1. Frames 0 - 160: Low dramatic close-up silhouette looking up at the mecha core
  // 2. Frames 160 - 320: Thruster ignition snap-zoom into a dynamic high-speed 3/4 chase
  // 3. Frames 320 - 480: Heroic high-angle Dutch tilt pull-back into full battle silhouette

  if (f < 160) {
    const t = seg(f, 0, 160, ease.animeSnap);
    return {
      position: [lerp(-1.8, -0.6, t) + shakeX, lerp(-0.8, -0.2, t) + shakeY, lerp(3.2, 2.5, t)],
      target: [0, 0, 0],
      fov: lerp(45, 40, t),
    };
  } else if (f < 320) {
    const t = seg(f, 160, 320, ease.whip);
    return {
      position: [lerp(0.8, 2.2, t) + shakeX, lerp(0.4, 1.4, t) + shakeY, lerp(4.0, 5.5, t)],
      target: [0, 0.2, 0.5],
      fov: 46,
    };
  } else {
    const t = seg(f, 320, 480, ease.animeSnap);
    return {
      position: [lerp(2.2, 0, t) + shakeX, lerp(1.4, 1.8, t) + shakeY, lerp(5.5, 6.8, t)],
      target: [0, 0, 0],
      fov: 42,
    };
  }
};

