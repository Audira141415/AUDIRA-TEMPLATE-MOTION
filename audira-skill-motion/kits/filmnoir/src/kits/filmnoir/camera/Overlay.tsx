import React from "react";
import { FILMNOIR_PALETTE } from "../lib/palette";

export const FilmNoirOverlay: React.FC<{ f: number }> = ({ f }) => {
  const opacity = Math.min(1, f / 35);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "54px 44px",
        fontFamily: "'Courier New', Courier, monospace",
        color: "#E2E8F0",
      }}
    >
      {/* Top Detective Case File Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          opacity,
        }}
      >
        <div>
          <div
            style={{
              fontSize: "13px",
              letterSpacing: "4px",
              color: FILMNOIR_PALETTE.streetLightTungsten,
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            ● CASE FILE // 1947
          </div>
          <div
            style={{
              fontSize: "34px",
              fontWeight: 900,
              letterSpacing: "1px",
              fontFamily: "'Times New Roman', Georgia, serif",
              lineHeight: 1.05,
              textShadow: "0 2px 14px rgba(0,0,0,0.9)",
            }}
          >
            MIDNIGHT SHADOWS
          </div>
        </div>

        {/* Film Noir Badge */}
        <div
          style={{
            background: "rgba(10, 12, 15, 0.85)",
            border: "1px solid rgba(255, 235, 175, 0.4)",
            color: FILMNOIR_PALETTE.streetLightTungsten,
            padding: "8px 16px",
            borderRadius: "3px",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "2px",
          }}
        >
          CHIAROSCURO // 32
        </div>
      </div>

      {/* Bottom Subtitle / Case Quote */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          opacity,
        }}
      >
        <div
          style={{
            background: "rgba(8, 10, 13, 0.82)",
            borderLeft: "3px solid #FFE3A0",
            padding: "14px 20px",
            maxWidth: "680px",
          }}
        >
          <div
            style={{
              fontSize: "17px",
              fontFamily: "'Times New Roman', Georgia, serif",
              fontStyle: "italic",
              lineHeight: 1.4,
              color: "#F1F5F9",
              marginBottom: "6px",
            }}
          >
            "The city was drowning in rain, and every shadow had a story it didn't want to tell."
          </div>
          <div style={{ fontSize: "11px", letterSpacing: "2px", color: "rgba(255,255,255,0.6)" }}>
            CINEMATIC NOIR // 35MM MONOCHROME // TUNGSTEN CHASM
          </div>
        </div>

        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", textAlign: "right" }}>
          AUDIRA FILM NOIR
          <br />
          EBU R128 (-14 LUFS)
        </div>
      </div>
    </div>
  );
};
