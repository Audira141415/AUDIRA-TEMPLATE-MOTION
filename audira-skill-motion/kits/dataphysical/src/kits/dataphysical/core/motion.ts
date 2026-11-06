export interface DataPhysicalState {
  heroBarHeight: number;
  brassMarkerY: number;
  turntableYaw: number;
}

export const computeDataPhysicalState = (f: number): DataPhysicalState => {
  const t = f / 60;
  const progress = Math.min(1, f / 75);
  const easeOut = 1 - Math.pow(1 - progress, 3);
  return {
    heroBarHeight: 0.2 + easeOut * 1.95,
    brassMarkerY: 0.1 + easeOut * 1.45,
    turntableYaw: Math.sin(t * 0.35) * 0.28,
  };
};