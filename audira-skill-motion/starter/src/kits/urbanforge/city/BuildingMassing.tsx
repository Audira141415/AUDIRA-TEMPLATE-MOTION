import React, { useMemo } from "react";
import * as THREE from "three";
import { createPlasterModelMaterial, createProjectedDataMaterial } from "../lib/materials";
import { URBAN_PALETTE } from "../lib/palette";

interface BuildingDef {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  isHero?: boolean;
}

interface BuildingMassingProps {
  waveFrontZ?: number;
  projectedLayer?: "none" | "height" | "zoning" | "solar";
}

export const BuildingMassing: React.FC<BuildingMassingProps> = ({
  waveFrontZ = -10,
  projectedLayer = "height",
}) => {
  const whiteMat = useMemo(() => createPlasterModelMaterial(URBAN_PALETTE.modelWhite), []);
  const cyanMat = useMemo(() => createProjectedDataMaterial(URBAN_PALETTE.projectedCyan, 2.0), []);
  const amberMat = useMemo(() => createProjectedDataMaterial(URBAN_PALETTE.projectedAmber, 2.0), []);
  const emeraldMat = useMemo(() => createProjectedDataMaterial(URBAN_PALETTE.projectedEmerald, 2.0), []);

  // Pre-defined realistic city block layout
  const buildings: BuildingDef[] = useMemo(
    () => [
      // Central high-density district (Hero towers)
      { x: 0, z: 0, w: 1.8, d: 1.8, h: 4.8, isHero: true },
      { x: -2.2, z: 0.2, w: 1.4, d: 1.4, h: 3.6 },
      { x: 2.2, z: -0.2, w: 1.5, d: 1.3, h: 3.9 },
      { x: 0, z: -2.3, w: 1.6, d: 1.5, h: 3.2 },
      { x: 0, z: 2.3, w: 1.5, d: 1.5, h: 3.4 },

      // Mid-rise perimeter blocks
      { x: -2.2, z: -2.2, w: 1.2, d: 1.2, h: 2.4 },
      { x: 2.2, z: -2.2, w: 1.3, d: 1.2, h: 2.2 },
      { x: -2.2, z: 2.2, w: 1.2, d: 1.3, h: 2.1 },
      { x: 2.2, z: 2.2, w: 1.3, d: 1.3, h: 2.5 },

      // Low-rise outer belt
      { x: -4.0, z: 0, w: 1.2, d: 2.2, h: 1.5 },
      { x: 4.0, z: 0, w: 1.2, d: 2.0, h: 1.4 },
      { x: -4.0, z: -2.4, w: 1.2, d: 1.4, h: 1.2 },
      { x: 4.0, z: -2.4, w: 1.3, d: 1.3, h: 1.3 },
      { x: -4.0, z: 2.4, w: 1.2, d: 1.4, h: 1.1 },
      { x: 4.0, z: 2.4, w: 1.3, d: 1.3, h: 1.3 },

      // Waterfront promenade blocks
      { x: -1.0, z: 4.2, w: 1.4, d: 1.0, h: 1.8 },
      { x: 1.0, z: 4.2, w: 1.4, d: 1.0, h: 1.6 },
      { x: -3.0, z: 4.2, w: 1.2, d: 1.0, h: 1.4 },
      { x: 3.0, z: 4.2, w: 1.2, d: 1.0, h: 1.4 },
    ],
    []
  );

  return (
    <group>
      {buildings.map((b, i) => {
        // Determine whether this building is touched by the projection wave
        const isHit = b.z <= waveFrontZ;

        // Choose material based on layer & wave
        let mat = whiteMat;
        if (isHit && projectedLayer !== "none") {
          if (projectedLayer === "height") {
            mat = b.h > 3.5 ? amberMat : cyanMat;
          } else if (projectedLayer === "zoning") {
            mat = b.isHero ? amberMat : emeraldMat;
          } else {
            mat = cyanMat;
          }
        }

        return (
          <group key={i} position={[b.x, b.h / 2, b.z]}>
            <mesh material={mat} castShadow receiveShadow>
              <boxGeometry args={[b.w, b.h, b.d]} />
            </mesh>

            {/* If touched by data wave, show rooftop projection perimeter tag */}
            {isHit && (
              <mesh position={[0, b.h / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[b.w * 0.9, b.d * 0.9]} />
                <meshBasicMaterial color={URBAN_PALETTE.projectedCyan} transparent opacity={0.6} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};
