export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export function getCameraPose(f: number, totalFrames: number): CameraPose {
  const p = f / totalFrames;
  return {
    position: [Math.sin(p * Math.PI) * 2, 2 + Math.cos(p * Math.PI) * 0.5, 4.5],
    target: [0, 0, 0],
    fov: 34,
  };
}
