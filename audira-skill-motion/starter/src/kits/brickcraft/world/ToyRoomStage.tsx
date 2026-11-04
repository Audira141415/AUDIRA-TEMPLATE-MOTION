import React, { useMemo } from "react";
import * as THREE from "three";
import { StudBrick } from "../brick/StudBrick";
import { ToyCharacter } from "../brick/ToyCharacter";
import { BRICK_PALETTE } from "../lib/palette";
import { createBaseplateMaterial, createWoodTableMaterial } from "../lib/materials";
import { snapOvershoot } from "../core/motion";

interface ToyRoomStageProps {
  snapProgress?: number;
  characterX?: number;
  characterZ?: number;
  leftLegAngle?: number;
  rightLegAngle?: number;
  leftArmAngle?: number;
  rightArmAngle?: number;
  bodyBob?: number;
}

export const ToyRoomStage: React.FC<ToyRoomStageProps> = ({
  snapProgress = 1.0,
  characterX = 0,
  characterZ = 0,
  leftLegAngle = 0,
  rightLegAngle = 0,
  leftArmAngle = 0,
  rightArmAngle = 0,
  bodyBob = 0,
}) => {
  const tableMat = useMemo(() => createWoodTableMaterial(BRICK_PALETTE.woodTable), []);
  const baseplateMat = useMemo(() => createBaseplateMaterial(BRICK_PALETTE.baseplateGreen), []);
  const ceramicMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#e9ecef", roughness: 0.2, metalness: 0.05 }),
    []
  );

  const snapA = snapOvershoot(snapProgress);
  const snapB = snapOvershoot(Math.max(0, snapProgress - 0.2) / 0.8);
  const snapC = snapOvershoot(Math.max(0, snapProgress - 0.4) / 0.6);

  return (
    <group>
      {/* 1. Wood Desk Surface */}
      <mesh position={[0, -0.4, 0]} material={tableMat} receiveShadow>
        <boxGeometry args={[24, 0.8, 24]} />
      </mesh>

      {/* 2. Toy Green Stud Baseplate */}
      <mesh position={[0, 0.1, 0]} material={baseplateMat} receiveShadow>
        <boxGeometry args={[14, 0.2, 14]} />
      </mesh>

      {/* 3. Pre-built Toy House / Structure on the table */}
      <group position={[-2.5, 0.2, -1.5]}>
        {/* Wall layers */}
        <StudBrick widthStuds={4} lengthStuds={2} color={BRICK_PALETTE.red} position={[0, 0.6, 0]} />
        <StudBrick widthStuds={2} lengthStuds={4} color={BRICK_PALETTE.blue} position={[2, 0.6, 1]} />
        <StudBrick widthStuds={4} lengthStuds={2} color={BRICK_PALETTE.yellow} position={[0, 1.8, 0]} />
        <StudBrick widthStuds={2} lengthStuds={4} color={BRICK_PALETTE.white} position={[2, 1.8, 1]} />

        {/* Roof Bricks (Yellow & Red) */}
        <StudBrick widthStuds={4} lengthStuds={4} isPlate color={BRICK_PALETTE.red} position={[1, 2.6, 1]} />
        <StudBrick widthStuds={2} lengthStuds={2} color={BRICK_PALETTE.yellow} position={[1, 3.4, 1]} />
      </group>

      {/* 4. Dynamic Assembling Bricks (Snapping in via animation) */}
      <group position={[2.5, 0.2, -1.0]}>
        {/* Foundation brick already there */}
        <StudBrick widthStuds={2} lengthStuds={4} color={BRICK_PALETTE.darkGrey} position={[0, 0.6, 0]} />

        {/* Brick A snapping in */}
        <StudBrick
          widthStuds={2}
          lengthStuds={2}
          color={BRICK_PALETTE.red}
          position={[0, 1.8 + snapA.yOffset, -1]}
          scale={[1, snapA.scaleY, 1]}
        />

        {/* Brick B snapping in */}
        <StudBrick
          widthStuds={2}
          lengthStuds={2}
          color={BRICK_PALETTE.yellow}
          position={[0, 1.8 + snapB.yOffset, 1]}
          scale={[1, snapB.scaleY, 1]}
        />

        {/* Top Arch Brick C snapping in */}
        <StudBrick
          widthStuds={2}
          lengthStuds={4}
          color={BRICK_PALETTE.blue}
          position={[0, 3.0 + snapC.yOffset, 0]}
          scale={[1, snapC.scaleY, 1]}
        />
      </group>

      {/* 5. Walking Toy Character */}
      <ToyCharacter
        position={[characterX, 0.2 + bodyBob, characterZ]}
        rotation={[0, Math.PI * 0.15, 0]}
        leftLegAngle={leftLegAngle}
        rightLegAngle={rightLegAngle}
        leftArmAngle={leftArmAngle}
        rightArmAngle={rightArmAngle}
      />

      {/* 6. Macro Depth Props (Background blur illusion) */}
      {/* Ceramic Coffee Mug behind */}
      <group position={[5.5, 2.0, -5.5]}>
        <mesh material={ceramicMat} castShadow>
          <cylinderGeometry args={[1.5, 1.3, 3.5, 32]} />
        </mesh>
      </group>
      {/* Notepad stack */}
      <mesh position={[-5.5, 0.5, -4.5]} material={ceramicMat} castShadow>
        <boxGeometry args={[4.5, 1.0, 6.0]} />
      </mesh>
    </group>
  );
};
