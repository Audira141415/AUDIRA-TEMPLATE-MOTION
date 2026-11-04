// INKSTORY Atmosphere — Diffused paper-screen daylight & subtle mist lighting.

import React from "react";
import { INK_PALETTE } from "../lib/palette";

export const InkAtmosphere: React.FC = () => {
  return (
    <>
      {/* Warm Rice Paper Diffuse Ambient */}
      <ambientLight color={INK_PALETTE.silkIvory} intensity={1.5} />

      {/* Gentle Morning Key Light */}
      <directionalLight
        position={[3, 8, 5]}
        color="#fff9ee"
        intensity={1.8}
        castShadow
      />

      {/* Soft Fill from Below (Diffused paper reflection) */}
      <directionalLight position={[-3, -4, 2]} color={INK_PALETTE.agedXuanPaper} intensity={0.6} />

      {/* Cinnabar Stamp Spot Highlight */}
      <pointLight position={[2.0, 1.6, 2.0]} color="#ffeedd" intensity={1.2} distance={8} />
    </>
  );
};
