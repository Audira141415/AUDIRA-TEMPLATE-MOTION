export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export function getCameraPose(f: number, totalFrames: number): CameraPose {
  const p = f / totalFrames;
  // Fly down the corridor axis: a gentle sway and rise, always looking toward the giant words ahead.
  return {
    position: [Math.sin(p * Math.PI) * 0.6, 0.6 + p * 0.5, 4.5],
    target: [0, 1.6 + p * 0.6, -20],
    fov: 40,
  };
}
