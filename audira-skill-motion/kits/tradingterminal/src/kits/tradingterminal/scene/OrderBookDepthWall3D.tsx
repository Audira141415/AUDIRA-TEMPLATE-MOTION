import React from "react";
import { computeTradingTerminalState } from "../core/motion";
import { TRADINGTERMINAL_PALETTE } from "../lib/palette";

export const OrderBookDepthWall3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeTradingTerminalState(f);
  return (
    <group position={[0, -0.1, -0.6]}>
      {/* Background Terminal Dark Slab */}
      <mesh position={[0, 0.8, -0.1]}>
        <planeGeometry args={[7.2, 4.5]} />
        <meshBasicMaterial color={TRADINGTERMINAL_PALETTE.panelDark} />
      </mesh>

      {/* Grid Lines */}
      {[-1.2, -0.4, 0.4, 1.2, 2.0].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]}>
          <planeGeometry args={[6.8, 0.015]} />
          <meshBasicMaterial color="rgba(255, 255, 255, 0.07)" />
        </mesh>
      ))}

      {/* Left Liquidity Depth Wall (Bids - Green Step) */}
      <group position={[-1.8, 0.1, 0]}>
        {[0.3, 0.6, 0.9, 1.25].map((w, idx) => (
          <mesh key={idx} position={[(idx * 0.35) - 0.7, idx * 0.18, 0]}>
            <boxGeometry args={[0.3, 0.35 + idx * 0.25, 0.1]} />
            <meshStandardMaterial
              color={TRADINGTERMINAL_PALETTE.bullGreen}
              emissive={TRADINGTERMINAL_PALETTE.bullGreen}
              emissiveIntensity={0.2}
              transparent
              opacity={0.45}
            />
          </mesh>
        ))}
      </group>

      {/* Right Liquidity Depth Wall (Asks - Red Step) */}
      <group position={[1.8, 0.5, 0]}>
        {[1.25, 0.9, 0.6, 0.3].map((w, idx) => (
          <mesh key={idx} position={[(idx * 0.35) - 0.5, idx * 0.22, 0]}>
            <boxGeometry args={[0.3, 0.4 + idx * 0.28, 0.1]} />
            <meshStandardMaterial
              color={TRADINGTERMINAL_PALETTE.bearRed}
              emissive={TRADINGTERMINAL_PALETTE.bearRed}
              emissiveIntensity={0.2}
              transparent
              opacity={0.45}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};