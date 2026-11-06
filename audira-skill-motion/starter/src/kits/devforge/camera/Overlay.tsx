import React from "react";
import { AbsoluteFill } from "remotion";
import { DEVFORGE_PALETTE } from "../lib/palette";
import { computeDevforgeState } from "../core/motion";

export const DevforgeOverlay: React.FC<{ f: number }> = ({ f }) => {
  const state = computeDevforgeState(f);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", padding: 60, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      {/* Top Header Status */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: DEVFORGE_PALETTE.accentNeon, boxShadow: `0 0 12px ${DEVFORGE_PALETTE.accentNeon}` }} />
          <span style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: 2 }}>
            DEVFORGE // SPATIAL IDE v3.3
          </span>
        </div>
        <div style={{ background: "rgba(22, 27, 34, 0.85)", border: "1px solid rgba(0, 240, 255, 0.3)", padding: "6px 16px", borderRadius: 20 }}>
          <span style={{ fontFamily: "monospace", fontSize: 13, color: DEVFORGE_PALETTE.metricProfit, fontWeight: 800 }}>
            ● LIVE DEPLOYMENT
          </span>
        </div>
      </div>

      {/* Floating Revenue / Hustle Badge (Pops in Act 3) */}
      {state.metricScale > 0 && (
        <div style={{
          alignSelf: "flex-end",
          transform: `scale(${state.metricScale})`,
          transformOrigin: "bottom right",
          background: "rgba(13, 17, 23, 0.92)",
          border: `2px solid ${DEVFORGE_PALETTE.metricProfit}`,
          borderRadius: 20,
          padding: "18px 26px",
          boxShadow: "0 20px 50px rgba(0, 255, 150, 0.25)",
          backdropFilter: "blur(14px)",
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 13, color: DEVFORGE_PALETTE.metricProfit, fontWeight: 800, letterSpacing: 2 }}>
            ESTIMATED REVENUE
          </div>
          <div style={{ fontSize: 38, fontWeight: 900, color: "#FFFFFF", fontFamily: "monospace", marginTop: 4 }}>
            +$1,250 <span style={{ fontSize: 18, color: DEVFORGE_PALETTE.amberGold }}>ROBUX</span>
          </div>
          <div style={{ fontSize: 13, color: "#8B949E", marginTop: 4 }}>
            Execution Time: <b style={{ color: "#fff" }}>45s with AI</b>
          </div>
        </div>
      )}

      {/* Bottom Educational Callout Card (Mobile Safe Zone Protected) */}
      <div style={{
        background: "rgba(13, 17, 23, 0.88)",
        border: `1px solid ${DEVFORGE_PALETTE.accentNeon}`,
        borderRadius: 18,
        padding: 24,
        maxWidth: 500,
        backdropFilter: "blur(12px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
      }}>
        <div style={{ fontSize: 13, color: DEVFORGE_PALETTE.accentNeon, fontWeight: 800, letterSpacing: 2 }}>
          AI GAME DEVELOPMENT
        </div>
        <h3 style={{ margin: "6px 0 0 0", color: "#fff", fontSize: 26, fontWeight: 800 }}>
          "Ide Simpel, Eksekusi Cepat, Jadi Cuan."
        </h3>
        <p style={{ margin: "8px 0 0 0", color: "#8B949E", fontSize: 15, lineHeight: 1.45 }}>
          Bongkar rahasia membuat game Roblox tanpa jago coding. Manfaatkan AI untuk menulis logika sistem, monetisasi otomatis, dan langsung rilis.
        </p>
      </div>
    </AbsoluteFill>
  );
};
