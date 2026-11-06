export interface VisualInvestigationState {
  highlightWidth: number;
  activePodiumPulse: number;
  deskZoomZ: number;
}

export const computeVisualInvestigationState = (f: number): VisualInvestigationState => {
  const t = f / 60;
  const wipeProgress = Math.min(1, Math.max(0, (f - 15) / 50));
  return {
    highlightWidth: 0.05 + wipeProgress * 1.55,
    activePodiumPulse: 1 + Math.sin(t * 4.5) * 0.08,
    deskZoomZ: 5.4 - Math.min(0.65, t * 0.12),
  };
};