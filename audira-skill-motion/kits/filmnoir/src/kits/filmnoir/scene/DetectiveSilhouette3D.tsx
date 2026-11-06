import React from "react";
import * as THREE from "three";
import { FILMNOIR_PALETTE } from "../lib/palette";
import { computeFilmNoirState } from "../core/motion";

export const DetectiveSilhouette3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeFilmNoirState(f);

  return (
    <group
      position={[-0.1, 0.95 + state.detectiveSwayY, 0.4]}
      rotation={[0, 0.35 + state.detectiveSwayRot, 0]}
    >
      {/* 1. Trench Coat Body Mesh (High-Contrast Black Silhouette with Cool Moonlight Rim) */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.52, 1.35, 16]} />
        <meshStandardMaterial
          color={FILMNOIR_PALETTE.voidDark}
          roughness={0.92}
          metalness={0.0}
        />
      </mesh>

      {/* Up-turned Trench Coat Collar */}
      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[0.26, 0.28, 0.22, 12, 1, true, 0, Math.PI * 1.5]} />
        <meshStandardMaterial
          color="#0A0D12"
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Fedora Hat with Wide Slanted Brim */}
      <group position={[0, 0.96, 0]} rotation={[0.08, 0, -0.06]}>
        {/* Hat Crown (Creased top) */}
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.26, 16]} />
          <meshStandardMaterial color="#080A0E" roughness={0.95} />
        </mesh>
        {/* Hat Band Ribbon */}
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.262, 0.262, 0.06, 16]} />
          <meshStandardMaterial color="#141820" roughness={0.8} />
        </mesh>
        {/* Slanted Hat Brim */}
        <mesh position={[0, 0, 0]} rotation={[0.06, 0, 0]}>
          <cylinderGeometry args={[0.48, 0.48, 0.02, 24]} />
          <meshStandardMaterial color="#080A0E" roughness={0.95} />
        </mesh>
      </group>

      {/* 3. Cigarette Glow (Tiny Ember in the Shadow) */}
      <group position={[0.14, 0.74, 0.22]}>
        <mesh>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial
            color="#FF4500"
            emissive="#FF3300"
            emissiveIntensity={2.5}
            roughness={0.2}
          />
        </mesh>
        {/* Tiny ember light bounce on collar */}
        <pointLight color="#FF5500" intensity={0.4} distance={0.35} />
      </group>

      {/* 4. Legs in Shadow */}
      <mesh position={[-0.12, -0.78, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.12, 0.65, 12]} />
        <meshStandardMaterial color="#07090D" roughness={0.9} />
      </mesh>
      <mesh position={[0.12, -0.78, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.12, 0.65, 12]} />
        <meshStandardMaterial color="#07090D" roughness={0.9} />
      </mesh>
    </group>
  );
};
