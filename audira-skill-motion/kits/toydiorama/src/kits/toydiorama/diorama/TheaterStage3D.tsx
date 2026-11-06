import React from "react";
import * as THREE from "three";
import { TOYDIORAMA_PALETTE } from "../lib/palette";
import { computeToyDioramaState } from "../core/motion";

export const TheaterStage3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeToyDioramaState(f);

  // Planks configuration: 7 wooden planks for the floor
  const plankWidth = 0.58;
  const plankLength = 3.6;
  const plankDepth = 0.15;
  const planks = [-3, -2, -1, 0, 1, 2, 3];

  // Footlights along the stage front apron
  const footlightXPositions = [-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8];

  return (
    <group>
      {/* 1. Deep Theatrical Background Wall */}
      <mesh position={[0, 2.5, -2.6]}>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial
          color={TOYDIORAMA_PALETTE.stageBackdrop}
          roughness={0.95}
          metalness={0.0}
        />
      </mesh>

      {/* 2. Wooden Stage Platform */}
      <group position={[0, 0, 0]}>
        {/* Floor Planks */}
        {planks.map((idx) => (
          <mesh
            key={idx}
            position={[idx * (plankWidth + 0.02), -0.075, 0]}
            receiveShadow
          >
            <boxGeometry args={[plankWidth, plankDepth, plankLength]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? TOYDIORAMA_PALETTE.stageFloor : TOYDIORAMA_PALETTE.stageFloorLight}
              roughness={0.68}
              metalness={0.04}
            />
          </mesh>
        ))}

        {/* Stage Front Apron Fascia */}
        <mesh position={[0, -0.35, 1.82]}>
          <boxGeometry args={[4.4, 0.55, 0.08]} />
          <meshStandardMaterial
            color={TOYDIORAMA_PALETTE.stageTrim}
            roughness={0.75}
            metalness={0.02}
          />
        </mesh>
      </group>

      {/* 3. Stage Footlights (Golden Glowing Bulbs with soft point lights) */}
      <group position={[0, 0.05, 1.7]}>
        {footlightXPositions.map((posX, i) => (
          <group key={i} position={[posX, 0, 0]}>
            {/* Wooden footlight socket base */}
            <mesh position={[0, -0.02, 0]}>
              <cylinderGeometry args={[0.07, 0.09, 0.06, 12]} />
              <meshStandardMaterial color={TOYDIORAMA_PALETTE.stageTrim} roughness={0.6} />
            </mesh>
            {/* Frosted warm bulb */}
            <mesh position={[0, 0.04, 0]}>
              <sphereGeometry args={[0.055, 16, 16]} />
              <meshStandardMaterial
                color={TOYDIORAMA_PALETTE.footlights}
                emissive={TOYDIORAMA_PALETTE.footlights}
                emissiveIntensity={1.2}
                roughness={0.2}
              />
            </mesh>
            {/* Subtle local pointlight on stage rim */}
            <pointLight
              color={TOYDIORAMA_PALETTE.footlights}
              intensity={0.35}
              distance={1.2}
              decay={2}
              position={[0, 0.08, -0.1]}
            />
          </group>
        ))}
      </group>

      {/* 4. Tiered Layered Scenery Flats (Held by Wooden Dowels) */}
      {/* Background Flat: Distant Pine Mountains Cutout */}
      <group position={[0, 1.6, -1.8]}>
        {/* Wooden Dowel support rod */}
        <mesh position={[0, -0.8, -0.02]}>
          <cylinderGeometry args={[0.035, 0.035, 2.2, 8]} />
          <meshStandardMaterial color={TOYDIORAMA_PALETTE.stageDowel} roughness={0.7} />
        </mesh>
        {/* Mountain Flat Shape */}
        <mesh receiveShadow>
          <coneGeometry args={[2.2, 2.6, 4]} />
          <meshStandardMaterial
            color={TOYDIORAMA_PALETTE.flatMountainFar}
            roughness={0.88}
            metalness={0.02}
          />
        </mesh>
      </group>

      {/* Middle Flat 1: Rolling Green Hills Cutout */}
      <group position={[1.4, 0.9, -1.2]}>
        <mesh position={[0, -0.45, -0.02]}>
          <cylinderGeometry args={[0.035, 0.035, 1.5, 8]} />
          <meshStandardMaterial color={TOYDIORAMA_PALETTE.stageDowel} roughness={0.7} />
        </mesh>
        <mesh receiveShadow>
          <sphereGeometry args={[1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial
            color={TOYDIORAMA_PALETTE.flatMountainNear}
            roughness={0.82}
            metalness={0.03}
          />
        </mesh>
      </group>

      {/* Middle Flat 2: Ochre Sun Disc Cutout */}
      <group position={[-1.6, 2.6, -1.5]}>
        <mesh position={[0, -1.2, -0.02]}>
          <cylinderGeometry args={[0.025, 0.025, 2.5, 8]} />
          <meshStandardMaterial color={TOYDIORAMA_PALETTE.stageDowel} roughness={0.7} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.55, 0.55, 0.04, 24]} />
          <meshStandardMaterial
            color={TOYDIORAMA_PALETTE.flatSun}
            emissive={TOYDIORAMA_PALETTE.flatSun}
            emissiveIntensity={0.3}
            roughness={0.7}
          />
        </mesh>
      </group>

      {/* Foreground Scenery: Soft Clay Cloud on wire drifting gently */}
      <group position={[-1.1 + state.cloudDriftX, 2.8, -0.8]}>
        <mesh>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color={TOYDIORAMA_PALETTE.flatCloud} roughness={0.85} />
        </mesh>
        <mesh position={[0.3, -0.05, 0]}>
          <sphereGeometry args={[0.26, 16, 16]} />
          <meshStandardMaterial color={TOYDIORAMA_PALETTE.flatCloud} roughness={0.85} />
        </mesh>
        <mesh position={[-0.28, -0.08, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color={TOYDIORAMA_PALETTE.flatCloud} roughness={0.85} />
        </mesh>
      </group>

      {/* 5. Theatrical Velvet Side Teaser Drapes (Left and Right framing) */}
      <mesh position={[-2.4, 2.2, 0.6]}>
        <boxGeometry args={[0.6, 4.4, 0.3]} />
        <meshStandardMaterial
          color={TOYDIORAMA_PALETTE.curtainVelvet}
          roughness={0.92}
          metalness={0.0}
        />
      </mesh>
      <mesh position={[2.4, 2.2, 0.6]}>
        <boxGeometry args={[0.6, 4.4, 0.3]} />
        <meshStandardMaterial
          color={TOYDIORAMA_PALETTE.curtainVelvet}
          roughness={0.92}
          metalness={0.0}
        />
      </mesh>
    </group>
  );
};
