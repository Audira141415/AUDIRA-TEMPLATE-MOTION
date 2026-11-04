// NANOFORGE Cellular Vesicle — Pulsating phospholipid bilayer sphere with internal organelle core.

import React from "react";
import { NANO_PALETTE } from "../lib/palette";
import { membranePulse, brownianDrift } from "../core/motion";

interface CellularVesicleProps {
  f: number;
  initialPos: [number, number, number];
  radius?: number;
  pulseRate?: number;
  color?: string;
}

export const CellularVesicle: React.FC<CellularVesicleProps> = ({
  f,
  initialPos,
  radius = 0.8,
  pulseRate = 0.05,
  color = NANO_PALETTE.membraneGlow,
}) => {
  const pulse = membranePulse(f, pulseRate, 0.08);
  const driftX = brownianDrift(f, 0.03, 0.15, initialPos[0]);
  const driftY = brownianDrift(f, 0.025, 0.18, initialPos[1]);
  const driftZ = brownianDrift(f, 0.035, 0.12, initialPos[2]);

  return (
    <group position={[initialPos[0] + driftX, initialPos[1] + driftY, initialPos[2] + driftZ]} scale={pulse}>
      {/* 1. Outer Translucent Lipid Membrane */}
      <mesh castShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.25}
          metalness={0.05}
          transmission={0.7}
          ior={1.34}
          transparent
          opacity={0.75}
          clearcoat={0.9}
        />
      </mesh>

      {/* 2. Inner Organelle / Mitochondrial Nucleus */}
      <mesh>
        <dodecahedronGeometry args={[radius * 0.42, 1]} />
        <meshStandardMaterial
          color={NANO_PALETTE.lipidAmber}
          emissive={NANO_PALETTE.lipidAmber}
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* 3. Surface Receptor Proteins */}
      {[0, 1.2, 2.4, 3.6, 4.8].map((rot, idx) => (
        <mesh key={idx} position={[Math.sin(rot) * radius, Math.cos(rot) * radius, 0]}>
          <cylinderGeometry args={[0.04, 0.08, 0.25, 12]} />
          <meshStandardMaterial color={NANO_PALETTE.thymineCyan} emissive={NANO_PALETTE.thymineCyan} emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
};
