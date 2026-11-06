export interface MemphisDioramaCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getMemphisDioramaCamera = (f: number): MemphisDioramaCameraConfig => {
  const t = f / 60;
  return {
    position: [Math.sin(t * 0.25) * 1.1, 2.35, 5.8],
    target: [0, 0.45, 0],
    fov: 36,
  };
};