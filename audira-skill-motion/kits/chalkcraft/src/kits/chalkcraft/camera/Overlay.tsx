import React from "react";
import { AbsoluteFill } from "remotion";
import { CHALK_PALETTE } from "../lib/palette";

export const ChalkOverlay: React.FC<{ f: number }> = ({ f }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none", padding: 60, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <span style={{ fontFamily: "serif", fontStyle: "italic", fontSize: 26, color: CHALK_PALETTE.chalkAmber }}>
          iℏ ∂/∂t |Ψ(t)⟩ = Ĥ |Ψ(t)⟩
        </span>
      </div>
      <div style={{ borderLeft: `4px solid ${CHALK_PALETTE.chalkCyan}`, paddingLeft: 16 }}>
        <h3 style={{ margin: 0, fontSize: 28, color: CHALK_PALETTE.chalkWhite, fontFamily: "serif" }}>
          Persamaan Gelombang Schrödinger
        </h3>
        <p style={{ margin: "6px 0 0 0", fontSize: 16, color: "#ccc", fontFamily: "serif", lineHeight: 1.4 }}>
          Garis kapur berdebu menggambarkan probabilitas posisi elektron di sekitar inti atom dalam ruang kuantum 3D.
        </p>
      </div>
    </AbsoluteFill>
  );
};
