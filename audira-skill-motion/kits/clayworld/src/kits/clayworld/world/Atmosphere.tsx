// CLAYWORLD Atmosphere — warm tabletop studio lighting with soft contact shadows.

import React from "react";
import { CLAY_PALETTE } from "../lib/palette";

export const ClayAtmosphere: React.FC = () => {
  return (
    <>
      {/* 1. Ambient Warm Room Fill */}
      <ambientLight color="#fff7ed" intensity={0.9} />

      {/* 2. Primary Key Softbox (Directional sunlight through a diffuser) */}
      <directionalLight
        position={[6, 9, 6]}
        color="#fff1db"
        intensity={2.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* 3. Tabletop Reflector Bounce Light (Soft peach/clay bounce from the front) */}
      <pointLight position={[-4, 2, 4]} color="#ffe0cb" intensity={1.1} distance={15} />

      {/* 4. Warm Rim Backlight (Separates clay character from dark studio background) */}
      <pointLight position={[0, 4, -5]} color={CLAY_PALETTE.warmRimLight} intensity={1.6} distance={12} />
    </>
  );
};

