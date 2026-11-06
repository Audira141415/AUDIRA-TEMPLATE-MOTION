import React from "react";
import { RETROWAVE_PALETTE } from "../lib/palette";

export const RetroSunAndGrid: React.FC<{ f: number }> = ({ f }) => {
  const gridZ = (f * 0.05) % 1.0;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Low-Poly Synth Sunset */}
      <mesh position={[0, 1.2, -6]}>
        <circleGeometry args={[2.5, 32]} />
        <meshBasicMaterial color={RETROWAVE_PALETTE.sunsetAmber} />
      </mesh>
      {/* 2. Infinite Neon Grid Floor */}
      <mesh position={[0, -1, gridZ - 3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 20, 16, 20]} />
        <meshBasicMaterial color={RETROWAVE_PALETTE.synthCyan} wireframe />
      </mesh>
    </group>
  );
};
