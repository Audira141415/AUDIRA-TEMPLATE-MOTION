// SCALEFORGE camera — the zoom itself happens in the world transform (core/motion zoomAt), so the lens can
// stay in a steady, slowly orbiting 3/4 product shot: continuous yaw, gentle rise, slight push.
import { clamp } from "../core/motion";

export type ScalePose = { position: [number, number, number]; target: [number, number, number]; fov: number };

export const getScaleCamera = (t: number): ScalePose => {
  const k = clamp(t / 12);
  const yaw = -0.24 + k * 0.46 + Math.sin(t * 0.7) * 0.015;
  const dist = 10.4 - k * 0.8;
  const y = 1.0 + Math.sin(k * Math.PI) * 0.6;
  return {
    position: [Math.sin(yaw) * dist, y, Math.cos(yaw) * dist],
    target: [0, 0.1, 0],
    fov: 36,
  };
};

/** Visible frame height in render units at the target distance (for the HUD exponent). */
export const frameHeightUnits = (t: number) => {
  const dist = 10.4 - clamp(t / 12) * 0.8;
  return 2 * dist * Math.tan((36 * Math.PI) / 360);
};
