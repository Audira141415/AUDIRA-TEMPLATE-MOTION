import React from "react";
import { VINTAGE_PALETTE } from "../lib/palette";

export const AstrolabeMechanism: React.FC<{ f: number }> = ({ f }) => {
  const rot1 = f * 0.02;
  const rot2 = f * 0.015;

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Armillary Ring */}
      <mesh rotation={[rot1, 0, rot1 * 0.5]}>
        <torusGeometry args={[1.5, 0.06, 16, 64]} />
        <meshStandardMaterial color={VINTAGE_PALETTE.agedGold} metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Middle Ring */}
      <mesh rotation={[0, rot2, rot2 * 0.7]}>
        <torusGeometry args={[1.2, 0.05, 16, 64]} />
        <meshStandardMaterial color={VINTAGE_PALETTE.engravingBrown} metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Center Celestial Sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial color={VINTAGE_PALETTE.terracottaWash} roughness={0.8} />
      </mesh>
    </group>
  );
};
