import React from "react";
import { MEMPHISDIORAMA_PALETTE } from "../lib/palette";

export const TerrazzoPlinth3D: React.FC<{ f: number }> = () => {
  return (
    <group>
      {/* Hard Cool-Purple Architectural Drop Shadow Slab */}
      <mesh position={[0.38, -0.52, -0.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.2, 3.0]} />
        <meshBasicMaterial color={MEMPHISDIORAMA_PALETTE.shadowPurple} />
      </mesh>

      {/* Main White Terrazzo Tabletop Plinth */}
      <mesh position={[0, -0.25, 0]}>
        <boxGeometry args={[4.0, 0.5, 2.8]} />
        <meshStandardMaterial color="#F4EFE6" roughness={0.9} />
      </mesh>

      {/* Terrazzo Confetti Specks on Plinth Top */}
      {[-1.4, -0.7, 0.1, 0.8, 1.3].map((x, idx) => (
        <mesh key={idx} position={[x, 0.01, (idx % 2 === 0 ? 0.6 : -0.5)]} rotation={[-Math.PI / 2, 0, idx]}>
          <planeGeometry args={[0.22, 0.14]} />
          <meshBasicMaterial
            color={
              idx % 3 === 0
                ? MEMPHISDIORAMA_PALETTE.coralPink
                : idx % 3 === 1
                ? MEMPHISDIORAMA_PALETTE.skyBlue
                : MEMPHISDIORAMA_PALETTE.canaryYellow
            }
          />
        </mesh>
      ))}
    </group>
  );
};