import React from "react";
import { URBAN_PALETTE } from "../lib/palette";

interface DataProjectionProps {
  waveFrontZ?: number;
  pulseBrightness?: number;
  showPin?: boolean;
}

export const DataProjection: React.FC<DataProjectionProps> = ({
  waveFrontZ = 0,
  pulseBrightness = 1.0,
  showPin = true,
}) => {
  return (
    <group>
      {/* 1. Sweeping Projection Wash Line on Ground */}
      <mesh position={[0, 0.04, waveFrontZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[11, 0.25]} />
        <meshBasicMaterial
          color={URBAN_PALETTE.projectedCyan}
          transparent
          opacity={0.8 * pulseBrightness}
        />
      </mesh>

      {/* 2. Soft Gradient Falloff Behind the Wave */}
      <mesh position={[0, 0.03, waveFrontZ - 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[11, 3.0]} />
        <meshBasicMaterial
          color={URBAN_PALETTE.projectedCyan}
          transparent
          opacity={0.15 * pulseBrightness}
        />
      </mesh>

      {/* 3. Hero Tower Spatial Pin Anchor */}
      {showPin && (
        <group position={[0, 4.8, 0]}>
          {/* Vertical Leader Line */}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 1.2, 8]} />
            <meshBasicMaterial color={URBAN_PALETTE.projectedAmber} />
          </mesh>

          {/* Floating Diamond / Pin Node */}
          <mesh position={[0, 1.3, 0]} rotation={[0, Math.PI * 0.25, Math.PI * 0.25]}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshBasicMaterial color={URBAN_PALETTE.projectedAmber} />
          </mesh>
        </group>
      )}
    </group>
  );
};
