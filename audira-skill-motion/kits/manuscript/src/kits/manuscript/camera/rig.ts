import { INK_LINES, LECTERN, LINE_W, LINE_X0, easeInOut, lerp, lineProgress, lineY, pageToWorld, ramp, smooth } from "../core/motion";

export interface ManuscriptCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

type V3 = [number, number, number];
const mix = (a: V3, b: V3, k: number) => a.map((v, i) => lerp(v, b[i], k)) as V3;
const add = (a: V3, b: V3, k = 1) => a.map((v, i) => v + b[i] * k) as V3;

const PAGE_NORMAL: V3 = [0, -Math.sin(LECTERN.tilt), Math.cos(LECTERN.tilt)];
const LONTAR_TGT: V3 = [0.98, 0.05, 0.42];

const penPoint = (t: number): V3 => {
  let line = 0;
  for (let i = 0; i < INK_LINES; i++) if (lineProgress(t, i) > 0) line = i;
  return pageToWorld(LINE_X0 + LINE_W * lineProgress(t, line) * 0.6, lineY(line));
};

/**
 * 0-2s    hook: macro on the gold-leaf initial as a candle gleam slides across it
 * 2-6s    follow the quill writing line after line on the right page
 * 6-9s    track down to the lontar bundle as its cover lifts and leaves fan open
 * 9-11s   payoff: pull back to reveal lectern, codex, lontar and candles; the initial flares
 */
export const getManuscriptCamera = (f: number): ManuscriptCameraConfig => {
  const t = f / 60;
  const initial = pageToWorld(-0.455, 0.265);
  const hookTgt = initial;
  const hookPos = add(add(initial, PAGE_NORMAL, 0.72), [0.12, 0.05, 0]);

  const pen = penPoint(Math.max(t, 2.2));
  const writeTgt: V3 = mix(pageToWorld(0.3, 0.05), pen, 0.6);
  const writePos = add(add(writeTgt, PAGE_NORMAL, 1.15), [0.3, 0.08, 0.15]);

  const lontarPos: V3 = [0.75, 1.05, 1.65];
  const revealPos: V3 = [0.2, 1.3, 2.55];
  const revealTgt: V3 = [0.08, 0.42, -0.15];

  const a = easeInOut(ramp(t, 1.6, 3.4));
  const b = easeInOut(ramp(t, 5.4, 7.2));
  const c = easeInOut(ramp(t, 8.6, 10.8));
  let position = mix(mix(mix(hookPos, writePos, a), lontarPos, b), revealPos, c);
  const target = mix(mix(mix(hookTgt, writeTgt, a), LONTAR_TGT, b), revealTgt, c);
  position = [position[0] + Math.sin(t * 0.6) * 0.02, position[1] + Math.sin(t * 0.8) * 0.012, position[2] - smooth(ramp(t, 10.8, 12)) * 0.15];
  const fov = lerp(lerp(lerp(34, 38, a), 36, b), 42, c);
  return { position, target, fov };
};
