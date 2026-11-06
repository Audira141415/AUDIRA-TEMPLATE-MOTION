import React from "react";
import * as THREE from "three";
import { WATERCOLOR_PALETTE } from "../lib/palette";
import { computeWatercolorState } from "../core/motion";

export const StorybookCharacter3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeWatercolorState(f);

  return (
    <group
      position={[0.2, 0.85 + state.characterY, 0.4]}
      rotation={[0, -0.2, 0]}
    >
      {/* 1. Whimsical Storybook Bear / Little Explorer Body */}
      {/* Torso with Soft Rose Dust Wash */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.65, 0.38]} />
        <meshStandardMaterial
          color={WATERCOLOR_PALETTE.washRoseDust}
          roughness={0.92}
          metalness={0.0}
        />
      </mesh>

      {/* Pencil Contour Edge Trim */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.555, 0.655, 0.385)]} />
        <lineBasicMaterial color={WATERCOLOR_PALETTE.pencilGraphite} transparent opacity={0.65} />
      </lineSegments>

      {/* 2. Character Head */}
      <group position={[0, 0.62, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.34, 16, 16]} />
          <meshStandardMaterial
            color="#FCECE6"
            roughness={0.9}
          />
        </mesh>
        {/* Soft Watercolor Blush on Cheeks */}
        <mesh position={[-0.18, -0.04, 0.28]}>
          <circleGeometry args={[0.075, 16]} />
          <meshBasicMaterial color={WATERCOLOR_PALETTE.washRoseDust} transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.18, -0.04, 0.28]}>
          <circleGeometry args={[0.075, 16]} />
          <meshBasicMaterial color={WATERCOLOR_PALETTE.washRoseDust} transparent opacity={0.7} />
        </mesh>
        {/* Hand-Drawn Eyes */}
        <mesh position={[-0.11, 0.05, 0.31]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color={WATERCOLOR_PALETTE.pencilGraphite} />
        </mesh>
        <mesh position={[0.11, 0.05, 0.31]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color={WATERCOLOR_PALETTE.pencilGraphite} />
        </mesh>

        {/* Cute Storybook Hat / Beret (Cobalt Blue Wash) */}
        <mesh position={[0, 0.28, -0.04]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.1, 16]} />
          <meshStandardMaterial color={WATERCOLOR_PALETTE.washCobaltBlue} roughness={0.88} />
        </mesh>
      </group>

      {/* 3. Little Articulated Arm (Holding a flower or waving) */}
      <group
        position={[0.35, 0.15, 0]}
        rotation={[state.characterArmRot, 0, -0.3]}
      >
        <mesh>
          <cylinderGeometry args={[0.07, 0.06, 0.32, 12]} />
          <meshStandardMaterial color={WATERCOLOR_PALETTE.washRoseDust} roughness={0.9} />
        </mesh>
        {/* Little hand */}
        <mesh position={[0, -0.2, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#FCECE6" roughness={0.9} />
        </mesh>
      </group>

      {/* 4. Legs firmly grounded on watercolor hill */}
      <mesh position={[-0.14, -0.45, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.28, 12]} />
        <meshStandardMaterial color={WATERCOLOR_PALETTE.washCobaltBlue} roughness={0.9} />
      </mesh>
      <mesh position={[0.14, -0.45, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.28, 12]} />
        <meshStandardMaterial color={WATERCOLOR_PALETTE.washCobaltBlue} roughness={0.9} />
      </mesh>
    </group>
  );
};
