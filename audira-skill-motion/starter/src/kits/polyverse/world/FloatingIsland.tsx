// POLYVERSE Floating Island — faceted low-poly diorama with subterranean rock cone, grass plateau, and crystal monolith.

import React from "react";
import { POLY_PALETTE } from "../lib/palette";
import { LowPolyTree } from "../nature/LowPolyTree";
import { LowPolyWater } from "../nature/LowPolyWater";
import { LowPolyCloud } from "../nature/LowPolyCloud";

interface FloatingIslandProps {
  f: number;
}

export const FloatingIsland: React.FC<FloatingIslandProps> = ({ f }) => {
  // Crystal monolith rotation & levitation
  const crystalRotY = f * 0.02;
  const crystalBobY = Math.sin(f * 0.05) * 0.15;

  return (
    <group position={[0, -0.2, 0]}>
      {/* 1. Top Grass Plateau (Faceted Low-Poly Cylinder) */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[4.2, 4.4, 0.6, 7]} />
        <meshStandardMaterial color={POLY_PALETTE.grassEmerald} roughness={0.82} flatShading />
      </mesh>

      {/* 2. Subterranean Inverted Rock Cone (Faceted Basalt Strata) */}
      <mesh position={[0, -1.9, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[4.3, 3.4, 7]} />
        <meshStandardMaterial color={POLY_PALETTE.rockSlate} roughness={0.9} flatShading />
      </mesh>

      {/* 3. Embedded Rocky Boulders on the Surface */}
      <mesh position={[2.2, 0.45, 1.2]} scale={[0.8, 0.6, 0.7]} castShadow>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color={POLY_PALETTE.rockBasalt} roughness={0.88} flatShading />
      </mesh>
      <mesh position={[-2.4, 0.35, -1.5]} scale={[0.6, 0.5, 0.6]} castShadow>
        <dodecahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color={POLY_PALETTE.rockBasalt} roughness={0.88} flatShading />
      </mesh>

      {/* 4. Faceted Low-Poly River */}
      <LowPolyWater f={f} width={1.4} length={6.8} />

      {/* 5. Clustered Low-Poly Pine Trees */}
      <LowPolyTree position={[-1.8, 0.3, 1.5]} scale={1.1} f={f} seed={1} />
      <LowPolyTree position={[-2.6, 0.3, 0.4]} scale={0.85} f={f} seed={2} />
      <LowPolyTree position={[-1.4, 0.3, -2.1]} scale={1.0} f={f} seed={3} />
      <LowPolyTree position={[2.1, 0.3, -1.8]} scale={1.15} f={f} seed={4} />
      <LowPolyTree position={[2.8, 0.3, -0.6]} scale={0.8} f={f} seed={5} />

      {/* 6. Hero Faceted Crystal Monolith */}
      <group position={[0.2, 1.2 + crystalBobY, 0.2]} rotation={[0, crystalRotY, 0]}>
        <mesh castShadow>
          <octahedronGeometry args={[0.65, 0]} scale={[1.0, 2.2, 1.0]} />
          <meshStandardMaterial
            color={POLY_PALETTE.crystalMonolith}
            emissive={POLY_PALETTE.crystalMonolith}
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.7}
            flatShading
          />
        </mesh>
      </group>

      {/* 7. Low-Poly Clouds Circling the Island */}
      <LowPolyCloud initialPosition={[-5, 3.2, -4]} f={f} scale={1.1} speed={0.015} />
      <LowPolyCloud initialPosition={[3, 2.6, 4]} f={f} scale={0.9} speed={0.02} />
    </group>
  );
};
