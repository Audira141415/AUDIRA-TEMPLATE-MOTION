import React from "react";
import { useVideoConfig } from "remotion";
import { WAYANG_PALETTE as P } from "../lib/palette";
import { ramp, smooth } from "../core/motion";

// Safe zones on 1080x1920: top 180 px and bottom 380 px stay clear (scaled by height/1920).
export const WayangOverlay: React.FC<{ f: number }> = ({ f }) => {
  const { height } = useVideoConfig();
  const s = height / 1920;
  const t = f / 60;
  const inA = smooth(ramp(t, 0.4, 1.2));
  const beat = t < 5.6 ? "SISI DALANG // WARNA & PRADA" : t < 9.2 ? "MENGITARI KELIR" : "SISI BAYANGAN // TANCEP KAYON";
  const quote =
    t < 5.6
      ? "“Satu pelita, satu kelir, dan kulit yang ditatah ribuan lubang.”"
      : "“Dari balik layar, yang tersisa hanyalah bayangan dan cerita.”";

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", fontFamily: "'Georgia', serif", color: "#F6E8CC" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 55%, rgba(10,6,16,0.6) 100%)" }} />
      <div style={{ position: "absolute", top: 196 * s, left: 64 * s, right: 64 * s, opacity: inA, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 22 * s, letterSpacing: 4 * s, color: P.blencongAmber, marginBottom: 10 * s }}>◆ {beat}</div>
          <div style={{ fontSize: 64 * s, fontWeight: 700, lineHeight: 1.04, letterSpacing: -0.5 * s, textShadow: `0 ${4 * s}px ${22 * s}px rgba(0,0,0,0.85)` }}>
            Bayang di
            <br />
            Balik Kelir
          </div>
        </div>
        <div
          style={{
            background: "rgba(30,42,90,0.85)",
            border: `${2 * s}px solid ${P.pradaGold}`,
            color: "#F6E8CC",
            padding: `${10 * s}px ${18 * s}px`,
            fontFamily: "monospace",
            fontSize: 20 * s,
            fontWeight: 700,
            letterSpacing: 2 * s,
            whiteSpace: "nowrap",
          }}
        >
          WAYANGFORGE // 47
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 396 * s, left: 64 * s, right: 64 * s, opacity: smooth(ramp(t, 1.4, 2.4)), display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 * s }}>
        <div style={{ background: "rgba(18,12,30,0.78)", borderLeft: `${5 * s}px solid ${P.pradaGold}`, padding: `${18 * s}px ${24 * s}px`, maxWidth: 700 * s }}>
          <div style={{ fontSize: 31 * s, fontStyle: "italic", lineHeight: 1.35, marginBottom: 10 * s }}>{quote}</div>
          <div style={{ fontFamily: "monospace", fontSize: 17 * s, letterSpacing: 2 * s, color: "rgba(246,232,204,0.7)" }}>WAYANG KULIT // BLENCONG & KELIR</div>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 18 * s, color: "rgba(246,232,204,0.7)", whiteSpace: "nowrap" }}>Creator: AUDIRA</div>
      </div>
    </div>
  );
};
