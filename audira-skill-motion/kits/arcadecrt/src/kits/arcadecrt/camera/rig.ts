import { ArcadeState, BEAT, V3, easeInOut, lerp3, ramp, smooth } from "../core/motion";
import { SCREEN, screenNormal } from "../scene/CrtCabinet3D";
import { STAR, heroX, heroY } from "../core/game";

export interface ArcadeCameraConfig {
  position: V3;
  target: V3;
  fov: number;
  roll: number;
}

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];

// Outside: wide on the glowing cabinet → steady push that accelerates into the CRT glass.
// Inside: the camera keeps travelling — side-scroller tracking, low hero angle on the star grab, pull back.
export const getArcadeCamera = (s: ArcadeState): ArcadeCameraConfig => {
  const t = s.t;
  if (!s.inside) {
    const n = screenNormal();
    const wide1: V3 = [-1.7, 1.75, 4.9];
    const wide2: V3 = [-1.1, 1.65, 4.3];
    const pre = smooth(ramp(t, 0, BEAT.pushIn[0]));
    const wide = lerp3(wide1, wide2, pre);
    // accelerating push: ease-in-out to 1.1 units off the glass, then ease-in to 0.18 units
    const k1 = easeInOut(ramp(t, BEAT.pushIn[0], 6.2));
    const k2 = Math.pow(ramp(t, 6.2, BEAT.pushIn[1]), 2.2);
    const near1 = add(SCREEN.center, scale(n, 1.1));
    const near2 = add(SCREEN.center, scale(n, 0.16));
    let position = lerp3(wide, near1, k1);
    position = lerp3(position, near2, k2);
    const target = lerp3([0, 1.4, 0], SCREEN.center, smooth(ramp(t, 0.8, 5.5)));
    const fov = 40 - 6 * k1;
    return { position, target, fov, roll: -0.04 * (1 - k1) };
  }
  const hx = heroX(t);
  const hy = heroY(t);
  const H: V3 = [hx, 0.85 * hy + 0.9, 0];
  const k1 = smooth(ramp(t, BEAT.dive, 8.6));
  const k2 = easeInOut(ramp(t, 8.8, BEAT.grab));
  const k3 = easeInOut(ramp(t, BEAT.grab + 0.2, BEAT.end));
  let off = lerp3([0.3, 0.3, 2.2], [-2.4, 1.3, 9.6], k1);
  off = lerp3(off, [-2.2, -0.6, 7.6], k2);
  off = lerp3(off, [-4.0, 1.6, 12.5], k3);
  let target = add(H, [0.5, 0.2, 0]);
  target = lerp3(target, [STAR[0], STAR[1] - 0.6, 0], k2 * 0.45 * (1 - k3));
  return { position: add(H, off), target, fov: 44 - 4 * k2, roll: 0.05 * Math.sin(t * 1.3) };
};
