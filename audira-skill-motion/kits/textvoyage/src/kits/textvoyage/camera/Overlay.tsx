import React from "react";
import { AbsoluteFill } from "remotion";
import { TEXTVOYAGE_PALETTE } from "../lib/palette";

export const TextvoyageOverlay: React.FC<{ f: number }> = ({ f }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none", padding: 60, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <span style={{ fontSize: 18, color: TEXTVOYAGE_PALETTE.coreAccentGold, letterSpacing: 8, textTransform: "uppercase" }}>
          MANIFESTO // CHAPTER I
        </span>
      </div>
      <div>
        <h1 style={{ margin: 0, fontSize: 46, fontWeight: 900, color: "#fff", letterSpacing: -1, textTransform: "uppercase" }}>
          BEYOND HORIZON
        </h1>
        <p style={{ margin: "10px 0 0 0", fontSize: 18, color: "#888", maxWidth: 460 }}>
          Penerbangan kamera spasial menembus koridor arsitektur tipografi raksasa dengan pencahayaan cahaya volumetrik.
        </p>
      </div>
    </AbsoluteFill>
  );
};
