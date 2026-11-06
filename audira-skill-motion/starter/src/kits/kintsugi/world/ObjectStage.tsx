import React from "react";
import { KINTSUGI_PALETTE } from "../lib/palette";

export const KintsugiVase: React.FC<{ f: number }> = ({ f }) => {
  const rotY = f * 0.01;
  const pulse = (Math.sin(f * 0.04) * 0.5 + 0.5) * 0.5 + 0.5;

  return (
    <group position={[0, -0.2, 0]} rotation={[0.2, rotY, 0]}>
      {/* Main Porcelain Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.9, 2.0, 32]} />
        <meshStandardMaterial color={KINTSUGI_PALETTE.porcelainMatte} roughness={0.8} />
      </mesh>
      {/* Liquid Gold Organic Fracture Ribbon */}
      <mesh position={[0.05, 0.1, 0.05]} rotation={[0.3, 0.5, 0.2]}>
        <torusGeometry args={[0.85, 0.04, 12, 32, Math.PI * 1.5]} />
        <meshStandardMaterial color={KINTSUGI_PALETTE.pureGoldLeaf} emissive={KINTSUGI_PALETTE.goldEmissive} emissiveIntensity={pulse} roughness={0.15} metalness={0.95} />
      </mesh>
    </group>
  );
};
