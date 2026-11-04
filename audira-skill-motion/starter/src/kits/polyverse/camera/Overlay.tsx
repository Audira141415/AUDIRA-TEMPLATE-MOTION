// POLYVERSE 2D Minimalist Screen Overlay — clean Swiss typography and spatial coordinates.

import React from "react";
import { AbsoluteFill } from "remotion";
import { POLY_PALETTE } from "../lib/palette";

interface PolyOverlayProps {
  f: number;
  islandName?: string;
  coords?: string;
}

export const PolyOverlay: React.FC<PolyOverlayProps> = ({
  f,
  islandName = "AETHEL // ISLE OF PRISMS",
  coords = "LOC: 45°18'N 12°26'E // ALT: 1,420M",
}) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "'Space Grotesk', -apple-system, sans-serif",
        color: "#ffffff",
        boxSizing: "border-box",
        justifyContent: "space-between",
        padding: "45px 35px",
      }}
    >
      {/* 1. Header Minimalist Typo */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "700", letterSpacing: "2.5px", color: "#ffffff" }}>
            {islandName}
          </div>
          <div style={{ fontSize: "11px", color: POLY_PALETTE.sunWarm, letterSpacing: "1.5px", marginTop: "4px" }}>
            {coords}
          </div>
        </div>

        <div style={{ fontSize: "11px", letterSpacing: "2px", color: POLY_PALETTE.crystalMonolith, fontWeight: "600" }}>
          POLYVERSE // 012
        </div>
      </div>

      {/* 2. Footer Elevation & Time Indicator */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
        <div style={{ fontSize: "11px", color: "#a0aec0", letterSpacing: "1px" }}>
          DIORAMA ARCHITECTURE // FACETED LOW-POLY
        </div>

        <div style={{ fontSize: "11px", color: POLY_PALETTE.sunWarm, letterSpacing: "1.5px" }}>
          DAWN LIGHTING // 60 FPS
        </div>
      </div>
    </AbsoluteFill>
  );
};
