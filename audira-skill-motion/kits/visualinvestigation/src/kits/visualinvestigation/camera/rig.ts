import { computeVisualInvestigationState } from "../core/motion";

export interface VisualInvestigationCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getVisualInvestigationCamera = (f: number): VisualInvestigationCameraConfig => {
  const state = computeVisualInvestigationState(f);
  return {
    position: [0, 2.15, state.deskZoomZ],
    target: [0, 0.25, 0],
    fov: 30,
  };
};