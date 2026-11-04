// CIRCUITFORGE Electron Pulse — Glowing current heads & high-frequency digital clock signals racing across copper traces.

import React from "react";
import * as THREE from "three";
import { pulseProgress, lerp } from "../core/motion";
import { CIRCUIT_PALETTE } from "../lib/palette";

interface ElectronPulseProps {
  f: number;
}

export const ElectronPulse: React.FC<ElectronPulseProps> = ({ f }) => {
  // Power Bus Pulse (Amber) traveling Left to Center
  const p1 = pulseProgress(f, 0.018, 0);
  const x1 = lerp(-5.4, -1.6, p1);

  // Clock Signal Pulse (Cyan) traveling Right to Center
  const p2 = pulseProgress(f, 0.024, 0.3);
  const x2 = lerp(5.2, 1.6, p2);

  // Data Bus Stream (3 parallel pulses)
  const p3 = pulseProgress(f, 0.03, 0.5);
  const z3 = lerp(5.5, 1.8, p3);

  return (
    <group position={[0, 0.04, 0]}>
      {/* 1. Amber Power Current Head */}
      <mesh position={[x1, 0, 0]}>
        <boxGeometry args={[0.8, 0.04, 0.38]} />
        <meshBasicMaterial
          color={CIRCUIT_PALETTE.electronAmber}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 2. Clock Bus Cyan Signal Head */}
      <mesh position={[x2, 0, -0.6]}>
        <boxGeometry args={[0.6, 0.04, 0.28]} />
        <meshBasicMaterial
          color={CIRCUIT_PALETTE.clockCyan}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Triple Data Stream Heads */}
      {[-0.3, 0, 0.3].map((offset, i) => (
        <mesh key={i} position={[offset, 0, z3]}>
          <boxGeometry args={[0.18, 0.04, 0.5]} />
          <meshBasicMaterial
            color={CIRCUIT_PALETTE.clockCyan}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};
