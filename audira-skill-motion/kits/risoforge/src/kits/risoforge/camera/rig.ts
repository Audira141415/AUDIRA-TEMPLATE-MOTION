import { BEAT, V3, easeInOut, lerp3, ramp, smooth } from "../core/motion";

export interface RisoCameraConfig {
  position: V3;
  target: V3;
  up: V3;
  fov: number;
}

// (1) top-down over the printed zine spread, (2) swing down to the page edge as the layers pop up,
// (3) dolly low through the paper layers toward the sun, (4) gentle rise on the payoff.
export const getRisoCamera = (f: number): RisoCameraConfig => {
  const t = f / 60;
  const topK = smooth(ramp(t, 0, 1.8));
  const top: V3 = lerp3([0.15, 11.5, 4.6], [0.1, 10.2, 4.4], topK);
  const swingK = easeInOut(ramp(t, 1.6, BEAT.dollyStart + 0.4));
  const front: V3 = [-0.25, 2.3, 14.2];
  const dollyK = easeInOut(ramp(t, BEAT.dollyStart, 10.6));
  const deep: V3 = [-0.2, 1.5, 9.8];
  const riseK = smooth(ramp(t, 10.0, BEAT.end));

  let position = lerp3(top, front, swingK);
  position = lerp3(position, deep, dollyK);
  position = [position[0] + 0.15 * riseK, position[1] + 0.45 * riseK, position[2] + 0.4 * riseK];
  // a breath of hand-held drift
  position = [position[0] + Math.sin(t * 0.9) * 0.05, position[1] + Math.sin(t * 1.3) * 0.03, position[2]];

  const tTop: V3 = [0, 0, 3.9];
  const tFront: V3 = [0, 1.7, 2.2];
  const tDeep: V3 = [0.35, 2.4, 0];
  let target = lerp3(tTop, tFront, swingK);
  target = lerp3(target, tDeep, dollyK);

  // up vector: screen-up points at the spine while top-down, then world-up
  const upK = smooth(ramp(t, 1.6, 4.0));
  const up: V3 = [0, upK, -(1 - upK)];
  const fov = 34 + 6 * dollyK;
  return { position, target, up, fov };
};
