// CLAYWORLD Clay Diorama — rolled-out plasticine tabletop base with clay mushrooms, trees, and pebbles.

import React from "react";
import { CLAY_PALETTE } from "../lib/palette";

export const ClayDiorama: React.FC = () => {
  return (
    <group position={[0, -0.6, 0]}>
      {/* 1. Rolled-out Plasticine Ground Slab (Soft, rounded organic edges) */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[5.2, 5.5, 0.4, 36]} />
        <meshStandardMaterial color={CLAY_PALETTE.olive} roughness={0.92} metalness={0.0} />
      </mesh>

      {/* 2. Clay Mushroom A (Mustard cap) */}
      <group position={[-2.2, 0.1, 1.2]}>
        {/* Stem */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.22, 0.8, 16]} />
          <meshStandardMaterial color={CLAY_PALETTE.clayCream} roughness={0.88} />
        </mesh>
        {/* Cap */}
        <mesh position={[0, 0.85, 0]} scale={[1.2, 0.6, 1.2]} castShadow>
          <sphereGeometry args={[0.5, 20, 16]} />
          <meshStandardMaterial color={CLAY_PALETTE.mustard} roughness={0.84} />
        </mesh>
      </group>

      {/* 3. Clay Mushroom B (Coral cap) */}
      <group position={[-2.8, 0.1, 0.5]} scale={[0.7, 0.7, 0.7]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.2, 0.7, 16]} />
          <meshStandardMaterial color={CLAY_PALETTE.clayCream} roughness={0.88} />
        </mesh>
        <mesh position={[0, 0.75, 0]} scale={[1.2, 0.6, 1.2]} castShadow>
          <sphereGeometry args={[0.45, 20, 16]} />
          <meshStandardMaterial color={CLAY_PALETTE.coral} roughness={0.84} />
        </mesh>
      </group>

      {/* 4. Clay Bush / Tree (Dusty Teal rolled spheres) */}
      <group position={[2.5, 0.1, -1.0]}>
        <mesh position={[0, 0.5, 0]} scale={[0.9, 1.2, 0.9]} castShadow>
          <sphereGeometry args={[0.75, 20, 16]} />
          <meshStandardMaterial color={CLAY_PALETTE.dustyTeal} roughness={0.89} />
        </mesh>
        <mesh position={[-0.3, 0.9, 0.2]} scale={[0.6, 0.6, 0.6]} castShadow>
          <sphereGeometry args={[0.6, 16, 14]} />
          <meshStandardMaterial color={CLAY_PALETTE.dustyTeal} roughness={0.89} />
        </mesh>
      </group>

      {/* 5. Rolled Clay Pebbles */}
      <mesh position={[-1.2, 0.12, 2.2]} scale={[1.2, 0.7, 1.0]} castShadow>
        <sphereGeometry args={[0.24, 14, 10]} />
        <meshStandardMaterial color={CLAY_PALETTE.earthBrown} roughness={0.88} />
      </mesh>
      <mesh position={[1.4, 0.1, 1.9]} scale={[0.9, 0.6, 1.1]} castShadow>
        <sphereGeometry args={[0.18, 14, 10]} />
        <meshStandardMaterial color={CLAY_PALETTE.earthBrown} roughness={0.88} />
      </mesh>
    </group>
  );
};
