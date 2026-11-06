import React from "react";
import { computeFluidforgeState } from "../core/motion";
import { FLUIDFORGE_PALETTE } from "../lib/palette";

export const CausticRingArena3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeFluidforgeState(f);
  return (
    <group>
      {/* Outer Iridescent Torus Rings */}
      <mesh rotation={[0.6 + state.ringTilt, state.orbitAngle * 0.5, 0]}>
        <torusGeometry args={[1.85, 0.035, 24, 96]} />
        <meshStandardMaterial
          color={FLUIDFORGE_PALETTE.cyanIridescent}
          emissive={FLUIDFORGE_PALETTE.cyanIridescent}
          emissiveIntensity={0.45}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh rotation={[-0.5 - state.ringTilt, -state.orbitAngle * 0.4, 0.4]}>
        <torusGeometry args={[2.25, 0.025, 24, 96]} />
        <meshStandardMaterial
          color={FLUIDFORGE_PALETTE.magentaReflect}
          emissive={FLUIDFORGE_PALETTE.magentaReflect}
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Reflective Dark Mirror Floor */}
      <mesh position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial color="#080A12" roughness={0.15} metalness={0.85} />
      </mesh>
    </group>
  );
};