import React from "react";
import { computeHistoryMapState } from "../core/motion";
import { HISTORYMAP_PALETTE } from "../lib/palette";

export const CartographicTerrain3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeHistoryMapState(f);
  return (
    <group>
      {/* Continental Basemap Slab */}
      <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.2, 4.8]} />
        <meshStandardMaterial color={HISTORYMAP_PALETTE.terrainNeutral} roughness={0.9} />
      </mesh>

      {/* S-Curved Danube River Ribbon */}
      <mesh position={[0, -0.18, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.5, 0.18]} />
        <meshBasicMaterial color={HISTORYMAP_PALETTE.riverBlue} />
      </mesh>

      {/* Expanding Roman Empire Territory Shading */}
      <mesh position={[-1.2 + state.territoryWipe * 0.6, -0.17, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5 + state.territoryWipe * 1.4, 2.2]} />
        <meshStandardMaterial
          color={HISTORYMAP_PALETTE.romanCrimson}
          transparent
          opacity={0.65}
          roughness={0.8}
        />
      </mesh>

      {/* Mountain Ridgelines (Cartographic Hatched Blocks) */}
      {[-1.8, -0.8, 0.2, 1.4].map((x, idx) => (
        <mesh key={idx} position={[x, -0.05, -0.8]}>
          <coneGeometry args={[0.35, 0.35, 4]} />
          <meshStandardMaterial color="#404B5A" roughness={0.88} />
        </mesh>
      ))}
    </group>
  );
};