export interface SatelliteBriefingState {
  cameraAltitude: number;
  reticlePulse: number;
  scanAngle: number;
}

export const computeSatelliteBriefingState = (f: number): SatelliteBriefingState => {
  const t = f / 60;
  // Logarithmic descent from high orbit to tactical nadir view
  const progress = Math.min(1, f / 120);
  const cameraAltitude = 6.8 * Math.pow(0.52, progress);
  return {
    cameraAltitude,
    reticlePulse: 1 + Math.sin(t * 4.0) * 0.08,
    scanAngle: t * 0.4,
  };
};