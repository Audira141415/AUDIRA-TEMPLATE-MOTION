import React from "react";
import { CHALK_PALETTE } from "../lib/palette";

export const QuantumDiagram3D: React.FC<{ f: number }> = ({ f }) => {
  const rot = f * 0.02;

  return (
    <group position={[0, 0, 0]} rotation={[rot * 0.4, rot, 0]}>
      {/* Electron Cloud Rings */}
      <mesh rotation={[0.5, 0, 0]}>
        <torusGeometry args={[1.4, 0.03, 8, 48]} />
        <meshBasicMaterial color={CHALK_PALETTE.chalkCyan} />
      </mesh>
      <mesh rotation={[-0.5, 0.8, 0]}>
        <torusGeometry args={[1.4, 0.03, 8, 48]} />
        <meshBasicMaterial color={CHALK_PALETTE.chalkAmber} />
      </mesh>
      {/* Central Atomic Nucleus */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color={CHALK_PALETTE.chalkRose} />
      </mesh>
    </group>
  );
};
