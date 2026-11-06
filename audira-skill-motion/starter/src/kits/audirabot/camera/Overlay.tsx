import React from "react";
import { AbsoluteFill } from "remotion";
import { AUDIRABOT_PALETTE } from "../lib/palette";
import { computeBotState } from "../core/motion";

export const AudirabotOverlay: React.FC<{ f: number }> = ({ f }) => {
  const state = computeBotState(f);
  const statusColor =
    state.emotion === "HAPPY"
      ? AUDIRABOT_PALETTE.eyeGreen
      : state.emotion === "THINKING"
      ? AUDIRABOT_PALETTE.eyeAmber
      : AUDIRABOT_PALETTE.eyeCyan;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", padding: 60, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      {/* Top Telemetry Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: statusColor, boxShadow: `0 0 12px ${statusColor}` }} />
          <span style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: 2 }}>
            AUDIRA-BOT // COMPANION OS v3.2
          </span>
        </div>
        <div style={{ background: "rgba(26, 29, 36, 0.75)", border: "1px solid rgba(255,255,255,0.15)", padding: "6px 14px", borderRadius: 20 }}>
          <span style={{ fontFamily: "monospace", fontSize: 14, color: statusColor, fontWeight: 700 }}>
            STATE: {state.emotion}
          </span>
        </div>
      </div>

      {/* Speech / Explainer Bubble */}
      <div style={{ background: "rgba(10, 13, 20, 0.85)", border: `1px solid ${statusColor}`, borderRadius: 16, padding: 24, maxWidth: 480, backdropFilter: "blur(12px)", boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }}>
        <div style={{ fontSize: 13, color: statusColor, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>
          AI Autonomous Guide
        </div>
        <h3 style={{ margin: "6px 0 0 0", color: "#fff", fontSize: 26, fontWeight: 800 }}>
          "Halo! Saya AUDIRA-BOT."
        </h3>
        <p style={{ margin: "8px 0 0 0", color: "#B0B8C4", fontSize: 16, lineHeight: 1.45 }}>
          Maskot 3D resmi pendamping video Anda. Saya siap memandu pemirsa, menunjuk komponen mesin, dan menghidupkan narasi teknologi.
        </p>
      </div>
    </AbsoluteFill>
  );
};
