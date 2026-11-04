// TOONFORGE Atmosphere — high-contrast anime lighting with sharp shadow termination.

import React from "react";
import { TOON_PALETTE } from "../lib/palette";

export const ToonAtmosphere: React.FC = () => {
  return (
    <>
      {/* 1. Saturated Anime Ambient Sky Light */}
      <ambientLight color="#6ca8fe" intensity={1.3} />

      {/* 2. Hard Direct Key Sun (Produces crisp cel-shaded shadows) */}
      <directionalLight
        position={[8, 12, 10]}
        color="#ffffff"
        intensity={2.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* 3. Rim Backlight (Accentuates ink outlines and separates silhouette) */}
      <directionalLight position={[-6, -4, -10]} color={TOON_PALETTE.sakuraPink} intensity={1.5} />
    </>
  );
};
