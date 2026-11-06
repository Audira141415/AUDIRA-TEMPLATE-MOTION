import React from "react";
import { computeFluidforgeState } from "../core/motion";
import { FLUIDFORGE_PALETTE } from "../lib/palette";

export const LiquidMetalOrb3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeFluidforgeState(f);
  const droplets = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <group position={[0, state.waveOffset * 0.4, 0]}>
      {/* Central Ferrofluid Chrome Core */}
      <mesh scale={[state.corePulse, 1 / state.corePulse, state.corePulse]}>
        <sphereGeometry args={[0.92, 64, 64]} />
        <meshStandardMaterial
          color={FLUIDFORGE_PALETTE.chromeCore}
          metalness={0.96}
          roughness={0.06}
        />
      </mesh>

      {/* Coalescing Satellite Liquid Droplets */}
      {droplets.map((i) => {
        const angle = state.orbitAngle + (i * Math.PI * 2) / droplets.length;
        const radius = 1.32 + Math.sin(f * 0.05 + i) * 0.18;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 2 + i) * 0.45;
        const color = i % 2 === 0 ? FLUIDFORGE_PALETTE.cyanIridescent : FLUIDFORGE_PALETTE.magentaReflect;
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.18 + (i % 3) * 0.04, 32, 32]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.25}
              metalness={0.92}
              roughness={0.08}
            />
          </mesh>
        );
      })}
    </group>
  );
};