export interface FilmNoirCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getFilmNoirCamera = (f: number): FilmNoirCameraConfig => {
  const t = f / 60;
  // Slow, ominous Dutch-angle low tracking shot (classic 1940s RKO / John Alton lighting angle)
  return {
    position: [0.4 + Math.sin(t * 0.25) * 0.15, 1.45, 5.2 - t * 0.05],
    target: [0.1, 1.35, 0],
    fov: 34, // Intimate cinema lens
  };
};
