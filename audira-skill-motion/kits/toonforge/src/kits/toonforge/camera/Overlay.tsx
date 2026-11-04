// TOONFORGE 2D Manga Action Overlay — comic letterboxing, action callouts, and dramatic Japanese anime title typography.

import React from "react";
import { AbsoluteFill } from "remotion";
import { TOON_PALETTE } from "../lib/palette";

interface ToonOverlayProps {
  f: number;
  actionText?: string;
  episodeTitle?: string;
}

export const ToonOverlay: React.FC<ToonOverlayProps> = ({
  f,
  actionText = "// HYPER DRIVE ENGAGED //",
  episodeTitle = "PROJECT: VALKYRIE // EP. 01",
}) => {
  const isActionBurst = f >= 160 && f <= 280;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "'Space Grotesk', -apple-system, sans-serif",
        boxSizing: "border-box",
        justifyContent: "space-between",
        padding: "45px 35px",
      }}
    >
      {/* 1. Top Comic Letterbox Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", zIndex: 2 }}>
        <div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "900",
              letterSpacing: "3px",
              color: TOON_PALETTE.comicWhite,
              backgroundColor: TOON_PALETTE.inkBlack,
              padding: "4px 10px",
              display: "inline-block",
              boxShadow: "3px 3px 0px " + TOON_PALETTE.crimsonImpact,
            }}
          >
            {episodeTitle}
          </div>
          <div style={{ fontSize: "11px", color: TOON_PALETTE.mechaAccent, fontWeight: "700", marginTop: "6px" }}>
            CEL-SHADED ANIME // 60 FPS
          </div>
        </div>

        <div
          style={{
            fontSize: "12px",
            fontWeight: "900",
            letterSpacing: "2px",
            color: TOON_PALETTE.sakuraPink,
            backgroundColor: TOON_PALETTE.inkBlack,
            padding: "4px 8px",
          }}
        >
          ACT. 01
        </div>
      </div>

      {/* 2. Action Burst Manga Sound Effect Banner (Flashing during boost phase) */}
      {isActionBurst && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(-4deg)",
            fontSize: "24px",
            fontWeight: "900",
            letterSpacing: "4px",
            color: TOON_PALETTE.comicWhite,
            backgroundColor: TOON_PALETTE.crimsonImpact,
            padding: "8px 24px",
            border: `3px solid ${TOON_PALETTE.inkBlack}`,
            boxShadow: `6px 6px 0px ${TOON_PALETTE.inkBlack}`,
            zIndex: 10,
          }}
        >
          {actionText}
        </div>
      )}

      {/* 3. Bottom Comic Framing Strip */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", zIndex: 2 }}>
        <div style={{ fontSize: "11px", fontWeight: "700", color: TOON_PALETTE.comicWhite, letterSpacing: "1.5px" }}>
          THRUSTER OUTPUT: 100% // MAXIMUM OVERDRIVE
        </div>

        <div style={{ fontSize: "11px", fontWeight: "900", color: TOON_PALETTE.skyCyan, letterSpacing: "2px" }}>
          TOONFORGE // 013
        </div>
      </div>
    </AbsoluteFill>
  );
};

