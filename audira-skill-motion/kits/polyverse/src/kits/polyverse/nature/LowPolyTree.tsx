// POLYVERSE Low-Poly Tree — faceted stacked-cone pine tree with deterministic wind sway.

import React from "react";
import { POLY_PALETTE } from "../lib/palette";
import { windSway } from "../core/motion";

interface LowPolyTreeProps {
  position: [number, number, number];
  scale?: number;
  f: number;
  seed?: number;
}

export const LowPolyTree: React.FC<LowPolyTreeProps> = ({
  position,
  scale = 1.0,
  f,
  seed = 0,
}) => {
  const sway = windSway(f, 0.05, seed * 1.5, 0.06);

  return (
    <group position={position} scale={[scale, scale, scale]} rotation={[sway, 0, sway * 0.5]}>
      {/* 1. Faceted Wooden Trunk */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.16, 0.7, 5]} />
        <meshStandardMaterial color={POLY_PALETTE.woodBark} roughness={0.9} flatShading />
      </mesh>

      {/* 2. Lower Foliage Cone */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <coneGeometry args={[0.75, 0.9, 6]} />
        <meshStandardMaterial color={POLY_PALETTE.pineFoliage} roughness={0.8} flatShading />
      </mesh>

      {/* 3. Middle Foliage Cone */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <coneGeometry args={[0.55, 0.8, 6]} />
        <meshStandardMaterial color={POLY_PALETTE.pineAccent} roughness={0.8} flatShading />
      </mesh>

      {/* 4. Top Foliage Cone */}
      <mesh position={[0, 1.95, 0]} castShadow>
        <coneGeometry args={[0.35, 0.7, 6]} />
        <meshStandardMaterial color={POLY_PALETTE.pineFoliage} roughness={0.8} flatShading />
      </mesh>
    </group>
  );
};

