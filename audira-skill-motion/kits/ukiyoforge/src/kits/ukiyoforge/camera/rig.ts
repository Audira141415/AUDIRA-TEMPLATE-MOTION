import { PRINT_EYE, easeInOut, lerp, ramp, smooth } from "../core/motion";

export interface UkiyoCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

type V3 = [number, number, number];
const mix = (a: V3, b: V3, k: number) => a.map((v, i) => lerp(v, b[i], k)) as V3;

/**
 * 0-2.5s   hook: low in the trough, looking up at the towering crest and its claws
 * 2.5-8.5s glide left and back between the paper sheets (parallax reveals the boats and mountain)
 * 8.5-10.5 payoff: settle onto the print eye, every sheet locks into one flat woodblock image
 * 10.5-12  slow breathing push-in while the seal stamps
 */
export const getUkiyoCamera = (f: number): UkiyoCameraConfig => {
  const t = f / 60;
  const hookPos: V3 = [1.5, -1.7, 2.9];
  const hookTgt: V3 = [0.85, 0.6, -1.0];
  const glidePos: V3 = [-1.2, -1.8, 4.4];
  const glideTgt: V3 = [-0.5, -1.0, -8.5];
  const printPos: V3 = [0, 0, PRINT_EYE];
  const printTgt: V3 = [0, 0, -6];

  const g = easeInOut(ramp(t, 1.8, 8.4));
  const p = easeInOut(ramp(t, 8.2, 10.6));
  let position = mix(mix(hookPos, glidePos, g), printPos, p);
  const target = mix(mix(hookTgt, glideTgt, g), printTgt, p);
  // gentle drift so the frame never freezes, plus final push-in
  position = [position[0] + Math.sin(t * 0.7) * 0.05 * (1 - p), position[1] + Math.sin(t * 0.9) * 0.04, position[2] - smooth(ramp(t, 10.5, 12)) * 0.5];
  const fov = lerp(lerp(58, 50, g), 46, p);
  return { position, target, fov };
};
