// INKSTORY Ink Mountain Diorama — 3D layered Shan Shui peaks, swaying ink bamboo & mist layers.

import React from "react";
import { INK_PALETTE } from "../lib/palette";
import { InkBrushStroke } from "../canvas/InkBrushStroke";
import { VermilionSeal } from "../canvas/VermilionSeal";
import { mistBillow } from "../core/motion";

interface InkMountainDioramaProps {
  f: number;
}

export const InkMountainDiorama: React.FC<InkMountainDioramaProps> = ({ f }) => {
  const mist1 = mistBillow(f, 0.02, 0.25, 0);
  const mist2 = mistBillow(f, 0.015, 0.35, 2);
  const bambooSway = Math.sin(f * 0.03) * 0.08;

  return (
    <group>
      {/* 1. Aged Xuan Paper Backdrop Canvas */}
      <mesh position={[0, 0, -4]}>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial color={INK_PALETTE.agedXuanPaper} roughness={0.98} metalness={0} />
      </mesh>

      {/* 2. Distant Shan Shui Mountains (Faint Diluted Indigo Wash) */}
      <group position={[0, -0.6, -2.5]}>
        <mesh position={[-2.4, 0.8, 0]}>
          <coneGeometry args={[3.2, 5.0, 4]} />
          <meshStandardMaterial color={INK_PALETTE.mountainIndigo} transparent opacity={0.35} roughness={0.9} />
        </mesh>
        <mesh position={[2.8, 0.4, -0.5]}>
          <coneGeometry args={[2.8, 4.4, 4]} />
          <meshStandardMaterial color={INK_PALETTE.mountainIndigo} transparent opacity={0.28} roughness={0.9} />
        </mesh>
      </group>

      {/* 3. Midground Misty Cloud Layers */}
      <mesh position={[mist1, -0.8, -1.5]}>
        <planeGeometry args={[14, 2.2]} />
        <meshStandardMaterial color={INK_PALETTE.mistPaleWash} transparent opacity={0.65} roughness={0.95} />
      </mesh>
      <mesh position={[-mist2, -1.8, -0.8]}>
        <planeGeometry args={[16, 2.8]} />
        <meshStandardMaterial color={INK_PALETTE.agedXuanPaper} transparent opacity={0.8} roughness={0.95} />
      </mesh>

      {/* 4. Foreground Mountain Ridge (Dense Ink) */}
      <group position={[-1.2, -1.6, -0.5]}>
        <mesh>
          <coneGeometry args={[2.2, 3.6, 5]} />
          <meshStandardMaterial color={INK_PALETTE.denseInk} roughness={0.9} />
        </mesh>
      </group>

      {/* 5. Delicate Ink Bamboo Stalks */}
      <group position={[-2.5, -2.4, 0.8]} rotation={[0, 0, bambooSway]}>
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 3.2, 12]} />
          <meshStandardMaterial color={INK_PALETTE.bambooMoss} roughness={0.8} />
        </mesh>
        {/* Bamboo Node Leaves */}
        <mesh position={[0.25, 2.2, 0]} rotation={[0, 0, -0.6]}>
          <boxGeometry args={[0.6, 0.08, 0.02]} />
          <meshStandardMaterial color={INK_PALETTE.bambooMoss} roughness={0.8} />
        </mesh>
        <mesh position={[-0.25, 1.8, 0]} rotation={[0, 0, 0.7]}>
          <boxGeometry args={[0.55, 0.07, 0.02]} />
          <meshStandardMaterial color={INK_PALETTE.bambooMoss} roughness={0.8} />
        </mesh>
      </group>

      {/* 6. Dynamic Foreground Calligraphic Gesture */}
      <InkBrushStroke f={f} startFrame={30} endFrame={180} />

      {/* 7. Red Cinnabar Seal Stamp */}
      <VermilionSeal f={f} stampFrame={200} position={[2.0, 1.6, 0.2]} />
    </group>
  );
};
