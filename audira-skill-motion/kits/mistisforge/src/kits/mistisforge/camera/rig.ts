import { easeInOut, ramp, smooth, vnoise } from "../core/motion";

export interface MistisCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

const mix = (a: number[], b: number[], k: number) => a.map((v, i) => v + (b[i] - v) * k);

/**
 * Slow creeping dolly down the kampung path.
 * 0-2s  hook: close on the swinging pelita, then the eye drifts down the foggy path
 * 2-6s  development: creep forward, house window glows ahead
 * 6-9s  the gaze is pulled left, toward the banyan roots
 * 9-11s payoff: lamps gutter, a small involuntary push-in, lens tightens
 */
export const getMistisCamera = (f: number): MistisCameraConfig => {
  const t = f / 60;
  const dolly = easeInOut(Math.min(1, t / 12));
  const jolt = smooth(ramp(t, 9.0, 9.6)) * 0.45;
  // handheld "breath": low-frequency noise, never jittery
  const hx = (vnoise(t * 0.6, 1) - 0.5) * 0.08;
  const hy = (vnoise(t * 0.7, 2) - 0.5) * 0.05;

  const position: [number, number, number] = [0.25 - dolly * 0.35 + hx, 1.5 + hy - dolly * 0.1, 8.6 - dolly * 4.6 - jolt];

  const lantern = [0.82, 1.55, 6.0];
  const path = [0.2, 1.75, -6];
  const presence = [-0.85, 1.25, -3.3];
  let target = mix(lantern, path, smooth(ramp(t, 0.6, 3.2)));
  target = mix(target, presence, 0.75 * smooth(ramp(t, 5.8, 9.4)) * (1 - 0.6 * smooth(ramp(t, 11.0, 12))));

  const fov = 52 - 7 * smooth(ramp(t, 8.8, 10.2));
  return { position, target: target as [number, number, number], fov };
};
