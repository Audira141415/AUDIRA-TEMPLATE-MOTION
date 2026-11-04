// GLASSCRAFT Liquid Droplets — optical refractive glass orbs orbiting with surface tension buoyancy.

import React from "react";
import { GLASS_PALETTE } from "../lib/palette";
import { buoyancy, liquidWobble } from "../core/motion";

interface LiquidDropletProps {
  f: number;
  initialPos: [number, number, number];
  radius?: number;
  color?: string;
  speed?: number;
}

export const LiquidDroplet: React.FC<LiquidDropletProps> = ({
  f,
  initialPos,
  radius = 0.35,
  color = GLASS_PALETTE.prismCyan,
  speed = 0.03,
}) => {
  const bobY = buoyancy(f, speed, 0.2, initialPos[0]);
  const wobbleX = liquidWobble(f, 0.08, initialPos[2]);
  const wobbleY = liquidWobble(f, 0.07, initialPos[0]);

  return (
    <group position={[initialPos[0], initialPos[1] + bobY, initialPos[2]]} scale={[1 + wobbleX, 1 - wobbleY, 1 + wobbleX]}>
      <mesh castShadow>
        <sphereGeometry args={[radius, 32, 24]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.02}
          metalness={0.1}
          transmission={0.88}
          ior={1.46}
          thickness={0.8}
          clearcoat={1.0}
          transparent
        />
      </mesh>
    </group>
  );
};

