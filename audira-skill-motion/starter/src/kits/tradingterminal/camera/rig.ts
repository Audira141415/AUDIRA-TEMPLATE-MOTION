export interface TradingTerminalCameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const getTradingTerminalCamera = (f: number): TradingTerminalCameraConfig => {
  const t = f / 60;
  return {
    position: [0.2 + Math.sin(t * 0.2) * 0.3, 1.45, 5.2 - Math.min(0.5, t * 0.08)],
    target: [0, 0.65, 0],
    fov: 34,
  };
};