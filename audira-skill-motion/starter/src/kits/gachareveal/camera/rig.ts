import { BURST, SPIN, easeInOutCubic, flash, lerp, mulberry32, smooth, win } from "../core/motion";

export interface GacharevealCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

// Anticipation push-in on the capsule, a full 360° spin around the burst, then a hero settle
// front-on to the revealed card. Every flash adds a tiny camera kick.
export const getGacharevealCamera = (f: number): GacharevealCameraConfig => {
  const t = f / 60;
  const spin = easeInOutCubic(win(t, SPIN[0], SPIN[1]));
  const settle = smooth(win(t, SPIN[1] - 0.6, SPIN[1] + 1.6));
  const theta = -0.35 + Math.sin(t * 0.4) * 0.1 + spin * Math.PI * 2 + 0.35 * settle;
  const preR = lerp(5.2, 4.1, smooth(win(t, 0, BURST)));
  const radius = lerp(lerp(preR, 6.0, Math.sin(Math.PI * spin)), 5.1, settle);
  const h = lerp(lerp(1.5, 1.2, smooth(win(t, 0, BURST))), 2.25, smooth(win(t, BURST, SPIN[1])));
  const ty = lerp(1.25, 1.82, smooth(win(t, BURST + 0.2, SPIN[1])));
  const k = flash(t);
  const r = mulberry32(Math.floor(t * 30) * 31 + 9);
  const kick = k * 0.05;
  return {
    position: [Math.sin(theta) * radius + (r() - 0.5) * kick, h + (r() - 0.5) * kick, Math.cos(theta) * radius],
    target: [0, ty, 0.2 * settle],
    fov: lerp(46, 40, settle) + k * 2,
  };
};
