// CLAYWORLD 2D Overlay — subtle warm vignette and tactile stop-motion title card.

import React from "react";
import { AbsoluteFill } from "remotion";
import { CLAY_PALETTE } from "../lib/palette";

interface ClayOverlayProps {
  f: number;
  filmTitle?: string;
  creatorTag?: string;
}

export const ClayOverlay: React.FC<ClayOverlayProps> = ({
  f,
  filmTitle = "THE LITTLE CLAY CRITTER",
  creatorTag = "CLAYWORLD STOP-MOTION // 15 FPS CADENCE",
}) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        boxSizing: "border-box",
        justifyContent: "space-between",
        padding: "45px 35px",
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      {/* 1. Subtle Radial Tabletop Vignette */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at center, transparent 55%, rgba(36, 31, 28, 0.45) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* 2. Top Title Card */}
      <div style={{ zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              letterSpacing: "2px",
              color: CLAY_PALETTE.clayCream,
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            {filmTitle}
          </div>
          <div style={{ fontSize: "11px", color: CLAY_PALETTE.mustard, marginTop: "4px" }}>
            {creatorTag}
          </div>
        </div>

        <div style={{ fontSize: "11px", color: CLAY_PALETTE.clayCream, opacity: 0.7 }}>
          FPS: 15 / 60
        </div>
      </div>

      {/* 3. Bottom Subtle Handcrafted Frame Border */}
      <div style={{ zIndex: 2, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            fontSize: "10px",
            letterSpacing: "3px",
            color: CLAY_PALETTE.tabletopBoard,
            opacity: 0.6,
          }}
        >
          ● HANDCRAFTED TACTILE STOP-MOTION ●
        </div>
      </div>
    </AbsoluteFill>
  );
};

