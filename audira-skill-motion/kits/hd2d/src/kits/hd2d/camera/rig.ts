export interface Hd2dCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getHd2dCamera = (f: number): Hd2dCameraConfig => {
  const t = f / 60;
  // Elevated 3/4 tilt-shift diorama perspective
  return {
    position: [Math.sin(t * 0.2) * 0.6, 2.55, 5.6 - t * 0.04],
    target: [0, 0.55, 0],
    fov: 32,
  };
};