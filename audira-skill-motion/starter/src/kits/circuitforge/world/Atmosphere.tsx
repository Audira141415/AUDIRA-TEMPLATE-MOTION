// CIRCUITFORGE Atmosphere — Macro studio softbox illumination & gold pad specular kickers.

import React from "react";
import { CIRCUIT_PALETTE } from "../lib/palette";

export const CircuitAtmosphere: React.FC = () => {
  return (
    <>
      {/* Neutral Macro Ambient Fill */}
      <ambientLight color="#0f172a" intensity={0.9} />

      {/* Main Overhead Softbox (Clean specular band across silicon die) */}
      <directionalLight
        position={[4, 9, 5]}
        color="#ffffff"
        intensity={2.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Gold Pad Specular Kicker Light */}
      <pointLight position={[-4, 2, -4]} color="#ffd700" intensity={1.8} distance={12} />

      {/* Amber Current Glow Accent Light */}
      <pointLight position={[-2, 1, 0]} color={CIRCUIT_PALETTE.electronAmber} intensity={2.0} distance={8} />
    </>
  );
};
