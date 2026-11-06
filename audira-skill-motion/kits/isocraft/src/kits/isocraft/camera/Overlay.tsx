import React from "react";
import { AbsoluteFill } from "remotion";
import { ISOCRAFT_PALETTE } from "../lib/palette";

export const IsoOverlay: React.FC<{ f: number }> = ({ f }) => {
  const mode = Math.sin(f * 0.03) > 0 ? "SEE-THROUGH: ACTIVE" : "CHASSIS: SEALED";
  return (
    <AbsoluteFill style={{ pointerEvents: "none", padding: 60, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ border: `3px solid ${ISOCRAFT_PALETTE.inkBlack}`, background: ISOCRAFT_PALETTE.accentYellow, padding: "8px 16px", borderRadius: 8, boxShadow: "4px 4px 0px #1C1E21" }}>
          <span style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 20, color: ISOCRAFT_PALETTE.inkBlack }}>
            ISOCRAFT #21 // DISSECTION
          </span>
        </div>
        <div style={{ border: `2px solid ${ISOCRAFT_PALETTE.inkBlack}`, background: "#fff", padding: "6px 14px", borderRadius: 6 }}>
          <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 16, color: ISOCRAFT_PALETTE.inkBlack }}>
            {mode}
          </span>
        </div>
      </div>
      <div style={{ border: `3px solid ${ISOCRAFT_PALETTE.inkBlack}`, background: "#fff", padding: 20, borderRadius: 12, boxShadow: "6px 6px 0px #1C1E21", maxWidth: 440 }}>
        <h3 style={{ margin: 0, fontSize: 26, fontFamily: "sans-serif", fontWeight: 900, color: ISOCRAFT_PALETTE.inkBlack }}>
          Mekanisme Dalam Terurai
        </h3>
        <p style={{ margin: "8px 0 0 0", fontSize: 16, color: "#444", lineHeight: 1.4 }}>
          Transparansi dinamis mengungkap kerja motor listrik dan transmisi roda gigi tanpa merusak estetika komik tinta.
        </p>
      </div>
    </AbsoluteFill>
  );
};
