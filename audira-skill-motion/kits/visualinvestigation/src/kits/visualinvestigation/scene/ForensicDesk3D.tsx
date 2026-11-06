import React from "react";
import { VISUALINVESTIGATION_PALETTE } from "../lib/palette";

export const ForensicDesk3D: React.FC<{ f: number }> = () => {
  return (
    <group>
      {/* Cold Charcoal Forensic Investigation Table */}
      <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.5, 5.5]} />
        <meshStandardMaterial color={VISUALINVESTIGATION_PALETTE.panelCharcoal} roughness={0.9} />
      </mesh>

      {/* Courtroom Architectural Floorplan Blueprint Slab */}
      <mesh position={[-0.95, -0.18, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.1, 2.4]} />
        <meshStandardMaterial color="#1B222C" roughness={0.85} />
      </mesh>

      {/* Labeled Courtroom Podium Blocks: Judge (Top), Prosecutor (Left), Witness (Center-Active), Defense (Right) */}
      {/* Judge Bench */}
      <mesh position={[-0.95, -0.05, -0.65]}>
        <boxGeometry args={[1.1, 0.22, 0.32]} />
        <meshStandardMaterial color="#384152" roughness={0.8} />
      </mesh>
      {/* Active Speaker Podium (Highlighted in Evidence Red) */}
      <mesh position={[-0.95, 0.02, 0.15]}>
        <boxGeometry args={[0.42, 0.34, 0.42]} />
        <meshStandardMaterial
          color={VISUALINVESTIGATION_PALETTE.evidenceRed}
          emissive={VISUALINVESTIGATION_PALETTE.evidenceRed}
          emissiveIntensity={0.45}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
};