// TOONFORGE Anime Diorama — stylized anime sky rings and high-speed cloud streaks.

import React from "react";
import * as THREE from "three";
import { TOON_PALETTE } from "../lib/palette";

export const AnimeDiorama: React.FC<{ f: number }> = ({ f }) => {
  // Speed rings passing by along Z
  const ring1Z = ((f * 0.15) % 18) - 9;
  const ring2Z = (((f + 60) * 0.15) % 18) - 9;

  return (
    <group>
      {/* 1. Velocity Tunnel Ring 1 */}
      <mesh position={[0, 0, ring1Z]} rotation={[0, 0, f * 0.02]}>
        <torusGeometry args={[3.2, 0.06, 8, 32]} />
        <meshBasicMaterial color={TOON_PALETTE.sakuraPink} transparent opacity={0.65} />
      </mesh>

      {/* 2. Velocity Tunnel Ring 2 */}
      <mesh position={[0, 0, ring2Z]} rotation={[0, 0, -f * 0.03]}>
        <torusGeometry args={[4.0, 0.08, 8, 32]} />
        <meshBasicMaterial color={TOON_PALETTE.skyCyan} transparent opacity={0.5} />
      </mesh>

      {/* 3. Distant Cel-Shaded Ground / Horizon Strip */}
      <mesh position={[0, -4.5, 0]} receiveShadow>
        <planeGeometry args={[30, 40]} />
        <meshToonMaterial color={TOON_PALETTE.shadowBand} />
      </mesh>
    </group>
  );
};

