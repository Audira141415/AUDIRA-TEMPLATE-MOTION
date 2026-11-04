// PRECISION Exploded Assembly — High-precision industrial components with monotonic separation timing.

import React from "react";
import { PRECISION_PALETTE } from "../lib/palette";
import { lerp } from "../core/motion";

interface ExplodedAssemblyProps {
  f: number;
  explodeProgress: number; // 0 = docked, 1 = fully exploded
}

export const ExplodedAssembly: React.FC<ExplodedAssemblyProps> = ({ f, explodeProgress }) => {
  // Monotone separation: Outer casing separates furthest, inner cores stay closer
  const outerCapOffset = lerp(0, 1.8, explodeProgress);
  const driverOffset = lerp(0, 0.9, explodeProgress);
  const acousticChamberOffset = lerp(0, 0.3, explodeProgress);
  const stemOffset = lerp(0, -1.2, explodeProgress);

  return (
    <group rotation={[0.2, f * 0.008, 0]}>
      {/* 1. Outer Ceramic Acoustic Cap */}
      <mesh position={[0, 0, outerCapOffset]} castShadow receiveShadow>
        <cylinderGeometry args={[1.1, 1.2, 0.35, 36]} />
        <meshPhysicalMaterial
          color={PRECISION_PALETTE.ceramicGloss}
          roughness={0.08}
          metalness={0.05}
          clearcoat={1.0}
        />
      </mesh>

      {/* 2. Graphene Acoustic Driver & Copper Coil */}
      <group position={[0, 0, driverOffset]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.9, 0.9, 0.15, 36]} />
          <meshStandardMaterial
            color={PRECISION_PALETTE.copperAccents}
            roughness={0.25}
            metalness={0.85}
          />
        </mesh>
        {/* Magnet Ring */}
        <mesh position={[0, 0, -0.1]}>
          <torusGeometry args={[0.7, 0.08, 16, 36]} />
          <meshStandardMaterial
            color={PRECISION_PALETTE.titaniumNatural}
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* 3. Titanium Chassis / Acoustic Chamber Base */}
      <mesh position={[0, 0, acousticChamberOffset]} castShadow receiveShadow>
        <cylinderGeometry args={[1.25, 1.0, 0.8, 36]} />
        <meshStandardMaterial
          color={PRECISION_PALETTE.spaceGray}
          roughness={0.28}
          metalness={0.88}
        />
      </mesh>

      {/* 4. Lower Stem / Logic Battery Housing */}
      <mesh position={[0, stemOffset - 1.1, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.32, 1.6, 16, 32]} />
        <meshStandardMaterial
          color={PRECISION_PALETTE.anodizedSilver}
          roughness={0.22}
          metalness={0.92}
        />
      </mesh>

      {/* 5. Gold Contact Pins */}
      <mesh position={[0, stemOffset - 2.0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.1, 24]} />
        <meshStandardMaterial
          color="#d4af37"
          roughness={0.15}
          metalness={0.95}
        />
      </mesh>
    </group>
  );
};

