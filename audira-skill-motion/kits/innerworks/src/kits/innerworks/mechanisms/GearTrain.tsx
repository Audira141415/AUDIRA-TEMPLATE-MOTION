// INNERWORKS Gear Train — Mathematically locked gear ratios, rotating brass gears & central drive shaft.

import React from "react";
import { INNERWORKS_PALETTE } from "../lib/palette";
import { gearRotation } from "../core/motion";

interface GearTrainProps {
  f: number;
}

export const GearTrain: React.FC<GearTrainProps> = ({ f }) => {
  const baseAngle = f * 0.05;
  const gear1Rot = gearRotation(baseAngle, 1.0, 1);
  const gear2Rot = gearRotation(baseAngle, 1.6, -1);
  const gear3Rot = gearRotation(baseAngle, 0.8, 1);

  return (
    <group>
      {/* 1. Primary Drive Gear (24 Teeth equivalent, Radius 1.4) */}
      <group position={[-1.2, 0, 0]} rotation={[0, 0, gear1Rot]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.3, 1.3, 0.28, 24]} />
          <meshStandardMaterial
            color={INNERWORKS_PALETTE.brassGear}
            roughness={0.25}
            metalness={0.9}
          />
        </mesh>
        {/* Gear Teeth simulation rim */}
        <mesh>
          <torusGeometry args={[1.32, 0.08, 12, 24]} />
          <meshStandardMaterial color={INNERWORKS_PALETTE.hardenedShaft} metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Center Shaft */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 1.8, 24]} />
          <meshStandardMaterial color={INNERWORKS_PALETTE.steelChassis} metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* 2. Secondary Driven Pinion (15 Teeth equivalent, Radius 0.9) */}
      <group position={[1.0, 0.7, 0]} rotation={[0, 0, gear2Rot]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.85, 0.85, 0.28, 16]} />
          <meshStandardMaterial
            color={INNERWORKS_PALETTE.hardenedShaft}
            roughness={0.22}
            metalness={0.92}
          />
        </mesh>
        {/* Center Shaft */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 1.8, 24]} />
          <meshStandardMaterial color={INNERWORKS_PALETTE.steelChassis} metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* 3. Output Planetary Gear (30 Teeth equivalent, Radius 1.6) */}
      <group position={[0.8, -1.5, 0]} rotation={[0, 0, gear3Rot]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.24, 30]} />
          <meshStandardMaterial
            color={INNERWORKS_PALETTE.brassGear}
            roughness={0.28}
            metalness={0.88}
          />
        </mesh>
      </group>

      {/* 4. Reciprocating Piston Linkage */}
      <group position={[-1.2, 0, 0.25]}>
        <mesh position={[Math.cos(gear1Rot) * 0.7, Math.sin(gear1Rot) * 0.7, 0]}>
          <boxGeometry args={[0.16, 0.16, 0.2]} />
          <meshStandardMaterial color={INNERWORKS_PALETTE.hydraulicAmber} emissive={INNERWORKS_PALETTE.hydraulicAmber} emissiveIntensity={0.3} />
        </mesh>
      </group>
    </group>
  );
};

