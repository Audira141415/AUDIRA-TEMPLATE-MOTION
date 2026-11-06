export interface TradingTerminalState {
  tickerOffset: number;
  liveCandleY: number;
  depthPulse: number;
  currentPrice: number;
}

export const computeTradingTerminalState = (f: number): TradingTerminalState => {
  const t = f / 60;
  const progress = Math.min(1, f / 90);
  const surge = 1 - Math.pow(1 - progress, 3);
  return {
    tickerOffset: (f * 1.5) % 800,
    liveCandleY: 0.45 + surge * 0.95 + Math.sin(t * 8.0) * 0.04,
    depthPulse: 1 + Math.sin(t * 5.0) * 0.06,
    currentPrice: 91200 + surge * 3300 + Math.sin(t * 6.0) * 45,
  };
};