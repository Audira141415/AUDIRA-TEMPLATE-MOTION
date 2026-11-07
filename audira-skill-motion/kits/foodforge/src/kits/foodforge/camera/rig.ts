import { easeInOutCubic, lerp, smooth, win } from "../core/motion";

export interface FoodforgeCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

// Food-commercial camera: low slow orbit around the bowl (0–9 s) while the target drops from the
// suspended ingredients to the broth, then a push-in that follows the chopstick lift (9–11.5 s).
export const getFoodforgeCamera = (f: number): FoodforgeCameraConfig => {
  const t = f / 60;
  const orbit = easeInOutCubic(win(t, 0, 12));
  const theta = lerp(-0.62, 0.55, orbit);
  const elev = lerp(0.3, 0.5, smooth(win(t, 0.5, 7))) - 0.08 * smooth(win(t, 8.5, 11.5));
  const push = easeInOutCubic(win(t, 8.6, 11.6));
  const radius = lerp(lerp(4.6, 4.1, smooth(win(t, 0, 8))), 2.55, push);
  const ty = lerp(lerp(0.95, 0.5, smooth(win(t, 1.8, 6.5))), 0.95, push);
  return {
    position: [Math.sin(theta) * Math.cos(elev) * radius, ty + Math.sin(elev) * radius, Math.cos(theta) * Math.cos(elev) * radius],
    target: [0.03, ty, 0],
    fov: 40,
  };
};
