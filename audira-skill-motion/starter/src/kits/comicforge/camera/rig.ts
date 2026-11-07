import { BEAT, ComicState, V3, easeInOut, lerp3, ramp, smooth } from "../core/motion";

export interface ComicCameraConfig {
  position: V3;
  target: V3;
  fov: number;
  roll: number;
}

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

// Shot grammar: (1) push straight through two panel borders of the printed page, (2) low hero angle on the
// rooftop, (3) chase cam over the shoulder during the flight, (4) impact shake, (5) slow crane-back reveal.
export const getComicCamera = (s: ComicState): ComicCameraConfig => {
  const t = s.t;
  // 1 — through the page panels (pages sit at z = 20 and z = 12.5)
  const pushK = easeInOut(ramp(t, 0, BEAT.pushThroughPanels[1]));
  const pushPos = lerp3([0.3, 2.5, 34], [-1.9, 1.5, 6.2], pushK);
  const pushTgt = lerp3([0, 2.4, 12], [-0.6, 1.1, 0.6], smooth(ramp(t, 0.6, 3.4)));

  // 2 — rooftop hold with a slow arc
  const holdK = smooth(ramp(t, BEAT.pushThroughPanels[1], BEAT.leap + 0.2));
  const holdPos = lerp3([-1.9, 1.5, 6.2], [-2.8, 1.0, 5.4], holdK);
  const heroChest: V3 = add(s.heroPos, [0, 1.1, 0]);

  // 3 — chase over the shoulder
  const chaseK = smooth(ramp(t, BEAT.leap, BEAT.leap + 0.9));
  const chasePos = add(s.heroPos, [-3.4, 0.2, 4.4]);
  const chaseTgt = add(s.heroPos, [0.9, 1.0, -1.6]);

  // 5 — crane back after the hit
  const craneK = easeInOut(ramp(t, BEAT.impact + 0.15, BEAT.end));
  const cranePos = lerp3(chasePos, [-3.4, 5.6, 3.6], craneK);
  const craneTgt = lerp3(chaseTgt, [2.0, 5.5, -4.8], smooth(ramp(t, BEAT.impact, BEAT.impact + 1.6)));

  let position: V3;
  let target: V3;
  if (t < BEAT.pushThroughPanels[1]) {
    position = pushPos;
    target = pushTgt;
  } else if (t < BEAT.impact) {
    position = lerp3(holdPos, chasePos, chaseK);
    target = lerp3(heroChest, chaseTgt, chaseK);
  } else {
    position = cranePos;
    target = craneTgt;
  }

  // 4 — impact shake (deterministic, decays in ~0.6 s) + punch-in on the hit
  const sh = s.shake;
  position = add(position, [Math.sin(t * 91) * 0.16 * sh, Math.cos(t * 77) * 0.12 * sh, 0]);
  const punchIn = sh * 8;
  const fov = 40 - punchIn + (t < BEAT.pushThroughPanels[1] ? 0 : 4 * chaseK);
  const roll = t > BEAT.leap && t < BEAT.impact ? -0.12 * chaseK : t >= BEAT.impact ? -0.12 * (1 - craneK) + Math.sin(t * 60) * 0.03 * sh : 0;
  return { position, target, fov, roll };
};
