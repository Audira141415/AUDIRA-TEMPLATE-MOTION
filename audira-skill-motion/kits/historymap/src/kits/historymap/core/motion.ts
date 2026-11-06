export interface HistoryMapState {
  arrowProgress: number;
  territoryWipe: number;
  yearTick: number;
}

export const computeHistoryMapState = (f: number): HistoryMapState => {
  const t = f / 60;
  const progress = Math.min(1, Math.max(0, (f - 10) / 70));
  const ease = 1 - Math.pow(1 - progress, 3);
  return {
    arrowProgress: ease,
    territoryWipe: ease,
    yearTick: Math.floor(101 + ease * 16),
  };
};