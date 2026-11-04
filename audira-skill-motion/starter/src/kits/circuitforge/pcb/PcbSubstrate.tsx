// CIRCUITFORGE PCB Substrate — High-precision FR-4 base with octilinear copper routing, ENIG vias & test pads.

import React from "react";
import { CIRCUIT_PALETTE } from "../lib/palette";

export const PcbSubstrate: React.FC = () => {
  return (
    <group>
      {/* 1. Main Solder Mask Board Substrate */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[14, 0.3, 14]} />
        <meshStandardMaterial
          color={CIRCUIT_PALETTE.solderMaskDark}
          roughness={0.6}
          metalness={0.15}
        />
      </mesh>

      {/* 2. Copper Pour Channels (Octilinear Traces on X-Z plane) */}
      {/* Trace 1: Power Bus running Left to Center */}
      <mesh position={[-3.2, 0.01, 0]}>
        <boxGeometry args={[4.4, 0.02, 0.35]} />
        <meshStandardMaterial color={CIRCUIT_PALETTE.copperTraceBevel} roughness={0.35} metalness={0.8} />
      </mesh>

      {/* Trace 2: Diagonal 45-degree feed */}
      <mesh position={[-1.2, 0.01, 1.2]} rotation={[0, -Math.PI / 4, 0]}>
        <boxGeometry args={[2.2, 0.02, 0.22]} />
        <meshStandardMaterial color={CIRCUIT_PALETTE.copperTraceBevel} roughness={0.35} metalness={0.8} />
      </mesh>

      {/* Trace 3: Clock Bus running Right to Center */}
      <mesh position={[3.2, 0.01, -0.6]}>
        <boxGeometry args={[4.2, 0.02, 0.25]} />
        <meshStandardMaterial color={CIRCUIT_PALETTE.copperTraceBevel} roughness={0.35} metalness={0.8} />
      </mesh>

      {/* Trace 4: Data Bus Array (3 parallel lines) */}
      {[-0.3, 0, 0.3].map((zOffset, idx) => (
        <mesh key={idx} position={[0, 0.01, 3.5 + zOffset]}>
          <boxGeometry args={[0.15, 0.02, 4.2]} />
          <meshStandardMaterial color={CIRCUIT_PALETTE.copperTraceBevel} roughness={0.35} metalness={0.8} />
        </mesh>
      ))}

      {/* 3. ENIG Gold Test Pads & Vias */}
      {[-4.5, -3.5, 3.5, 4.5].map((x, i) => (
        <mesh key={i} position={[x, 0.02, -3.5]}>
          <cylinderGeometry args={[0.22, 0.22, 0.04, 16]} />
          <meshStandardMaterial color={CIRCUIT_PALETTE.enigGold} roughness={0.2} metalness={0.92} />
        </mesh>
      ))}

      {/* 4. White Monoline Silkscreen Markings */}
      <mesh position={[-3.2, 0.02, -0.4]}>
        <boxGeometry args={[3.2, 0.01, 0.04]} />
        <meshBasicMaterial color={CIRCUIT_PALETTE.silkscreenWhite} />
      </mesh>
    </group>
  );
};
