import React from "react";
import { useVideoConfig } from "remotion";
import { MISTIS_PALETTE } from "../lib/palette";
import { ramp, smooth } from "../core/motion";

// Mobile safe zones on a 1080x1920 frame: top 180 px and bottom 380 px stay clear.
export const MistisOverlay: React.FC<{ f: number }> = ({ f }) => {
  const { width, height } = useVideoConfig();
  const s = height / 1920;
  const t = f / 60;
  const inA = smooth(ramp(t, 0.2, 1.0));
  const beat = t < 4 ? "PUKUL 00.13 // JALAN SETAPAK" : t < 8.8 ? "KABUT TURUN // BERINGIN TUA" : "PELITA MEREDUP // JANGAN MENOLEH";
  const quote =
    t < 8.8 ? "“Pelita bergoyang, padahal malam ini tak ada angin.”" : "“Di balik akar beringin, kabut membentuk seseorang.”";
  const shiver = t > 9 && t < 10.8 ? Math.sin(t * 90) * 1.5 * s : 0;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        color: "#E6ECF2",
        width,
        height,
      }}
    >
      {/* soft vignette to sell the night lens */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(4,8,14,0.55) 100%)" }} />

      <div style={{ position: "absolute", top: 196 * s, left: 64 * s, right: 64 * s, opacity: inA, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 22 * s, letterSpacing: 4 * s, color: MISTIS_PALETTE.lanternAmber, marginBottom: 10 * s }}>
            ● {beat}
          </div>
          <div style={{ fontSize: 66 * s, fontStyle: "italic", lineHeight: 1.05, textShadow: `0 ${4 * s}px ${24 * s}px rgba(0,0,0,0.8)`, transform: `translateX(${shiver}px)` }}>
            Yang Menunggu
            <br />
            di Kabut
          </div>
        </div>
        <div
          style={{
            border: `${2 * s}px solid ${MISTIS_PALETTE.lanternAmber}`,
            color: "#F3E6D0",
            background: "rgba(10,16,26,0.7)",
            padding: `${10 * s}px ${18 * s}px`,
            fontFamily: "monospace",
            fontSize: 20 * s,
            fontWeight: 700,
            letterSpacing: 2 * s,
            whiteSpace: "nowrap",
          }}
        >
          MISTISFORGE // 44
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 396 * s, left: 64 * s, right: 64 * s, opacity: smooth(ramp(t, 1.2, 2.2)), display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 * s }}>
        <div style={{ background: "rgba(8,14,24,0.72)", borderLeft: `${5 * s}px solid ${MISTIS_PALETTE.lanternAmber}`, padding: `${18 * s}px ${24 * s}px`, maxWidth: 700 * s }}>
          <div style={{ fontSize: 32 * s, fontStyle: "italic", lineHeight: 1.35, marginBottom: 10 * s }}>{quote}</div>
          <div style={{ fontFamily: "monospace", fontSize: 17 * s, letterSpacing: 2 * s, color: "rgba(200,214,230,0.75)" }}>
            CERITA RAKYAT NUSANTARA // KABUT & PELITA
          </div>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 18 * s, color: "rgba(220,230,240,0.7)", textAlign: "right", whiteSpace: "nowrap" }}>
          Creator: AUDIRA
        </div>
      </div>
    </div>
  );
};
