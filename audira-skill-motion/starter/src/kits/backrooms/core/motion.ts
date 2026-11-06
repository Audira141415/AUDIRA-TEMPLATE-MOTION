export interface BackroomsState {
  walkBobY: number;
  walkSwayX: number;
  walkForwardZ: number;
  tubeFlicker: number;
}

export const computeBackroomsState = (f: number): BackroomsState => {
  const t = f / 60;
  const flicker = Math.sin(f * 1.9) > 0.88 ? 0.35 : 1.35;
  return {
    walkBobY: Math.abs(Math.sin(t * 4.2)) * 0.06,
    walkSwayX: Math.sin(t * 2.1) * 0.08,
    walkForwardZ: (t * 0.55) % 3.0,
    tubeFlicker: flicker,
  };
};