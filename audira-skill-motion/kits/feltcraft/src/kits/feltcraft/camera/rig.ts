import { easeInOutCubic, lerp, win } from "../core/motion";

export interface FeltcraftCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

// Smooth (not stepped) diorama camera: a slow lateral arc that follows the fox from the hillock
// to the yarn tree, then a gentle push-in on the hug-the-apple payoff. Stop-motion puppets,
// motion-control camera — the classic tabletop-animation combination.
export const getFeltcraftCamera = (f: number): FeltcraftCameraConfig => {
  const t = f / 60;
  const travel = easeInOutCubic(win(t, 0, 9));
  const push = easeInOutCubic(win(t, 8.8, 11.8));
  const x = lerp(-0.9, 0.7, travel) + Math.sin(t * 0.5) * 0.12;
  const dist = lerp(lerp(8.2, 7.4, travel), 4.6, push);
  const h = lerp(lerp(2.4, 2.1, travel), 1.75, push);
  return {
    position: [x, h, dist],
    target: [lerp(-0.4, 0.9, travel), lerp(1.2, 1.05, push), 0],
    fov: 42,
  };
};
