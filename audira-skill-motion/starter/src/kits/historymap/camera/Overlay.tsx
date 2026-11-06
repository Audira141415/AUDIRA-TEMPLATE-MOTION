import React from "react";

export const HistoryMapOverlay: React.FC<{ f: number }> = ({ f }) => {
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
              color: "#FFB300",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            ● FRONT TIMELINE // 117 AD - ROMAN EMPIRE
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 900,
              letterSpacing: "0.5px",
              lineHeight: 1.08,
            }}
          >
            IMPERIAL ADVANCE ACROSS DANUBE
          </div>
        </div>

        <div
          style={{
            background: "rgba(10, 14, 20, 0.88)",
            border: "1px solid #FFB300",
            color: "#FFFFFF",
            padding: "8px 16px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "2px",
          }}
        >
          WAR HISTORY // 42
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
            background: "rgba(10, 14, 20, 0.86)",
            borderLeft: "4px solid #FFB300",
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
            "Legio XIII Gemina crosses the bridgehead, encircling Dacian strongholds in a classic pincer envelopment."
          </div>
          <div style={{ fontSize: "11px", letterSpacing: "2px", color: "rgba(255,255,255,0.65)" }}>
            DANUBE RIVER BASIN // PINCER ENCIRCLEMENT // YEAR 117 AD
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
