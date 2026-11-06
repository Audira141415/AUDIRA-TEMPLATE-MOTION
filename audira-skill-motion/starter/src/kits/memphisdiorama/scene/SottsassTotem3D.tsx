import React from "react";
import { computeMemphisDioramaState } from "../core/motion";
import { MEMPHISDIORAMA_PALETTE } from "../lib/palette";

export const SottsassTotem3D: React.FC<{ f: number }> = ({ f }) => {
  const state = computeMemphisDioramaState(f);
  return (
    <group>
      {/* Canary Yellow Stepped Pyramid Pedestal */}
      <mesh position={[-0.85, 0.35, 0]}>
        <boxGeometry args={[1.1, 0.7, 1.1]} />
        <meshStandardMaterial color={MEMPHISDIORAMA_PALETTE.canaryYellow} roughness={0.88} />
      </mesh>

      {/* Coral Pink Postmodern Archway */}
      <group position={[0.55, 0.75, -0.15]} rotation={[0, 0, state.archRockZ]}>
        <mesh position={[-0.45, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1.5, 24]} />
          <meshStandardMaterial color={MEMPHISDIORAMA_PALETTE.coralPink} roughness={0.88} />
        </mesh>
        <mesh position={[0.45, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1.5, 24]} />
          <meshStandardMaterial color={MEMPHISDIORAMA_PALETTE.coralPink} roughness={0.88} />
        </mesh>
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[1.35, 0.32, 0.45]} />
          <meshStandardMaterial color={MEMPHISDIORAMA_PALETTE.indigoInk} roughness={0.88} />
        </mesh>
      </group>

      {/* Mint Green Tilted Ring & Bouncing Sky-Blue Sphere */}
      <mesh position={[-0.85, 1.15, 0]} rotation={[0.3, state.totemSpin, 0.2]}>
        <torusGeometry args={[0.42, 0.11, 20, 48]} />
        <meshStandardMaterial color={MEMPHISDIORAMA_PALETTE.mintGreen} roughness={0.85} />
      </mesh>

      <mesh position={[0.55, 0.35 + state.sphereBounceY, 0.45]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color={MEMPHISDIORAMA_PALETTE.skyBlue} roughness={0.85} />
      </mesh>
    </group>
  );
};