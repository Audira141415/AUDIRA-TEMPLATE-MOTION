// GLASSCRAFT Glass Card — 3D floating frosted glass card with chromatic prism bevel and spatial icon.

import React from "react";
import { GLASS_PALETTE } from "../lib/palette";
import { buoyancy } from "../core/motion";

interface GlassCardProps {
  f: number;
  tiltX?: number;
  tiltY?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ f, tiltX = 0, tiltY = 0 }) => {
  const bobY = buoyancy(f, 0.035, 0.12);
  const microRoll = Math.sin(f * 0.025) * 0.03;

  return (
    <group position={[0, bobY, 0]} rotation={[tiltX, tiltY, microRoll]}>
      {/* 1. Main Frosted Glass Slab */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.2, 4.4, 0.18]} />
        <meshPhysicalMaterial
          color={GLASS_PALETTE.frostedGlass}
          roughness={0.06}
          metalness={0.05}
          transmission={0.93}
          ior={1.5}
          thickness={1.4}
          clearcoat={0.6}
          transparent
          opacity={0.98}
        />
      </mesh>

      {/* 2. Chromatic Prism Edge Border */}
      <mesh scale={[1.01, 1.01, 1.02]}>
        <boxGeometry args={[3.2, 4.4, 0.18]} />
        <meshStandardMaterial
          color={GLASS_PALETTE.prismBlue}
          wireframe
          transparent
          opacity={0.4}
          emissive={GLASS_PALETTE.prismCyan}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* 3. Floating Spatial Hologram Chip inside the Glass */}
      <group position={[0, 0.8, 0.12]}>
        <mesh>
          <octahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial
            color={GLASS_PALETTE.prismMagenta}
            emissive={GLASS_PALETTE.prismMagenta}
            emissiveIntensity={0.6}
            roughness={0.15}
            metalness={0.8}
          />
        </mesh>
      </group>

      {/* 4. Frosted Glass Accent Strip */}
      <mesh position={[0, -1.2, 0.1]}>
        <boxGeometry args={[2.4, 0.35, 0.04]} />
        <meshStandardMaterial
          color={GLASS_PALETTE.prismAmber}
          emissive={GLASS_PALETTE.prismAmber}
          emissiveIntensity={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
};
