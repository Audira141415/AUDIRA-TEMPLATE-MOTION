import React from "react";
import * as THREE from "three";
import { FILMNOIR_PALETTE } from "../lib/palette";
import { computeFilmNoirState } from "../core/motion";

export const NoirStreet3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeFilmNoirState(f);

  return (
    <group>
      {/* 1. Wet Asphalt Ground Plane with High Specular Reflection */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[14, 18]} />
        <meshStandardMaterial
          color={FILMNOIR_PALETTE.pavementWet}
          roughness={0.18}
          metalness={0.65}
        />
      </mesh>

      {/* Rain Puddle with Selective Red Neon Diner Reflection */}
      <mesh position={[0.6, 0.002, 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.95, 32]} />
        <meshStandardMaterial
          color={FILMNOIR_PALETTE.pavementReflect}
          emissive={FILMNOIR_PALETTE.accentDinerNeon}
          emissiveIntensity={0.12}
          roughness={0.06}
          metalness={0.9}
        />
      </mesh>

      {/* Ripple ring in puddle */}
      <mesh position={[0.6, 0.005, 0.8]} rotation={[-Math.PI / 2, 0, 0]} scale={[state.rippleScale, state.rippleScale, 1]}>
        <ringGeometry args={[0.2, 0.24, 32]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={Math.max(0, 1 - state.rippleScale) * 0.35}
        />
      </mesh>

      {/* 2. Brick Alley Wall (High-Contrast Chiaroscuro Texture) */}
      <mesh position={[-2.4, 2.5, -0.8]} rotation={[0, Math.PI * 0.15, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5.5, 6]} />
        <meshStandardMaterial
          color={FILMNOIR_PALETTE.brickWall}
          roughness={0.88}
          metalness={0.05}
        />
      </mesh>

      {/* 3. Venetian Blinds Shadow Cast Cutter (Gobos in Front of Light) */}
      <group position={[-1.2, 2.4, 0.5]} rotation={[0, 0, state.shadowSlant]}>
        {[-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2].map((yOffset, i) => (
          <mesh key={i} position={[0, yOffset, 0]} castShadow>
            <boxGeometry args={[0.08, 0.14, 2.8]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        ))}
      </group>

      {/* 4. Vintage Cast-Iron Street Lamppost */}
      <group position={[1.8, 0, -0.8]}>
        {/* Base */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.26, 0.5, 12]} />
          <meshStandardMaterial color={FILMNOIR_PALETTE.trimIron} roughness={0.7} />
        </mesh>
        {/* Pillar Pole */}
        <mesh position={[0, 2.2, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 3.5, 12]} />
          <meshStandardMaterial color={FILMNOIR_PALETTE.trimIron} roughness={0.7} />
        </mesh>
        {/* Curved Lamp Arm */}
        <mesh position={[-0.35, 3.85, 0]} rotation={[0, 0, Math.PI * 0.25]}>
          <cylinderGeometry args={[0.05, 0.05, 0.9, 8]} />
          <meshStandardMaterial color={FILMNOIR_PALETTE.trimIron} roughness={0.7} />
        </mesh>
        {/* Lantern Head Housing */}
        <mesh position={[-0.7, 3.7, 0]}>
          <coneGeometry args={[0.26, 0.35, 8]} />
          <meshStandardMaterial color={FILMNOIR_PALETTE.trimIron} roughness={0.6} />
        </mesh>
        {/* Glowing Tungsten Bulb */}
        <mesh position={[-0.7, 3.55, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color={FILMNOIR_PALETTE.streetLightTungsten}
            emissive={FILMNOIR_PALETTE.streetLightTungsten}
            emissiveIntensity={3.5}
            roughness={0.1}
          />
        </mesh>

        {/* Volumetric Light Cone Geometry */}
        <mesh position={[-0.7, 1.8, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[1.5, 3.6, 24, 1, true]} />
          <meshBasicMaterial
            color={FILMNOIR_PALETTE.streetLightTungsten}
            transparent
            opacity={0.09}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Dynamic Street Pointlight */}
        <pointLight
          position={[-0.7, 3.5, 0]}
          color={FILMNOIR_PALETTE.streetLightTungsten}
          intensity={state.lightIntensity * 2.8}
          distance={10}
          decay={2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
      </group>

      {/* 5. Drifting Smoky Mist Particulates */}
      <group position={[0.2 + state.smokeDriftX, 1.4 + state.smokeDriftY, 0]}>
        <mesh>
          <sphereGeometry args={[0.55, 12, 12]} />
          <meshBasicMaterial color="#E0E6ED" transparent opacity={0.07} />
        </mesh>
        <mesh position={[-0.4, -0.3, 0.2]}>
          <sphereGeometry args={[0.42, 12, 12]} />
          <meshBasicMaterial color="#E0E6ED" transparent opacity={0.05} />
        </mesh>
      </group>
    </group>
  );
};
