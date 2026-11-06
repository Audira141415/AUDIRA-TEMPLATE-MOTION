import React from "react";
import { computeDataPhysicalState } from "../core/motion";
import { DATAPHYSICAL_PALETTE } from "../lib/palette";

export const StackedMetalColumns3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeDataPhysicalState(f);
  const series = [0.65, 0.95, 1.25, 0.85, 1.4, 2.15, 1.1];

  return (
    <group rotation={[0, state.turntableYaw, 0]}>
      {series.map((h, i) => {
        const isHero = i === 5;
        const x = (i - 3) * 0.46;
        const actualH = isHero ? state.heroBarHeight : h;
        const color = isHero ? DATAPHYSICAL_PALETTE.focalOrange : DATAPHYSICAL_PALETTE.machinedAluminum;
        return (
          <group key={i} position={[x, 0, 0]}>
            <mesh position={[0, actualH / 2, 0]}>
              <boxGeometry args={[0.32, actualH, 0.65]} />
              <meshStandardMaterial
                color={color}
                roughness={isHero ? 0.35 : 0.2}
                metalness={isHero ? 0.25 : 0.88}
              />
            </mesh>
            {/* Brass Cap on Top of Each Column */}
            <mesh position={[0, actualH + 0.025, 0]}>
              <boxGeometry args={[0.32, 0.04, 0.65]} />
              <meshStandardMaterial
                color={DATAPHYSICAL_PALETTE.brassGold}
                roughness={0.22}
                metalness={0.9}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};