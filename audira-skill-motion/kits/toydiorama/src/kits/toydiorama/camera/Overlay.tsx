import React from "react";
import { TOYDIORAMA_PALETTE } from "../lib/palette";

export const ToyDioramaOverlay: React.FC<{ f: number }> = ({ f }) => {
  const isIntro = f < 60;
  const introOpacity = Math.min(1, f / 30);

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
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        color: "#FFFFFF",
      }}
    >
      {/* Top Editorial Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          opacity: introOpacity,
        }}
      >
        <div>
          <div
            style={{
              fontSize: "14px",
              fontFamily: "monospace",
              letterSpacing: "3px",
              color: TOYDIORAMA_PALETTE.propPrimary,
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            ● AUDIRA 3D TOY DIORAMA
          </div>
          <div
            style={{
              fontSize: "36px",
              fontWeight: 900,
              letterSpacing: "-0.5px",
              lineHeight: 1.05,
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            }}
          >
            THEATRICAL STAGE
          </div>
        </div>

        {/* Taped Category Badge */}
        <div
          style={{
            background: "rgba(250, 246, 238, 0.95)",
            color: "#181A1B",
            padding: "8px 16px",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: 800,
            fontFamily: "monospace",
            boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
            borderTop: "3px solid #E5A93C",
          }}
        >
          PBR // STYLE 31
        </div>
      </div>

      {/* Bottom Editorial Specs Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          opacity: introOpacity,
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <span
            style={{
              background: "rgba(14, 20, 29, 0.8)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            MATTE PLASTIC
          </span>
          <span
            style={{
              background: "rgba(14, 20, 29, 0.8)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            SOFT CLAY
          </span>
          <span
            style={{
              background: "rgba(14, 20, 29, 0.8)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            STATIC RIG
          </span>
        </div>

        <div
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            color: "rgba(255,255,255,0.6)",
            textAlign: "right",
          }}
        >
          AUDIRA MOTION DIRECTOR
          <br />
          EBU R128 (-14 LUFS)
        </div>
      </div>
    </div>
  );
};
