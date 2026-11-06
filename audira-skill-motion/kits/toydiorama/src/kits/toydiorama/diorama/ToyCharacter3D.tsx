import React from "react";
import * as THREE from "three";
import { TOYDIORAMA_PALETTE } from "../lib/palette";
import { computeToyDioramaState } from "../core/motion";

export const ToyCharacter3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeToyDioramaState(f);

  return (
    <group
      position={[0, state.charBodyY + 0.85, 0.2]}
      rotation={[0, state.charBodyRotY, 0]}
    >
      {/* 1. Torso: Blocky trapezoidal body with rounded edges */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.65, 0.72, 0.42]} />
        <meshStandardMaterial
          color={TOYDIORAMA_PALETTE.characterShirt}
          roughness={0.72}
          metalness={0.04}
        />
      </mesh>

      {/* Soft Collar Rim */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.22, 0.24, 0.08, 16]} />
        <meshStandardMaterial
          color={TOYDIORAMA_PALETTE.characterCollar}
          roughness={0.8}
        />
      </mesh>

      {/* 2. Head Group: Rounded blocky head with tilt and turn */}
      <group
        position={[0, 0.78, 0]}
        rotation={[0, state.charHeadTurnY, state.charHeadTiltZ]}
      >
        {/* Head Box */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.72, 0.68, 0.62]} />
          <meshStandardMaterial
            color={TOYDIORAMA_PALETTE.characterSkin}
            roughness={0.75}
            metalness={0.02}
          />
        </mesh>

        {/* Matte Chocolate Toy Hair Piece */}
        <mesh position={[0, 0.28, 0.02]}>
          <boxGeometry args={[0.76, 0.32, 0.66]} />
          <meshStandardMaterial
            color={TOYDIORAMA_PALETTE.characterHair}
            roughness={0.82}
          />
        </mesh>
        {/* Hair Bangs */}
        <mesh position={[0, 0.22, 0.34]}>
          <boxGeometry args={[0.54, 0.16, 0.12]} />
          <meshStandardMaterial
            color={TOYDIORAMA_PALETTE.characterHair}
            roughness={0.82}
          />
        </mesh>

        {/* Polished Black Bead Eyes (Discrete Blinking) */}
        <group scale={[1, state.blinkScaleY, 1]}>
          <mesh position={[-0.18, 0.02, 0.32]}>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial
              color={TOYDIORAMA_PALETTE.beadEyes}
              roughness={0.15}
              metalness={0.3}
            />
          </mesh>
          <mesh position={[0.18, 0.02, 0.32]}>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial
              color={TOYDIORAMA_PALETTE.beadEyes}
              roughness={0.15}
              metalness={0.3}
            />
          </mesh>
        </group>

        {/* Soft Blushing Cheeks */}
        <mesh position={[-0.24, -0.12, 0.32]}>
          <circleGeometry args={[0.065, 16]} />
          <meshBasicMaterial color={TOYDIORAMA_PALETTE.characterCheeks} />
        </mesh>
        <mesh position={[0.24, -0.12, 0.32]}>
          <circleGeometry args={[0.065, 16]} />
          <meshBasicMaterial color={TOYDIORAMA_PALETTE.characterCheeks} />
        </mesh>

        {/* Friendly Curved Smile */}
        <mesh position={[0, -0.14, 0.32]} rotation={[0, 0, Math.PI]}>
          <ringGeometry args={[0.06, 0.08, 16, 1, 0, Math.PI]} />
          <meshBasicMaterial color="#3D281E" />
        </mesh>
      </group>

      {/* 3. Articulated Right Arm (Waving Gesture) */}
      <group
        position={[0.42, 0.24, 0]}
        rotation={[state.rightArmRotX, 0, state.rightArmRotZ]}
      >
        {/* Shoulder socket */}
        <mesh>
          <sphereGeometry args={[0.11, 12, 12]} />
          <meshStandardMaterial color={TOYDIORAMA_PALETTE.characterShirt} roughness={0.72} />
        </mesh>
        {/* Arm Sleeve */}
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.1, 0.09, 0.32, 12]} />
          <meshStandardMaterial color={TOYDIORAMA_PALETTE.characterShirt} roughness={0.72} />
        </mesh>
        {/* Mitten Hand */}
        <mesh position={[0, -0.42, 0]}>
          <sphereGeometry args={[0.11, 14, 14]} />
          <meshStandardMaterial color={TOYDIORAMA_PALETTE.characterSkin} roughness={0.75} />
        </mesh>
      </group>

      {/* 4. Left Arm (Natural Resting Stance) */}
      <group
        position={[-0.42, 0.24, 0]}
        rotation={[state.leftArmRotX, 0, state.leftArmRotZ]}
      >
        <mesh>
          <sphereGeometry args={[0.11, 12, 12]} />
          <meshStandardMaterial color={TOYDIORAMA_PALETTE.characterShirt} roughness={0.72} />
        </mesh>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.1, 0.09, 0.32, 12]} />
          <meshStandardMaterial color={TOYDIORAMA_PALETTE.characterShirt} roughness={0.72} />
        </mesh>
        <mesh position={[0, -0.42, 0]}>
          <sphereGeometry args={[0.11, 14, 14]} />
          <meshStandardMaterial color={TOYDIORAMA_PALETTE.characterSkin} roughness={0.75} />
        </mesh>
      </group>

      {/* 5. Legs & Boots (Grounded on wooden stage) */}
      {/* Right Leg */}
      <group position={[0.18, -0.52, 0]}>
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.22, 0.32, 0.26]} />
          <meshStandardMaterial color={TOYDIORAMA_PALETTE.characterPants} roughness={0.75} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.28, 0.04]} castShadow>
          <boxGeometry args={[0.24, 0.16, 0.34]} />
          <meshStandardMaterial color={TOYDIORAMA_PALETTE.characterBoots} roughness={0.8} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group position={[-0.18, -0.52, 0]}>
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.22, 0.32, 0.26]} />
          <meshStandardMaterial color={TOYDIORAMA_PALETTE.characterPants} roughness={0.75} />
        </mesh>
        {/* Boot */}
        <mesh position={[0, -0.28, 0.04]} castShadow>
          <boxGeometry args={[0.24, 0.16, 0.34]} />
          <meshStandardMaterial color={TOYDIORAMA_PALETTE.characterBoots} roughness={0.8} />
        </mesh>
      </group>

      {/* 6. Spawning / Interactive 3D Toy Prop (Golden Star Trophy / Gift Box) */}
      {state.propProgress > 0 && (
        <group
          position={[0.9, state.propHoverY - 0.7, 0.3]}
          rotation={[0, state.propRotY, 0]}
          scale={[state.propProgress, state.propProgress, state.propProgress]}
        >
          {/* Main Honey-Yellow Gift Box */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.42, 0.42]} />
            <meshStandardMaterial
              color={TOYDIORAMA_PALETTE.propPrimary}
              roughness={0.65}
              metalness={0.05}
            />
          </mesh>
          {/* Coral Ribbon Bands */}
          <mesh>
            <boxGeometry args={[0.44, 0.43, 0.1]} />
            <meshStandardMaterial color={TOYDIORAMA_PALETTE.propRibbon} roughness={0.7} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.1, 0.43, 0.44]} />
            <meshStandardMaterial color={TOYDIORAMA_PALETTE.propRibbon} roughness={0.7} />
          </mesh>
          {/* Top Bow */}
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color={TOYDIORAMA_PALETTE.propRibbon} roughness={0.7} />
          </mesh>
        </group>
      )}
    </group>
  );
};
