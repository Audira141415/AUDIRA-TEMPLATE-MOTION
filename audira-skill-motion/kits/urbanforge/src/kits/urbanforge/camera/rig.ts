import { lerp } from "../core/motion";

export interface UrbanCameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

/**
 * Computes smooth architectural camera movements for URBANFORGE scenes.
 */
export function getUrbanCamera(progress: number): UrbanCameraState {
  const p = Math.max(0, Math.min(1, progress));

  if (p < 0.35) {
    // Shot 1: Macro rooftop glide at building height
    const t = p / 0.35;
    const smooth = t * t * (3 - 2 * t);
    return {
      position: [
        lerp(1.2, -0.8, smooth),
        lerp(4.9, 5.4, smooth),
        lerp(4.5, 3.2, smooth),
      ],
      target: [
        lerp(0.0, 0.0, smooth),
        lerp(4.2, 4.0, smooth),
        lerp(0.0, -0.5, smooth),
      ],
      fov: 36,
    };
  } else if (p < 0.7) {
    // Shot 2: Crane rise revealing the data wash and dynamic sun shadows
    const t = (p - 0.35) / 0.35;
    const smooth = t * t * (3 - 2 * t);
    return {
      position: [
        lerp(-0.8, 4.5, smooth),
        lerp(5.4, 8.5, smooth),
        lerp(3.2, 7.5, smooth),
      ],
      target: [
        lerp(0.0, 0.0, smooth),
        lerp(4.0, 1.5, smooth),
        lerp(-0.5, 0.0, smooth),
      ],
      fov: 40,
    };
  } else {
    // Shot 3: High isometric masterplan pullback overlooking the whole model
    const t = (p - 0.7) / 0.3;
    const smooth = t * t * (3 - 2 * t);
    return {
      position: [
        lerp(4.5, 7.5, smooth),
        lerp(8.5, 12.0, smooth),
        lerp(7.5, 11.5, smooth),
      ],
      target: [
        lerp(0.0, 0.0, smooth),
        lerp(1.5, 0.5, smooth),
        lerp(0.0, 0.0, smooth),
      ],
      fov: 42,
    };
  }
}

