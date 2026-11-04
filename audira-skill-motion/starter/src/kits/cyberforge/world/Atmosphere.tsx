// CYBERFORGE Atmosphere — high-contrast dark space lighting with cyber neon accents.

import React from "react";
import { CYBER_PALETTE } from "../lib/palette";

export const CyberAtmosphere: React.FC<{ f: number }> = ({ f }) => {
  const pulse = Math.sin(f * 0.1) * 0.2 + 0.8;

  return (
    <>
      {/* Void Ambient baseline */}
      <ambientLight color="#050a18" intensity={0.6} />

      {/* Primary Key Light: Cyan */}
      <pointLight
        position={[4, 6, 5]}
        color={CYBER_PALETTE.cyan}
        intensity={2.8 * pulse}
        distance={25}
        decay={2}
      />

      {/* Secondary Rim Backlight: Electric Violet */}
      <pointLight
        position={[-5, -2, -6]}
        color={CYBER_PALETTE.electricViolet}
        intensity={3.2}
        distance={25}
        decay={2}
      />

      {/* Bottom Under-Glow: Matrix Lime */}
      <pointLight
        position={[0, -2.5, 0]}
        color={CYBER_PALETTE.matrixLime}
        intensity={1.4}
        distance={10}
        decay={2}
      />
    </>
  );
};
