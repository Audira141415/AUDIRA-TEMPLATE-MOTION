import React from "react";
import { useVideoConfig } from "remotion";
import { UKIYO_PALETTE as P } from "../lib/palette";
import { ramp, smooth } from "../core/motion";

// Safe zones on 1080x1920: top 180 px and bottom 380 px stay clear (scaled by height/1920).
export const UkiyoOverlay: React.FC<{ f: number }> = ({ f }) => {
  const { height } = useVideoConfig();
  const s = height / 1920;
  const t = f / 60;
  const inA = smooth(ramp(t, 0.3, 1.1));
  const beat = t < 2.6 ? "BLOK I // OMBAK" : t < 8.4 ? "BLOK II // PERAHU & GUNUNG" : "CETAKAN AKHIR // CAP MERAH";
  const quote = t < 8.4 ? "“Setiap warna adalah satu balok kayu yang diukir.”" : "“Lapis demi lapis kertas, satu ombak yang abadi.”";

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", fontFamily: "'Georgia', serif", color: P.prussianDeep }}>
      <div style={{ position: "absolute", top: 196 * s, left: 64 * s, right: 64 * s, opacity: inA, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ background: "rgba(239,227,200,0.9)", padding: `${14 * s}px ${20 * s}px`, borderLeft: `${6 * s}px solid ${P.vermilion}` }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 21 * s, letterSpacing: 4 * s, color: P.vermilion, marginBottom: 8 * s }}>■ {beat}</div>
          <div style={{ fontSize: 58 * s, fontWeight: 700, lineHeight: 1.04 }}>
            Ombak di
            <br />
            Ujung Fajar
          </div>
        </div>
        <div
          style={{
            background: P.vermilion,
            color: P.washi,
            padding: `${10 * s}px ${18 * s}px`,
            fontFamily: "monospace",
            fontSize: 20 * s,
            fontWeight: 700,
            letterSpacing: 2 * s,
            whiteSpace: "nowrap",
          }}
        >
          UKIYOFORGE // 57
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 396 * s, left: 64 * s, right: 64 * s, opacity: smooth(ramp(t, 1.2, 2.2)), display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 * s }}>
        <div style={{ background: "rgba(239,227,200,0.92)", border: `${2 * s}px solid ${P.keyLine}`, padding: `${16 * s}px ${22 * s}px`, maxWidth: 690 * s }}>
          <div style={{ fontSize: 30 * s, fontStyle: "italic", lineHeight: 1.35, marginBottom: 8 * s }}>{quote}</div>
          <div style={{ fontFamily: "monospace", fontSize: 16 * s, letterSpacing: 2 * s, color: "rgba(15,39,71,0.75)" }}>CETAK KAYU UKIYO-E // KERTAS WASHI BERLAPIS</div>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 18 * s, color: P.washi, background: "rgba(15,39,71,0.75)", padding: `${6 * s}px ${10 * s}px`, whiteSpace: "nowrap" }}>Creator: AUDIRA</div>
      </div>
    </div>
  );
};
