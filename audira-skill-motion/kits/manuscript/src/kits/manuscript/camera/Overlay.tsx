import React from "react";
import { useVideoConfig } from "remotion";
import { MANUSCRIPT_PALETTE as P } from "../lib/palette";
import { ramp, smooth } from "../core/motion";

// Safe zones on 1080x1920: top 180 px and bottom 380 px stay clear (scaled by height/1920).
export const ManuscriptOverlay: React.FC<{ f: number }> = ({ f }) => {
  const { height } = useVideoConfig();
  const s = height / 1920;
  const t = f / 60;
  const inA = smooth(ramp(t, 0.3, 1.1));
  const beat = t < 2 ? "FOLIO I // HURUF EMAS" : t < 5.6 ? "TINTA BESI // PENA BULU" : t < 8.8 ? "LONTAR // DAUN TAL BERTALI" : "NASKAH KUNO // CAHAYA LILIN";
  const quote = t < 5.6 ? "“Sebelum mesin cetak, setiap huruf ditulis tangan.”" : "“Di kulit hewan dan daun tal, ingatan dijaga berabad-abad.”";

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", fontFamily: "'Georgia', serif", color: "#F3E4C4" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 52%, rgba(12,7,4,0.62) 100%)" }} />
      <div style={{ position: "absolute", top: 196 * s, left: 64 * s, right: 64 * s, opacity: inA, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 21 * s, letterSpacing: 4 * s, color: P.goldLeaf, marginBottom: 10 * s }}>✠ {beat}</div>
          <div style={{ fontSize: 62 * s, fontWeight: 700, lineHeight: 1.04, textShadow: `0 ${3 * s}px ${20 * s}px rgba(0,0,0,0.85)` }}>
            Tinta, Emas
            <br />
            &amp; Daun Lontar
          </div>
        </div>
        <div style={{ background: "rgba(36,65,140,0.85)", border: `${2 * s}px solid ${P.goldLeaf}`, padding: `${10 * s}px ${18 * s}px`, fontFamily: "monospace", fontSize: 20 * s, fontWeight: 700, letterSpacing: 2 * s, whiteSpace: "nowrap" }}>
          MANUSCRIPT // 67
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 396 * s, left: 64 * s, right: 64 * s, opacity: smooth(ramp(t, 1.2, 2.2)), display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 * s }}>
        <div style={{ background: "rgba(20,12,8,0.8)", borderLeft: `${5 * s}px solid ${P.rubricRed}`, padding: `${18 * s}px ${24 * s}px`, maxWidth: 700 * s }}>
          <div style={{ fontSize: 30 * s, fontStyle: "italic", lineHeight: 1.35, marginBottom: 10 * s }}>{quote}</div>
          <div style={{ fontFamily: "monospace", fontSize: 16 * s, letterSpacing: 2 * s, color: "rgba(243,228,196,0.7)" }}>ILUMINASI EMAS // LONTAR NUSANTARA</div>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 18 * s, color: "rgba(243,228,196,0.75)", whiteSpace: "nowrap" }}>Creator: AUDIRA</div>
      </div>
    </div>
  );
};
