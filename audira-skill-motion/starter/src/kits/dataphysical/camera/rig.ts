export interface DataPhysicalCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getDataPhysicalCamera = (f: number): DataPhysicalCameraConfig => {
  const t = f / 60;
  return {
    position: [0.6 + Math.sin(t * 0.2) * 0.4, 1.65, 5.2 + t * 0.05],
    target: [0, 0.55, 0],
    fov: 28,
  };
};