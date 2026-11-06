export interface FluidforgeCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getFluidforgeCamera = (f: number): FluidforgeCameraConfig => {
  const t = f / 60;
  return {
    position: [Math.sin(t * 0.3) * 0.8, 0.4 + Math.cos(t * 0.25) * 0.3, 5.4],
    target: [0, 0.1, 0],
    fov: 34,
  };
};