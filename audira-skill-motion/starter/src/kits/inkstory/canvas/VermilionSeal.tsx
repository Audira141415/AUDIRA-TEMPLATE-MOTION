// INKSTORY Vermilion Seal — Traditional red cinnabar artist chop mark with rhythmic stamp snap.

import React from "react";
import { INK_PALETTE } from "../lib/palette";
import { clamp, remap, seg } from "../core/motion";

interface VermilionSealProps {
  f: number;
  stampFrame?: number;
  position?: [number, number, number];
}

export const VermilionSeal: React.FC<VermilionSealProps> = ({
  f,
  stampFrame = 220,
  position = [2.2, 1.8, 0],
}) => {
  if (f < stampFrame) return null;

  // Stamping physics: swift drop into firm contact with subtle ink bleed
  const stampProgress = seg(f, stampFrame, stampFrame + 15);
  const scale = clamp(remap(f, stampFrame, stampFrame + 8, 1.6, 1.0), 1.0, 1.6);
  const opacity = stampProgress;

  return (
    <group position={position} scale={scale}>
      {/* Outer Square Seal Border */}
      <mesh>
        <boxGeometry args={[0.9, 0.9, 0.04]} />
        <meshStandardMaterial
          color={INK_PALETTE.vermilionCinnabar}
          roughness={0.7}
          metalness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Inner Inverted Intaglio Relief Cross (Representing Traditional Kanji Seal) */}
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[0.65, 0.12, 0.02]} />
        <meshStandardMaterial color={INK_PALETTE.agedXuanPaper} roughness={0.9} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[0.12, 0.65, 0.02]} />
        <meshStandardMaterial color={INK_PALETTE.agedXuanPaper} roughness={0.9} transparent opacity={opacity} />
      </mesh>
    </group>
  );
};
