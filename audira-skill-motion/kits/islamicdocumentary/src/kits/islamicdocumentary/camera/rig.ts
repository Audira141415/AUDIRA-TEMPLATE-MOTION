export interface IslamicDocumentaryCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getIslamicDocumentaryCamera = (f: number): IslamicDocumentaryCameraConfig => {
  const t = f / 60;
  return {
    position: [Math.sin(t * 0.25) * 0.6, 1.25, 5.2],
    target: [0, 0.45, 0],
    fov: 34,
  };
};