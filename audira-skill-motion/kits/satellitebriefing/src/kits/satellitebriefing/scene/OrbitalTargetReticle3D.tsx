import React from "react";
import { computeSatelliteBriefingState } from "../core/motion";
import { SATELLITEBRIEFING_PALETTE } from "../lib/palette";

export const OrbitalTargetReticle3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeSatelliteBriefingState(f);
  const targets: [number, number, number][] = [
    [-0.45, 0.22, -0.15],
    [0.85, 0.16, 0.45],
    [0.15, 0.05, -0.75],
  ];

  return (
    <group>
      {targets.map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Amber OSINT Bounding Box Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[state.reticlePulse, state.reticlePulse, 1]}>
            <ringGeometry args={[0.26, 0.31, 4]} />
            <meshBasicMaterial color={SATELLITEBRIEFING_PALETTE.readingAmber} />
          </mesh>
          {/* Vertical Telemetry Pin Pillar */}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.9, 8]} />
            <meshBasicMaterial color={SATELLITEBRIEFING_PALETTE.readingAmber} />
          </mesh>
          <mesh position={[0, 0.92, 0]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshBasicMaterial color={SATELLITEBRIEFING_PALETTE.vectorWhite} />
          </mesh>
        </group>
      ))}
    </group>
  );
};