export interface MemphisDioramaState {
  totemSpin: number;
  sphereBounceY: number;
  archRockZ: number;
}

export const computeMemphisDioramaState = (f: number): MemphisDioramaState => {
  const t = f / 60;
  return {
    totemSpin: t * 0.65,
    sphereBounceY: Math.abs(Math.sin(t * 2.2)) * 0.28,
    archRockZ: Math.sin(t * 1.5) * 0.08,
  };
};