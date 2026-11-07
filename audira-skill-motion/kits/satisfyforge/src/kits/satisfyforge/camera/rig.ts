import { easeInOutCubic, lerp, stationX, win } from "../core/motion";

export interface SatisfyforgeCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

// Three-quarter studio dolly: glides sideways from station to station on cubic easing, never
// fully stops (slow sway on top), and finishes with a gentle drop toward the board (top-down feel).
export const getSatisfyforgeCamera = (f: number): SatisfyforgeCameraConfig => {
  const t = f / 60;
  const x = stationX(t);
  const sway = Math.sin(t * 0.55) * 0.35;
  const payoff = easeInOutCubic(win(t, 9.4, 11.6));
  const height = lerp(3.5, 4.6, payoff);
  const dist = lerp(5.6, 3.7, payoff);
  return {
    position: [x + sway, height, dist],
    target: [x + sway * 0.25, lerp(0.45, 0.1, payoff), lerp(0, -0.05, payoff)],
    fov: 36,
  };
};
