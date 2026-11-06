export interface Hd2dState {
  spriteStepFrame: number;
  lanternFlicker: number;
  heroBobY: number;
  emberRiseY: number;
}

export const computeHd2dState = (f: number): Hd2dState => {
  // 8fps stepped sprite cadence inside 60fps timeline
  const spriteStepFrame = Math.floor(f / 7.5);
  const t = f / 60;
  return {
    spriteStepFrame,
    lanternFlicker: 1.8 + Math.sin(t * 7.0) * 0.2 + Math.cos(t * 13.0) * 0.1,
    heroBobY: (spriteStepFrame % 2) * 0.04,
    emberRiseY: (t * 0.6) % 2.4,
  };
};