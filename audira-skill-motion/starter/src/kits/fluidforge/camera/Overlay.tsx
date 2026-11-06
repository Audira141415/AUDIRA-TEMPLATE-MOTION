import React from "react";

export const FluidforgeOverlay: React.FC<{ f: number }> = ({ f }) => {
  const opacity = Math.min(1, f / 30);

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
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        color: "#ECEFF4",
      }}
    >
      {/* Top Header */}
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
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "3px",
              color: "#FFBE55",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            ● CHROMATIC FERROFLUID // ZERO-G
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 900,
              letterSpacing: "0.5px",
              lineHeight: 1.08,
            }}
          >
            LIQUID METAL HARMONICS
          </div>
        </div>

        <div
          style={{
            background: "rgba(10, 12, 16, 0.86)",
            border: "1px solid #FFBE55",
            color: "#FFFFFF",
            padding: "8px 16px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "2px",
          }}
        >
          FLUIDFORGE // 34
        </div>
      </div>

      {/* Bottom Verbatim / Telemetry Callout */}
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
            background: "rgba(10, 12, 16, 0.85)",
            borderLeft: "4px solid #FFBE55",
            padding: "14px 20px",
            maxWidth: "680px",
            color: "#F8FAFC",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: 1.4,
              marginBottom: "6px",
            }}
          >
            "Surface tension binds liquid chrome into weightless acoustic geometry."
          </div>
          <div style={{ fontSize: "11px", letterSpacing: "2px", color: "rgba(255,255,255,0.65)" }}>
            IRIDESCENT CHROME // 60FPS HARMONIC
          </div>
        </div>

        <div style={{ fontSize: "12px", opacity: 0.6, textAlign: "right" }}>
          AUDIRA MOTION v4.0
          <br />
          EBU R128 (-14 LUFS)
        </div>
      </div>
    </div>
  );
};
