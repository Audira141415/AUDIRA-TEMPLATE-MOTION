import { easeInOut, lerp, ramp, smooth, stitchGrow } from "../core/motion";
import { activeStitch, buildPattern } from "../lib/pattern";

const PATTERN = buildPattern();

export interface SulamCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

type V3 = [number, number, number];
const mix = (a: V3, b: V3, k: number) => a.map((v, i) => lerp(v, b[i], k)) as V3;

/**
 * Macro embroidery camera.
 * 0-2s    hook: extreme macro on the needle laying the first satin petal
 * 2-7s    rise and arc: the flower fills stitch by stitch
 * 7-9s    reveal the hoop, the gold diamond ring and the songket cloth
 * 9-11s   payoff: a light sweep makes every gold float glint; slow push-in
 */
export const getSulamCamera = (f: number): SulamCameraConfig => {
  const t = f / 60;
  // the macro hook tracks the needle tip along the first petal
  const act = activeStitch(PATTERN.stitches, Math.min(t, 2.4));
  const g0 = stitchGrow(Math.min(t, 2.4), act.start);
  const tipX = act.a[0] + (act.b[0] - act.a[0]) * g0;
  const tipZ = act.a[1] + (act.b[1] - act.a[1]) * g0;
  const macroTgt: V3 = [lerp(0.15, tipX, 0.7), 0.1, lerp(-0.32, tipZ, 0.7)];
  const macroPos: V3 = [macroTgt[0] + 0.3, 0.46, macroTgt[2] + 0.62];
  const midPos: V3 = [0.9, 1.5, 1.7];
  const midTgt: V3 = [0.05, 0.1, -0.05];
  const widePos: V3 = [-0.35, 3.1, 2.5];
  const wideTgt: V3 = [0, 0, -0.1];
  const endPos: V3 = [0.1, 2.6, 1.95];

  const a = easeInOut(ramp(t, 1.6, 6.8));
  const b = easeInOut(ramp(t, 6.4, 9.2));
  const c = smooth(ramp(t, 9.0, 12));
  let position = mix(mix(mix(macroPos, midPos, a), widePos, b), endPos, c);
  const target = mix(mix(macroTgt, midTgt, a), wideTgt, b);
  // continuous micro drift, macro-lens breathing
  position = [position[0] + Math.sin(t * 0.8) * 0.03, position[1] + Math.sin(t * 1.1) * 0.015, position[2]];
  const fov = lerp(lerp(30, 36, a), 34, b);
  return { position, target, fov };
};
