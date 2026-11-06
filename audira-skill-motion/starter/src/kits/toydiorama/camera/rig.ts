// TOYDIORAMA: Static Theatrical Camera Rig
// Consistent eye-level / slightly elevated macro perspective
// STRICT RULE: No pan, no tilt, no zoom, consistent framing

export interface ToyDioramaCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getToyDioramaCamera = (): ToyDioramaCameraConfig => {
  return {
    position: [0, 1.75, 6.4],
    target: [0, 1.35, 0],
    fov: 32, // Macro cinema lens feel
  };
};
