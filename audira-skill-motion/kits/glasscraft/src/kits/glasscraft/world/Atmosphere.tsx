// GLASSCRAFT Atmosphere — luxury spatial studio lighting with chromatic rim reflections.

import React from "react";
import { GLASS_PALETTE } from "../lib/palette";

export const GlassAtmosphere: React.FC = () => {
  return (
    <>
      {/* 1. Soft Ambient Fill */}
      <ambientLight color={GLASS_PALETTE.ambientStudio} intensity={1.2} />

      {/* 2. Primary High-Key Softbox (Produces pristine transmission refractions) */}
      <directionalLight
        position={[6, 8, 8]}
        color="#ffffff"
        intensity={2.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* 3. Left Chromatic Rim Light: Prism Cyan */}
      <pointLight position={[-6, 3, -4]} color={GLASS_PALETTE.prismCyan} intensity={2.5} distance={18} />

      {/* 4. Right Chromatic Rim Light: Prism Magenta */}
      <pointLight position={[6, -2, -3]} color={GLASS_PALETTE.prismMagenta} intensity={2.5} distance={18} />
    </>
  );
};

