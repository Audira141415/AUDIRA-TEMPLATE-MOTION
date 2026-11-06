import React from "react";
import { BRUTAL_PALETTE } from "../lib/palette";

export const BrutalCard3D: React.FC<{ f: number }> = ({ f }) => {
  const jump = Math.abs(Math.sin(f * 0.08)) * 0.4;
  const rotY = Math.sin(f * 0.04) * 0.35;

  return (
    <group position={[0, jump, 0]} rotation={[0.2, rotY, 0]}>
      {/* 1. Hard Offset Drop Shadow */}
      <mesh position={[0.2, -0.2, -0.15]}>
        <boxGeometry args={[2.4, 2.8, 0.2]} />
        <meshBasicMaterial color={BRUTAL_PALETTE.inkBlack} />
      </mesh>
      {/* 2. Main High-Voltage Block */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 2.8, 0.2]} />
        <meshToonMaterial color={BRUTAL_PALETTE.neoYellow} />
      </mesh>
      {/* 3. Floating Sticker Accent */}
      <mesh position={[0.7, 0.9, 0.25]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.9, 0.5, 0.1]} />
        <meshToonMaterial color={BRUTAL_PALETTE.hotPink} />
      </mesh>
    </group>
  );
};
