import React, { useMemo } from "react";
import { createAbsPlasticMaterial } from "../lib/materials";
import { BRICK_PALETTE } from "../lib/palette";

interface ToyCharacterProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  leftLegAngle?: number;
  rightLegAngle?: number;
  leftArmAngle?: number;
  rightArmAngle?: number;
  torsoColor?: string;
  legsColor?: string;
  helmetColor?: string;
}

export const ToyCharacter: React.FC<ToyCharacterProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  leftLegAngle = 0,
  rightLegAngle = 0,
  leftArmAngle = 0,
  rightArmAngle = 0,
  torsoColor = BRICK_PALETTE.red,
  legsColor = BRICK_PALETTE.blue,
  helmetColor = BRICK_PALETTE.white,
}) => {
  const torsoMat = useMemo(() => createAbsPlasticMaterial(torsoColor), [torsoColor]);
  const legsMat = useMemo(() => createAbsPlasticMaterial(legsColor), [legsColor]);
  const headMat = useMemo(() => createAbsPlasticMaterial(BRICK_PALETTE.yellow), []);
  const helmetMat = useMemo(() => createAbsPlasticMaterial(helmetColor), [helmetColor]);
  const darkMat = useMemo(() => createAbsPlasticMaterial(BRICK_PALETTE.black), []);

  return (
    <group position={position} rotation={rotation}>
      {/* HIPS / PELVIS */}
      <mesh position={[0, 1.2, 0]} material={legsMat} castShadow>
        <boxGeometry args={[1.5, 0.4, 0.9]} />
      </mesh>

      {/* LEFT LEG */}
      <group position={[-0.45, 1.0, 0]} rotation={[leftLegAngle, 0, 0]}>
        <mesh position={[0, -0.5, 0]} material={legsMat} castShadow>
          <boxGeometry args={[0.65, 1.0, 0.85]} />
        </mesh>
      </group>

      {/* RIGHT LEG */}
      <group position={[0.45, 1.0, 0]} rotation={[rightLegAngle, 0, 0]}>
        <mesh position={[0, -0.5, 0]} material={legsMat} castShadow>
          <boxGeometry args={[0.65, 1.0, 0.85]} />
        </mesh>
      </group>

      {/* TORSO */}
      <group position={[0, 1.4, 0]}>
        <mesh position={[0, 0.65, 0]} material={torsoMat} castShadow>
          <boxGeometry args={[1.6, 1.3, 0.95]} />
        </mesh>

        {/* LEFT ARM */}
        <group position={[-0.95, 1.15, 0]} rotation={[leftArmAngle, 0, 0.2]}>
          <mesh position={[0, -0.5, 0]} material={torsoMat} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 1.0, 16]} />
          </mesh>
          {/* Yellow Hand */}
          <mesh position={[0, -1.05, 0]} material={headMat} castShadow>
            <sphereGeometry args={[0.22, 16, 16]} />
          </mesh>
        </group>

        {/* RIGHT ARM */}
        <group position={[0.95, 1.15, 0]} rotation={[rightArmAngle, 0, -0.2]}>
          <mesh position={[0, -0.5, 0]} material={torsoMat} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 1.0, 16]} />
          </mesh>
          {/* Yellow Hand */}
          <mesh position={[0, -1.05, 0]} material={headMat} castShadow>
            <sphereGeometry args={[0.22, 16, 16]} />
          </mesh>
        </group>

        {/* HEAD */}
        <group position={[0, 1.5, 0]}>
          {/* Yellow Cylindrical Head */}
          <mesh position={[0, 0.35, 0]} material={headMat} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.7, 24]} />
          </mesh>
          {/* Eyes (printed black dots) */}
          <mesh position={[-0.14, 0.4, 0.42]} material={darkMat}>
            <sphereGeometry args={[0.045, 8, 8]} />
          </mesh>
          <mesh position={[0.14, 0.4, 0.42]} material={darkMat}>
            <sphereGeometry args={[0.045, 8, 8]} />
          </mesh>
          {/* Smile line */}
          <mesh position={[0, 0.28, 0.42]} material={darkMat}>
            <boxGeometry args={[0.16, 0.03, 0.02]} />
          </mesh>

          {/* HELMET / CAP */}
          <mesh position={[0, 0.72, 0]} material={helmetMat} castShadow>
            <cylinderGeometry args={[0.46, 0.48, 0.35, 24]} />
          </mesh>
          <mesh position={[0, 0.9, 0]} material={helmetMat} castShadow>
            <cylinderGeometry args={[0.24, 0.24, 0.18, 16]} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
