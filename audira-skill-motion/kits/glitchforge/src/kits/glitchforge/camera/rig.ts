import { BEAT, GlitchState, V3, easeInOut, lerp3, ramp, smooth } from "../core/motion";

export interface GlitchCameraConfig {
  position: V3;
  target: V3;
  fov: number;
  roll: number;
}

// A calm, expensive product orbit that never stops — the camera stays smooth while the image breaks.
// Only the signal-lost beat adds a tiny stepped "frame drop" jitter; the snap-back lands on a hero push-in.
export const getGlitchCamera = (s: GlitchState): GlitchCameraConfig => {
  const t = s.t;
  const orbit = -0.55 + easeInOut(ramp(t, 0, BEAT.end)) * 1.25;
  const dist = 10.6 - 1.6 * easeInOut(ramp(t, 0, BEAT.snap)) - 0.8 * smooth(ramp(t, BEAT.snap, BEAT.end));
  const h = 3.3 - 0.6 * smooth(ramp(t, 2, 9));
  let position: V3 = [Math.sin(orbit) * dist, h, Math.cos(orbit) * dist];
  const target = lerp3([0, 2.2, 0], [0, 2.35, 0], smooth(ramp(t, BEAT.snap, BEAT.end)));
  const drop = s.lost > 0 ? Math.floor(t * 12) % 2 : 0;
  position = [position[0] + drop * 0.05, position[1] - drop * 0.03, position[2]];
  return { position, target, fov: 36, roll: s.slice * 0.02 * Math.sin(t * 40) };
};
