import { computeBackroomsState } from "../core/motion";

export interface BackroomsCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getBackroomsCamera = (f: number): BackroomsCameraConfig => {
  const state = computeBackroomsState(f);
  return {
    position: [state.walkSwayX, 1.35 + state.walkBobY, 4.8 - state.walkForwardZ],
    target: [state.walkSwayX * 0.5, 1.3, -4.0],
    fov: 58,
  };
};