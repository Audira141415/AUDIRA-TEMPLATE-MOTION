// CLAYWORLD Clay Creature — expressive stop-motion plasticine character with squash-and-stretch and stepped blinking.

import React from "react";
import * as THREE from "three";
import { CLAY_PALETTE } from "../lib/palette";
import { stepFrame, squashScale } from "../core/motion";

interface ClayCreatureProps {
  f: number;
  hopHeight?: number;
  squashFactor?: number;
  blinkState?: boolean;
  color?: string;
}

export const ClayCreature: React.FC<ClayCreatureProps> = ({
  f,
  hopHeight = 0,
  squashFactor = 0,
  blinkState = false,
  color = CLAY_PALETTE.terracotta,
}) => {
  // Enforce stop-motion 15 FPS stepped cadence on limb micro-twitches
  const sf = stepFrame(f, 4);
  const headWobble = Math.sin(sf * 0.12) * 0.08;
  const handWave = Math.sin(sf * 0.25) * 0.35;

  const [sx, sy, sz] = squashScale(squashFactor);

  return (
    <group position={[0, -0.4 + hopHeight, 0]}>
      {/* 1. Main Dough Body (Squash & Stretch Applied) */}
      <group scale={[sx, sy, sz]}>
        <mesh position={[0, 0.9, 0]} rotation={[0, headWobble, 0]}>
          <sphereGeometry args={[0.85, 32, 24]} />
          <meshStandardMaterial color={color} roughness={0.86} metalness={0.02} />
        </mesh>

        {/* 2. Clay Belly Patch */}
        <mesh position={[0, 0.75, 0.6]} scale={[0.55, 0.55, 0.25]}>
          <sphereGeometry args={[0.7, 24, 16]} />
          <meshStandardMaterial color={CLAY_PALETTE.clayCream} roughness={0.88} />
        </mesh>
      </group>

      {/* 3. Clay Eyes (Stepped Blinking) */}
      <group position={[0, 1.05 * sy, 0.72 * sz]}>
        {/* Left Eye */}
        <group position={[-0.24, 0, 0]}>
          <mesh scale={blinkState ? [1.1, 0.15, 0.6] : [1, 1, 1]}>
            <sphereGeometry args={[0.16, 20, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          {!blinkState && (
            <mesh position={[0, 0, 0.12]}>
              <sphereGeometry args={[0.07, 16, 12]} />
              <meshStandardMaterial color={CLAY_PALETTE.charcoal} roughness={0.15} />
            </mesh>
          )}
        </group>

        {/* Right Eye */}
        <group position={[0.24, 0, 0]}>
          <mesh scale={blinkState ? [1.1, 0.15, 0.6] : [1, 1, 1]}>
            <sphereGeometry args={[0.16, 20, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          {!blinkState && (
            <mesh position={[0, 0, 0.12]}>
              <sphereGeometry args={[0.07, 16, 12]} />
              <meshStandardMaterial color={CLAY_PALETTE.charcoal} roughness={0.15} />
            </mesh>
          )}
        </group>
      </group>

      {/* 4. Clay Hands (Left static, Right waving) */}
      <mesh position={[-0.85 * sx, 0.7 * sy, 0]} rotation={[0, 0, 0.3]}>
        <sphereGeometry args={[0.18, 16, 12]} />
        <meshStandardMaterial color={color} roughness={0.86} />
      </mesh>
      <mesh position={[0.85 * sx, 0.85 * sy, 0.2]} rotation={[0, 0, -0.4 + handWave]}>
        <sphereGeometry args={[0.18, 16, 12]} />
        <meshStandardMaterial color={color} roughness={0.86} />
      </mesh>

      {/* 5. Little Clay Feet */}
      <mesh position={[-0.32, 0.12, 0.15]} scale={[1.2, 0.6, 1.4]}>
        <sphereGeometry args={[0.22, 16, 12]} />
        <meshStandardMaterial color={color} roughness={0.86} />
      </mesh>
      <mesh position={[0.32, 0.12, 0.15]} scale={[1.2, 0.6, 1.4]}>
        <sphereGeometry args={[0.22, 16, 12]} />
        <meshStandardMaterial color={color} roughness={0.86} />
      </mesh>
    </group>
  );
};
