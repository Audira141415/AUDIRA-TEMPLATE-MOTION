export interface HistoryMapCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getHistoryMapCamera = (f: number): HistoryMapCameraConfig => {
  const t = f / 60;
  return {
    position: [Math.sin(t * 0.2) * 0.5, 2.15, 5.4 - t * 0.06],
    target: [0, 0.35, 0],
    fov: 36,
  };
};