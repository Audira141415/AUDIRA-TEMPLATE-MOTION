import React, { useMemo } from "react";
import * as THREE from "three";
import { createAbsPlasticMaterial } from "../lib/materials";

interface StudBrickProps {
  widthStuds?: number; // X axis
  lengthStuds?: number; // Z axis
  isPlate?: boolean; // plate is 1/3 brick height (0.4 vs 1.2)
  color: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
}

export const StudBrick: React.FC<StudBrickProps> = ({
  widthStuds = 2,
  lengthStuds = 4,
  isPlate = false,
  color,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const height = isPlate ? 0.4 : 1.2;
  const studRadius = 0.24;
  const studHeight = 0.18;
  const studPitch = 1.0;

  const bodyWidth = widthStuds * studPitch;
  const bodyLength = lengthStuds * studPitch;

  const material = useMemo(() => createAbsPlasticMaterial(color), [color]);

  // Generate stud positions
  const studPositions = useMemo(() => {
    const coords: [number, number, number][] = [];
    const startX = -((widthStuds - 1) * studPitch) / 2;
    const startZ = -((lengthStuds - 1) * studPitch) / 2;

    for (let x = 0; x < widthStuds; x++) {
      for (let z = 0; z < lengthStuds; z++) {
        coords.push([startX + x * studPitch, height / 2 + studHeight / 2, startZ + z * studPitch]);
      }
    }
    return coords;
  }, [widthStuds, lengthStuds, height, studPitch, studHeight]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Brick Main Box Body */}
      <mesh material={material} castShadow receiveShadow>
        <boxGeometry args={[bodyWidth - 0.04, height, bodyLength - 0.04]} />
      </mesh>

      {/* Top Cylindrical Studs */}
      {studPositions.map(([sx, sy, sz], i) => (
        <mesh key={i} position={[sx, sy, sz]} material={material} castShadow receiveShadow>
          <cylinderGeometry args={[studRadius, studRadius, studHeight, 20]} />
        </mesh>
      ))}
    </group>
  );
};

