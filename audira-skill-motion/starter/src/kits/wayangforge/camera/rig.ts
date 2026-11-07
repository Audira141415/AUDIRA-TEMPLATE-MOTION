import { BLENCONG, easeInOut, lerp, ramp, smooth } from "../core/motion";

export interface WayangCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

/**
 * Dalang side -> around the frame post -> shadow (audience) side.
 * 0-2s   hook: macro on the blencong flame, pull back to reveal the twirling gunungan
 * 2-6s   slow arc on the colourful puppet side while the figures enter
 * 6-9s   orbit around the screen edge (the frame post wipes the lens at ~7.5s)
 * 9-11s  payoff on the shadow side: shadows swell, gunungan closes the scene
 */
export const getWayangCamera = (f: number): WayangCameraConfig => {
  const t = f / 60;
  const pull = easeInOut(ramp(t, 0.0, 2.4));
  const orbit = easeInOut(ramp(t, 5.6, 9.2));
  const a = lerp(0.1, 0.3, smooth(ramp(t, 1.5, 5.6))) + orbit * (Math.PI - 0.3 - 0.1) + smooth(ramp(t, 9.2, 12)) * 0.08;
  const R = lerp(4.9, 4.2, smooth(ramp(t, 9.0, 11.5))) + Math.sin(orbit * Math.PI) * 0.6;
  const y = 2.05 + Math.sin(orbit * Math.PI) * 0.35;

  const orbitPos: [number, number, number] = [Math.sin(a) * R, y, Math.cos(a) * R];
  const flameClose: [number, number, number] = [BLENCONG[0] + 0.55, BLENCONG[1] - 0.2, BLENCONG[2] + 1.2];
  const position = flameClose.map((v, i) => lerp(v, orbitPos[i], pull)) as [number, number, number];

  const screen: [number, number, number] = [0, 2.0, 0];
  const target = BLENCONG.map((v, i) => lerp(v, screen[i], smooth(ramp(t, 0.3, 2.2)))) as [number, number, number];

  const fov = lerp(30, 50, pull) - 4 * smooth(ramp(t, 9.4, 11));
  return { position, target, fov };
};
