export interface WatercolorCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getWatercolorCamera = (f: number): WatercolorCameraConfig => {
  const t = f / 60;
  // Gentle, floating storybook camera (like turning a beautiful illustrated page)
  return {
    position: [0 + Math.sin(t * 0.4) * 0.1, 1.6 + Math.cos(t * 0.5) * 0.05, 5.8],
    target: [0, 1.25, 0],
    fov: 34,
  };
};
