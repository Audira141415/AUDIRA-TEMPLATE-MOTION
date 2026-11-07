import React from "react";
import { useVideoConfig } from "remotion";
import { SULAM_PALETTE as P } from "../lib/palette";
import { ramp, smooth } from "../core/motion";

// Safe zones on 1080x1920: top 180 px and bottom 380 px stay clear (scaled by height/1920).
export const SulamOverlay: React.FC<{ f: number }> = ({ f }) => {
  const { height } = useVideoConfig();
  const s = height / 1920;
  const t = f / 60;
  const inA = smooth(ramp(t, 0.3, 1.1));
  const count = Math.min(640, Math.floor(Math.max(0, t - 0.3) * 62));
  const beat = t < 6 ? "TUSUK SATIN // KELOPAK" : t < 9 ? "TULANG DAUN // CINCIN EMAS" : "BENANG EMAS // SONGKET";
  const quote = t < 8.8 ? "“Satu tusukan, satu helai benang, ratusan kali.”" : "“Benang emas menangkap cahaya, seperti songket di hari raya.”";

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", fontFamily: "'Georgia', serif", color: "#F7EADB" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 58%, rgba(20,10,14,0.55) 100%)" }} />
      <div style={{ position: "absolute", top: 196 * s, left: 64 * s, right: 64 * s, opacity: inA, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 21 * s, letterSpacing: 4 * s, color: P.gold, marginBottom: 10 * s }}>✦ {beat}</div>
          <div style={{ fontSize: 62 * s, fontWeight: 700, lineHeight: 1.04, textShadow: `0 ${3 * s}px ${18 * s}px rgba(0,0,0,0.7)` }}>
            Bunga dari
            <br />
            Benang Emas
          </div>
          <div style={{ marginTop: 12 * s, fontFamily: "monospace", fontSize: 20 * s, color: "rgba(247,234,219,0.85)" }}>{String(count).padStart(3, "0")} tusukan</div>
        </div>
        <div style={{ background: "rgba(74,15,36,0.85)", border: `${2 * s}px solid ${P.gold}`, padding: `${10 * s}px ${18 * s}px`, fontFamily: "monospace", fontSize: 20 * s, fontWeight: 700, letterSpacing: 2 * s, whiteSpace: "nowrap" }}>
          SULAMFORGE // 59
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 396 * s, left: 64 * s, right: 64 * s, opacity: smooth(ramp(t, 1.2, 2.2)), display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 * s }}>
        <div style={{ background: "rgba(30,10,18,0.78)", borderLeft: `${5 * s}px solid ${P.gold}`, padding: `${18 * s}px ${24 * s}px`, maxWidth: 700 * s }}>
          <div style={{ fontSize: 30 * s, fontStyle: "italic", lineHeight: 1.35, marginBottom: 10 * s }}>{quote}</div>
          <div style={{ fontFamily: "monospace", fontSize: 16 * s, letterSpacing: 2 * s, color: "rgba(247,234,219,0.7)" }}>SULAM TANGAN // TENUN SONGKET</div>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 18 * s, color: "rgba(247,234,219,0.75)", whiteSpace: "nowrap" }}>Creator: AUDIRA</div>
      </div>
    </div>
  );
};
