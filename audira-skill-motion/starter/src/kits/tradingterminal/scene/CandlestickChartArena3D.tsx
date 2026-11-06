import React from "react";
import { computeTradingTerminalState } from "../core/motion";
import { TRADINGTERMINAL_PALETTE } from "../lib/palette";

export const CandlestickChartArena3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeTradingTerminalState(f);
  const series = [
    { isBull: true, y: 0.1, h: 0.35, lowWick: 0.15, highWick: 0.2 },
    { isBull: false, y: 0.3, h: 0.28, lowWick: 0.12, highWick: 0.15 },
    { isBull: true, y: 0.25, h: 0.45, lowWick: 0.18, highWick: 0.25 },
    { isBull: true, y: 0.55, h: 0.52, lowWick: 0.2, highWick: 0.3 },
    { isBull: false, y: 0.75, h: 0.32, lowWick: 0.14, highWick: 0.18 },
    { isBull: true, y: 0.7, h: 0.65, lowWick: 0.22, highWick: 0.35 },
  ];

  return (
    <group position={[0, 0.25, 0]}>
      {/* Historical Candlesticks */}
      {series.map((c, idx) => {
        const x = (idx - 3.2) * 0.48;
        const col = c.isBull ? TRADINGTERMINAL_PALETTE.bullGreen : TRADINGTERMINAL_PALETTE.bearRed;
        return (
          <group key={idx} position={[x, c.y, 0]}>
            {/* Candle Wick Spine */}
            <mesh position={[0, c.h / 2, 0]}>
              <cylinderGeometry args={[0.012, 0.012, c.h + c.lowWick + c.highWick, 8]} />
              <meshBasicMaterial color={col} />
            </mesh>
            {/* Candle Body Box */}
            <mesh position={[0, c.h / 2, 0]}>
              <boxGeometry args={[0.26, c.h, 0.12]} />
              <meshStandardMaterial
                color={col}
                emissive={col}
                emissiveIntensity={0.3}
                roughness={0.2}
              />
            </mesh>
          </group>
        );
      })}

      {/* Live Surging Hero Breakout Candle */}
      <group position={[0.65, state.liveCandleY, 0]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.016, 0.016, 1.2, 8]} />
          <meshBasicMaterial color={TRADINGTERMINAL_PALETTE.bullGreen} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.3, 0.8, 0.16]} />
          <meshStandardMaterial
            color={TRADINGTERMINAL_PALETTE.bullGreen}
            emissive={TRADINGTERMINAL_PALETTE.bullGreen}
            emissiveIntensity={0.55}
          />
        </mesh>
        {/* Horizontal Laser Price Line */}
        <mesh position={[1.2, 0.8, 0]}>
          <planeGeometry args={[2.5, 0.02]} />
          <meshBasicMaterial color={TRADINGTERMINAL_PALETTE.cyanTelemetry} />
        </mesh>
      </group>
    </group>
  );
};