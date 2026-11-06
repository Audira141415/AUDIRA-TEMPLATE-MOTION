import React from "react";
import { AbsoluteFill } from "remotion";
import { RETROWAVE_PALETTE } from "../lib/palette";

export const RetrowaveOverlay: React.FC<{ f: number }> = ({ f }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none", padding: 50, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ display: "flex", justifyContent: "space-between", color: RETROWAVE_PALETTE.phosphorGreen, fontFamily: "monospace" }}>
        <span>PLAY ▶ 00:24:19</span>
        <span>SP 1986 // HI-FI</span>
      </div>
      <div>
        <h1 style={{ margin: 0, fontSize: 44, color: RETROWAVE_PALETTE.neonMagenta, fontFamily: "sans-serif", fontStyle: "italic", fontWeight: 900, textShadow: "0 0 20px #FF007F" }}>
          RETROWAVE 1986
        </h1>
        <p style={{ margin: "6px 0 0 0", color: RETROWAVE_PALETTE.synthCyan, fontFamily: "monospace", fontSize: 16 }}>
          Neon grid berkecepatan tinggi, scanline CRT analog, dan atmosfer sintetis nostalgia era 80-an.
        </p>
      </div>
    </AbsoluteFill>
  );
};
