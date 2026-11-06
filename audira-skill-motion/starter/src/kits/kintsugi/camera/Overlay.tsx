import React from "react";
import { AbsoluteFill } from "remotion";
import { KINTSUGI_PALETTE } from "../lib/palette";

export const KintsugiOverlay: React.FC<{ f: number }> = ({ f }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none", padding: 60, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ textAlign: "right" }}>
        <span style={{ fontFamily: "serif", fontSize: 20, color: KINTSUGI_PALETTE.pureGoldLeaf, letterSpacing: 4 }}>
          金継ぎ • KINTSUGI
        </span>
      </div>
      <div>
        <h2 style={{ margin: 0, fontFamily: "serif", fontSize: 32, color: "#222", fontWeight: 400 }}>
          Keindahan Dalam Retakan
        </h2>
        <p style={{ margin: "8px 0 0 0", fontFamily: "serif", fontSize: 16, color: "#666", lineHeight: 1.5 }}>
          Filosofi wabi-sabi memadukan porselen matte dengan urat emas cair, merayakan sejarah pemulihan dan kesempurnaan baru.
        </p>
      </div>
    </AbsoluteFill>
  );
};
