import React from "react";
import { AUDIRABOT_PALETTE } from "../lib/palette";
import { computeBotState } from "../core/motion";

export const AudiraBotMesh: React.FC<{ f: number }> = ({ f }) => {
  const state = computeBotState(f);
  // Secondary motion micro-wobble for audio ears
  const earWobble = Math.sin(f * 0.18) * 0.04;

  // Eye color based on current emotion
  const eyeColor =
    state.emotion === "HAPPY"
      ? AUDIRABOT_PALETTE.eyeGreen
      : state.emotion === "THINKING"
      ? AUDIRABOT_PALETTE.eyeAmber
      : AUDIRABOT_PALETTE.eyeCyan;

  return (
    <group position={[0, state.hoverY, 0]} rotation={[0.08, state.turnY, state.tiltZ]}>
      {/* 1. Main Egg/Chassis Body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial color={AUDIRABOT_PALETTE.chassisWhite} roughness={0.2} metalness={0.1} />
      </mesh>

      {/* 2. Curved Visor Faceplate */}
      <mesh position={[0, 0.12, 0.46]}>
        <sphereGeometry args={[0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
        <meshPhysicalMaterial
          color={AUDIRABOT_PALETTE.visorGlass}
          roughness={0.05}
          metalness={0.9}
          clearcoat={1.0}
        />
      </mesh>

      {/* 3. Emotive Digital OLED Eyes */}
      <group position={[0, 0.18, 0.88]}>
        {/* Left Eye */}
        <mesh position={[-0.18, 0, 0]} scale={[1, state.blinkScaleY, 1]}>
          <capsuleGeometry args={[0.065, 0.13, 8, 16]} />
          <meshBasicMaterial color={eyeColor} />
        </mesh>
        {/* Right Eye */}
        <mesh position={[0.18, 0, 0]} scale={[1, state.blinkScaleY, 1]}>
          <capsuleGeometry args={[0.065, 0.13, 8, 16]} />
          <meshBasicMaterial color={eyeColor} />
        </mesh>
      </group>

      {/* 4. Gold Antennae / Audio Ears */}
      <mesh position={[-0.92, 0.2, 0]} rotation={[0, 0, Math.PI / 2 + earWobble]}>
        <cylinderGeometry args={[0.08, 0.16, 0.15, 16]} />
        <meshStandardMaterial color={AUDIRABOT_PALETTE.accentGold} metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[0.92, 0.2, 0]} rotation={[0, 0, -Math.PI / 2 - earWobble]}>
        <cylinderGeometry args={[0.08, 0.16, 0.15, 16]} />
        <meshStandardMaterial color={AUDIRABOT_PALETTE.accentGold} metalness={0.8} roughness={0.25} />
      </mesh>

      {/* 5. Articulated Floating Gesturing Arm (Right) */}
      <group position={[0.95, -0.05, 0.1]} rotation={[state.armAngle, 0, -0.3]}>
        <mesh position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
          <meshStandardMaterial color={AUDIRABOT_PALETTE.chassisWhite} roughness={0.2} />
        </mesh>
        {/* Pointing Hand Node */}
        <mesh position={[0, -0.58, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={AUDIRABOT_PALETTE.accentGold} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* 6. Resting Stabilizer Arm (Left) */}
      <group position={[-0.95, -0.05, 0.1]} rotation={[0.2, 0, 0.3]}>
        <mesh position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
          <meshStandardMaterial color={AUDIRABOT_PALETTE.chassisWhite} roughness={0.2} />
        </mesh>
      </group>

      {/* 7. Underbody Antigravity Thruster Glow */}
      <mesh position={[0, -0.85, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.32, 0.55, 24]} />
        <meshBasicMaterial color={AUDIRABOT_PALETTE.thrusterPlasma} transparent opacity={0.65} />
      </mesh>

      {/* 8. Floating Holographic Halo Ring */}
      <mesh position={[0, 1.15, 0]} rotation={[0.25, 0, 0]}>
        <torusGeometry args={[0.5, 0.02, 12, 36]} />
        <meshBasicMaterial color={AUDIRABOT_PALETTE.eyeCyan} transparent opacity={0.7} />
      </mesh>
    </group>
  );
};
