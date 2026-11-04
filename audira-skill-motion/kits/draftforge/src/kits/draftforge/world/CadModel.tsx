// DRAFTFORGE CadModel — hero mechanical assembly with animated CAD line drawing, exploded view, and centerline.

import React, { useMemo } from "react";
import * as THREE from "three";
import { DRAFT_PALETTE } from "../lib/palette";
import { DimensionLine } from "../cad/DimensionLine";
import { lerp } from "../core/motion";

interface CadModelProps {
  f: number;
  explodeProgress?: number; // 0 to 1
  drawProgress?: number;    // 0 to 1
}

export const CadModel: React.FC<CadModelProps> = ({
  f,
  explodeProgress = 0,
  drawProgress = 1,
}) => {
  // Exploded part offsets along Z
  const intakeZ = lerp(0, -2.2, explodeProgress);
  const compressorZ = lerp(0, -0.8, explodeProgress);
  const turbineZ = lerp(0, 0.9, explodeProgress);
  const nozzleZ = lerp(0, 2.5, explodeProgress);

  // Turbine rotation
  const rotorSpin = f * 0.04;

  // Centerline dashed axis
  const axisGeo = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0, -4.5),
      new THREE.Vector3(0, 0, 4.5),
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  return (
    <group rotation={[0, -Math.PI / 4, 0]}>
      {/* 1. Engineering Centerline (Long-Dash-Dot) */}
      <lineSegments>
        <bufferGeometry attach="geometry" {...axisGeo} />
        <lineBasicMaterial attach="material" color={DRAFT_PALETTE.cadCyan} transparent opacity={0.6} />
      </lineSegments>

      {/* 2. Air Intake Cowl (Slides forward) */}
      <group position={[0, 0, intakeZ]}>
        <mesh>
          <cylinderGeometry args={[1.35, 1.25, 0.8, 24, 1, true]} />
          <meshBasicMaterial color={DRAFT_PALETTE.cadWhite} wireframe transparent opacity={drawProgress * 0.9} />
        </mesh>
      </group>

      {/* 3. Compressor Stage (Blades & Housing) */}
      <group position={[0, 0, compressorZ]}>
        <mesh>
          <cylinderGeometry args={[1.2, 1.05, 1.2, 20, 2, true]} />
          <meshBasicMaterial color={DRAFT_PALETTE.cadCyan} wireframe transparent opacity={drawProgress * 0.85} />
        </mesh>
        {/* Rotating Compressor Rotor */}
        <mesh rotation={[0, 0, rotorSpin]}>
          <cylinderGeometry args={[0.95, 0.95, 0.15, 16, 1]} />
          <meshBasicMaterial color={DRAFT_PALETTE.cadWhite} wireframe transparent opacity={drawProgress * 0.95} />
        </mesh>
      </group>

      {/* 4. High-Pressure Turbine Stage */}
      <group position={[0, 0, turbineZ]}>
        <mesh>
          <cylinderGeometry args={[1.05, 0.9, 1.0, 20, 2, true]} />
          <meshBasicMaterial color={DRAFT_PALETTE.cadCyan} wireframe transparent opacity={drawProgress * 0.85} />
        </mesh>
        {/* Rotating Turbine Rotor */}
        <mesh rotation={[0, 0, -rotorSpin * 1.5]}>
          <cylinderGeometry args={[0.82, 0.82, 0.18, 14, 1]} />
          <meshBasicMaterial color={DRAFT_PALETTE.cadWhite} wireframe transparent opacity={drawProgress * 0.95} />
        </mesh>
      </group>

      {/* 5. Exhaust Nozzle (Slides backward) */}
      <group position={[0, 0, nozzleZ]}>
        <mesh>
          <cylinderGeometry args={[0.85, 0.65, 0.9, 20, 1, true]} />
          <meshBasicMaterial color={DRAFT_PALETTE.cadWhite} wireframe transparent opacity={drawProgress * 0.9} />
        </mesh>
      </group>

      {/* 6. Technical 3D Dimension Callouts */}
      <DimensionLine
        start={[1.5, 0, -1.8]}
        end={[1.5, 0, 1.8]}
        offset={[0.8, 0, 0]}
        progress={drawProgress}
      />
      <DimensionLine
        start={[-1.35, 1.4, 0]}
        end={[1.35, 1.4, 0]}
        offset={[0, 0.6, 0]}
        progress={drawProgress}
      />
    </group>
  );
};

