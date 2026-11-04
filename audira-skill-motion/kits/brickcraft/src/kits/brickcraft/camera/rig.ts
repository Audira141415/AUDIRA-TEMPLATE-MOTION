import { lerp } from "../core/motion";

export interface BrickCameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

/**
 * Computes smooth 60 FPS camera motion for BRICKCRAFT scenes.
 */
export function getBrickCamera(progress: number): BrickCameraState {
  const p = Math.max(0, Math.min(1, progress));

  if (p < 0.4) {
    // Shot 1: Low-angle macro close-up tracking the toy character
    const t = p / 0.4;
    const smooth = t * t * (3 - 2 * t);
    return {
      position: [
        lerp(1.5, 0.5, smooth),
        lerp(2.2, 2.8, smooth),
        lerp(6.5, 5.2, smooth),
      ],
      target: [
        lerp(0.0, 0.2, smooth),
        lerp(1.2, 1.4, smooth),
        lerp(0.0, 0.0, smooth),
      ],
      fov: 34,
    };
  } else if (p < 0.75) {
    // Shot 2: Medium crane pan watching the building bricks snap together
    const t = (p - 0.4) / 0.35;
    const smooth = t * t * (3 - 2 * t);
    return {
      position: [
        lerp(0.5, 4.0, smooth),
        lerp(2.8, 5.0, smooth),
        lerp(5.2, 6.5, smooth),
      ],
      target: [
        lerp(0.2, 1.5, smooth),
        lerp(1.4, 2.0, smooth),
        lerp(0.0, -0.5, smooth),
      ],
      fov: 38,
    };
  } else {
    // Shot 3: High wide tabletop pullback revealing the entire miniature diorama
    const t = (p - 0.75) / 0.25;
    const smooth = t * t * (3 - 2 * t);
    return {
      position: [
        lerp(4.0, 6.0, smooth),
        lerp(5.0, 8.5, smooth),
        lerp(6.5, 11.0, smooth),
      ],
      target: [
        lerp(1.5, 0.0, smooth),
        lerp(2.0, 1.0, smooth),
        lerp(-0.5, 0.0, smooth),
      ],
      fov: 42,
    };
  }
}

