// PRECISION Studio Stage — High-key softbox illumination & cyclorama contact shadows.

import React from "react";
import { PRECISION_PALETTE } from "../lib/palette";

export const StudioStage: React.FC = () => {
  return (
    <>
      {/* Neutral Studio Ambient */}
      <ambientLight color="#f0f2f5" intensity={0.8} />

      {/* Main Overhead Softbox */}
      <directionalLight
        position={[4, 9, 6]}
        color="#ffffff"
        intensity={2.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />

      {/* Rim Kicker Light (Edge Definition) */}
      <pointLight position={[-6, 2, -4]} color="#e0e8ff" intensity={2.0} distance={15} />

      {/* Subtle Warm Fill */}
      <pointLight position={[5, -2, -3]} color="#fff3e0" intensity={1.2} distance={12} />

      {/* Studio Cyclorama Ground Plinth */}
      <mesh position={[0, -3.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color={PRECISION_PALETTE.cycloramaFloor}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    </>
  );
};
