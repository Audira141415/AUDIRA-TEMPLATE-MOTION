// POLYVERSE Atmosphere — pastel sunrise/sunset lighting tailored for low-poly facet rendering.

import React from "react";
import { POLY_PALETTE } from "../lib/palette";

export const PolyAtmosphere: React.FC<{ f: number }> = ({ f }) => {
  return (
    <>
      {/* 1. Ambient Pastel Fill (Gentle purple-coral fill) */}
      <ambientLight color="#f3e8ff" intensity={1.1} />

      {/* 2. Warm Directional Sunlight (Casts crisp faceted shadows) */}
      <directionalLight
        position={[8, 12, 6]}
        color={POLY_PALETTE.sunWarm}
        intensity={2.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
      />

      {/* 3. Soft Opposite Horizon Bounce (Cool Teal / Sky Blue) */}
      <pointLight position={[-7, 4, -6]} color={POLY_PALETTE.waterSurface} intensity={1.2} distance={20} />

      {/* 4. Bottom Void Glow (Soft Lavender) */}
      <pointLight position={[0, -5, 0]} color={POLY_PALETTE.crystalMonolith} intensity={1.0} distance={15} />
    </>
  );
};

