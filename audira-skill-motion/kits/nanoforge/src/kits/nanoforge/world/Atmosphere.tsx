// NANOFORGE Atmosphere — Microscopic fluid immersion lighting with fluorescent rim kickers.

import React from "react";
import { NANO_PALETTE } from "../lib/palette";

export const NanoAtmosphere: React.FC = () => {
  return (
    <>
      {/* Deep Cytoplasm Blue Ambient Fill */}
      <ambientLight color={NANO_PALETTE.fluidAmbient} intensity={1.4} />

      {/* Main Overhead Illuminator (Electron Microscope Beam) */}
      <directionalLight
        position={[4, 10, 6]}
        color="#c7d2fe"
        intensity={2.4}
        castShadow
      />

      {/* Primary Bioluminescent Point Light (Cyan) */}
      <pointLight position={[-5, 3, -3]} color={NANO_PALETTE.thymineCyan} intensity={3.0} distance={16} />

      {/* Secondary Fluorescent Point Light (Magenta) */}
      <pointLight position={[5, -2, 2]} color={NANO_PALETTE.guanineRuby} intensity={2.8} distance={16} />

      {/* Golden Nucleotide Core Kicker */}
      <pointLight position={[0, 0, -2]} color={NANO_PALETTE.adenineGold} intensity={1.5} distance={10} />
    </>
  );
};

