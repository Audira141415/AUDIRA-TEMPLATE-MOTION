// POLYVERSE Low-Poly Cloud — cluster of flat-shaded faceted geometric puffs drifting on the wind.

import React from "react";
import { POLY_PALETTE } from "../lib/palette";

interface LowPolyCloudProps {
  initialPosition: [number, number, number];
  f: number;
  scale?: number;
  speed?: number;
}

export const LowPolyCloud: React.FC<LowPolyCloudProps> = ({
  initialPosition,
  f,
  scale = 1.0,
  speed = 0.02,
}) => {
  // Cloud drifts along X and wraps around periodically
  const driftX = initialPosition[0] + ((f * speed) % 18) - 9;
  const bobY = Math.sin(f * 0.03 + initialPosition[2]) * 0.12;

  return (
    <group position={[driftX, initialPosition[1] + bobY, initialPosition[2]]} scale={[scale, scale * 0.65, scale]}>
      <mesh position={[0, 0, 0]} castShadow>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial color={POLY_PALETTE.cloudWhite} roughness={0.95} flatShading />
      </mesh>
      <mesh position={[-0.8, -0.1, 0.1]} castShadow>
        <dodecahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial color={POLY_PALETTE.cloudWhite} roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0.75, -0.05, -0.1]} castShadow>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color={POLY_PALETTE.cloudWhite} roughness={0.95} flatShading />
      </mesh>
    </group>
  );
};
