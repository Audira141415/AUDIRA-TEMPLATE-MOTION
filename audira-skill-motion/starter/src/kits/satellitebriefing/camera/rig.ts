import { computeSatelliteBriefingState } from "../core/motion";

export interface SatelliteBriefingCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getSatelliteBriefingCamera = (f: number): SatelliteBriefingCameraConfig => {
  const state = computeSatelliteBriefingState(f);
  return {
    position: [Math.sin(state.scanAngle) * 0.6, state.cameraAltitude, 2.2],
    target: [0, 0, 0],
    fov: 42,
  };
};