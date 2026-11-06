import React from "react";
import { computeBackroomsState } from "../core/motion";
import { BACKROOMS_PALETTE } from "../lib/palette";

export const FluorescentCeiling3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeBackroomsState(f);
  const lightsZ = [-4.0, -1.5, 1.0, 3.5];

  return (
    <group>
      {lightsZ.map((z, i) => {
        const intensity = i === 1 ? state.tubeFlicker : 1.3;
        return (
          <group key={i} position={[0, 2.66, z]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.9, 0.45]} />
              <meshStandardMaterial
                color={BACKROOMS_PALETTE.fluorescentWhite}
                emissive={BACKROOMS_PALETTE.fluorescentWhite}
                emissiveIntensity={intensity}
              />
            </mesh>
            <pointLight
              position={[0, -0.25, 0]}
              color={BACKROOMS_PALETTE.fluorescentWhite}
              intensity={intensity * 0.75}
              distance={5.5}
            />
          </group>
        );
      })}
    </group>
  );
};