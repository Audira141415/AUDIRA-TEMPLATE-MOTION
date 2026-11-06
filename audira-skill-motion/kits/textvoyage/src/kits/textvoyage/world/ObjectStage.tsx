// TEXTVOYAGE stage — a corridor of titanium monolith gates the camera flies through, toward giant
// block-type words that grow as the camera approaches. Gates recycle along z, so the flight never
// runs out of architecture (the earlier single gate passed the camera at ~2.7 s and left the frame empty).

import React from "react";
import { TEXTVOYAGE_PALETTE } from "../lib/palette";
import { MonolithType } from "./MonolithType";

const GATE_COUNT = 5;
const GATE_SPACING = 7;
const NEAR_Z = 5; // gates past this z wrap to the far end
const SPAN = GATE_COUNT * GATE_SPACING + 8;
const SPEED = 0.06; // world units per 60 fps film frame

const wrapZ = (z: number) => ((((z - NEAR_Z) % SPAN) + SPAN) % SPAN) + NEAR_Z - SPAN;

const Gate: React.FC<{ z: number }> = ({ z }) => (
  <group position={[0, 0, z]}>
    <mesh position={[-1.7, 0.2, 0]}>
      <boxGeometry args={[0.7, 4.2, 0.7]} />
      <meshStandardMaterial color={TEXTVOYAGE_PALETTE.monolithTitanium} metalness={0.8} roughness={0.3} />
    </mesh>
    <mesh position={[1.7, 0.2, 0]}>
      <boxGeometry args={[0.7, 4.2, 0.7]} />
      <meshStandardMaterial color={TEXTVOYAGE_PALETTE.monolithTitanium} metalness={0.8} roughness={0.3} />
    </mesh>
    <mesh position={[0, 2.45, 0]}>
      <boxGeometry args={[4.1, 0.4, 0.7]} />
      <meshStandardMaterial
        color={TEXTVOYAGE_PALETTE.coreAccentGold}
        emissive={TEXTVOYAGE_PALETTE.coreAccentGold}
        emissiveIntensity={0.15}
        metalness={0.9}
        roughness={0.2}
      />
    </mesh>
  </group>
);

export const MonolithGateway: React.FC<{ f: number; words?: [string, string] }> = ({
  f,
  words = ["BEYOND", "HORIZON"],
}) => {
  const shift = f * SPEED;
  // The words approach more slowly than the gates, so they stay ahead of the camera and grow.
  const wordZ = -30 + shift * 0.55;

  return (
    <group>
      {/* Polished floor that reflects the gates */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.9, -15]}>
        <planeGeometry args={[14, 60]} />
        <meshStandardMaterial color={TEXTVOYAGE_PALETTE.horizonMist} metalness={0.6} roughness={0.35} />
      </mesh>

      {/* Gates end in front of the words, so no lintel cuts through the type */}
      {Array.from({ length: GATE_COUNT }, (_, i) => wrapZ(-3 - i * GATE_SPACING + shift))
        .filter((z) => z > wordZ + 2.5)
        .map((z, i) => (
          <Gate key={i} z={z} />
        ))}

      {/* Giant block-type words */}
      <MonolithType
        text={words[0]}
        cell={0.135}
        depth={0.6}
        color={TEXTVOYAGE_PALETTE.volumetricLight}
        emissive={TEXTVOYAGE_PALETTE.volumetricLight}
        emissiveIntensity={0.25}
        metalness={0.3}
        roughness={0.4}
        position={[0, 2.4, wordZ]}
      />
      <MonolithType
        text={words[1]}
        cell={0.135}
        depth={0.6}
        color={TEXTVOYAGE_PALETTE.coreAccentGold}
        emissive={TEXTVOYAGE_PALETTE.coreAccentGold}
        emissiveIntensity={0.35}
        metalness={0.85}
        roughness={0.25}
        position={[0, 1.2, wordZ]}
      />
    </group>
  );
};
