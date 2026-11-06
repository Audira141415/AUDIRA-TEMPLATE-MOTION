import React from "react";
import { AbsoluteFill } from "remotion";
import { VINTAGE_PALETTE } from "../lib/palette";

export const VintageOverlay: React.FC<{ f: number }> = ({ f }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none", padding: 70, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ borderBottom: `2px solid ${VINTAGE_PALETTE.engravingBrown}`, paddingBottom: 16 }}>
        <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 24, color: VINTAGE_PALETTE.engravingBrown }}>
          Figura Machina Renascentia • Anno MDCLXXII
        </span>
      </div>
      <div style={{ background: "rgba(243, 234, 214, 0.85)", padding: 24, border: `1px solid ${VINTAGE_PALETTE.agedGold}`, borderRadius: 4 }}>
        <h2 style={{ margin: 0, fontFamily: "Georgia, serif", fontSize: 28, color: VINTAGE_PALETTE.engravingBrown }}>
          Siklus Kosmik & Mekanika Selestial
        </h2>
        <p style={{ margin: "10px 0 0 0", fontFamily: "Georgia, serif", fontSize: 16, color: VINTAGE_PALETTE.ironGallInk, lineHeight: 1.5 }}>
          Arsiran gravir tembaga merekonstruksi instrumen navigasi astronomi kuno dengan presisi proporsi geometri suci.
        </p>
      </div>
    </AbsoluteFill>
  );
};
