import React from "react";
import { AbsoluteFill } from "remotion";
import { BRUTAL_PALETTE } from "../lib/palette";

export const BrutalOverlay: React.FC<{ f: number }> = ({ f }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none", padding: 50, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ background: BRUTAL_PALETTE.hotPink, border: "4px solid #000", padding: "8px 20px", boxShadow: "6px 6px 0px #000" }}>
          <span style={{ fontWeight: 900, fontSize: 24, color: "#fff", textTransform: "uppercase" }}>
            FAST & LOUD
          </span>
        </div>
        <div style={{ background: BRUTAL_PALETTE.acidGreen, border: "4px solid #000", padding: "8px 16px", boxShadow: "6px 6px 0px #000" }}>
          <span style={{ fontWeight: 900, fontSize: 24, color: "#000" }}>60 FPS</span>
        </div>
      </div>
      <div style={{ background: "#fff", border: "5px solid #000", padding: 24, boxShadow: "8px 8px 0px #000" }}>
        <h1 style={{ margin: 0, fontSize: 38, fontWeight: 900, color: "#000", textTransform: "uppercase", letterSpacing: -1 }}>
          NEO-BRUTALISM 3D
        </h1>
        <p style={{ margin: "10px 0 0 0", fontSize: 18, fontWeight: 700, color: "#222" }}>
          Anti-elegan, tanpa gradasi halus. Tepi hitam tegas dengan kontras ekstrem untuk menarik atensi seketika di feed sosial.
        </p>
      </div>
    </AbsoluteFill>
  );
};
