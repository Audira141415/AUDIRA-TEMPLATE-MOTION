import { BEAT, V3, easeInOut, lerp3, ramp, smooth } from "../core/motion";

export interface SketchCameraConfig {
  position: V3;
  target: V3;
  fov: number;
}

// (1) over-the-shoulder look down at the page while the pencil draws, (2) orbit down as the lines
// extrude and the clay fills, (3) continue around to a low hero angle as the coloured house lifts off.
export const getSketchCamera = (f: number, liftY: number): SketchCameraConfig => {
  const t = f / 60;
  const a = smooth(ramp(t, 0, BEAT.draw[1]));
  const b = easeInOut(ramp(t, BEAT.draw[1] - 0.3, 7.2));
  const c = easeInOut(ramp(t, 6.8, BEAT.end));

  let position = lerp3([0.9, 10.4, 5.4], [0.6, 9.3, 4.7], a);
  position = lerp3(position, [5.6, 4.3, 7.4], b);
  position = lerp3(position, [-4.3, 2.3, 7.4], c);

  let target = lerp3([0.15, 0, -0.55], [0.1, 0, -0.4], a);
  target = lerp3(target, [0.1, 1.0, 0], b);
  target = lerp3(target, [0, 1.25 + liftY * 0.8, 0], c);

  const fov = 36 - 4 * b + 2 * c;
  return { position, target, fov };
};
