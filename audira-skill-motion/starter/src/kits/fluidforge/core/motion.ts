export interface FluidforgeState {
  corePulse: number;
  orbitAngle: number;
  waveOffset: number;
  ringTilt: number;
}

export const computeFluidforgeState = (f: number): FluidforgeState => {
  const t = f / 60;
  return {
    corePulse: 1 + Math.sin(t * 2.4) * 0.08,
    orbitAngle: t * 0.85,
    waveOffset: Math.sin(t * 1.6) * 0.25,
    ringTilt: Math.sin(t * 0.9) * 0.35,
  };
};