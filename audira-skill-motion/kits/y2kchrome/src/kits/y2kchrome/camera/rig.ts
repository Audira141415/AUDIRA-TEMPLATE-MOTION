import { DROP_HIT, MORPH_A, easeInOutCubic, lerp, smooth, win } from "../core/motion";

export interface Y2kchromeCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

// Playful orbit: starts tilted up following the falling drop, swings around the blob with a
// light bob, then pushes in on the sparkle morph and settles front-on.
export const getY2kchromeCamera = (f: number): Y2kchromeCameraConfig => {
  const t = f / 60;
  const follow = 1 - smooth(win(t, DROP_HIT - 0.2, DROP_HIT + 0.8));
  const orbit = lerp(-0.7, 0.9, easeInOutCubic(win(t, 0, MORPH_A)));
  const settle = easeInOutCubic(win(t, MORPH_A - 0.2, MORPH_A + 2.2));
  const theta = lerp(orbit, 0.12, settle);
  const radius = lerp(8.6, 7.2, settle) + Math.sin(t * 1.1) * 0.12;
  const h = lerp(1.3, 0.8, settle) + Math.sin(t * 1.7) * 0.12 - follow * 0.4;
  const ty = 0.45 + follow * 0.9;
  return {
    position: [Math.sin(theta) * radius, h, Math.cos(theta) * radius],
    target: [0, ty, 0],
    fov: 42,
  };
};
