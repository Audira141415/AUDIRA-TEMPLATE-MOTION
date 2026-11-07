import React from "react";
import { useVideoConfig } from "remotion";
import { MORPH_B, clamp01 } from "../core/motion";
import { Y2KCHROME_PALETTE as P } from "../lib/palette";

// Frutiger-aero HUD: glossy glass pills with a white top highlight, aqua gradient text.
// Authored at 1080x1920, scaled by height/1920, inside the 180/380 px safe bands.
const glossPill = (s: number): React.CSSProperties => ({
  background: "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.55) 48%, rgba(190,235,255,0.55) 52%, rgba(255,255,255,0.75) 100%)",
  border: `${2 * s}px solid rgba(255,255,255,0.95)`,
  boxShadow: `0 ${8 * s}px ${24 * s}px rgba(0,70,160,0.25), inset 0 ${-4 * s}px ${10 * s}px rgba(0,150,255,0.18)`,
});

export const Y2kchromeOverlay: React.FC<{ f: number }> = ({ f }) => {
  const { height } = useVideoConfig();
  const s = height / 1920;
  const t = f / 60;
  const fadeIn = clamp01((t - 0.15) / 0.5);
  const beat = t < 2.2 ? 0 : t < 8.4 ? 1 : 2;
  const quotes = ["Satu tetes krom jatuh dari langit biru…", "…menelan tetes-tetes kecil, bergoyang seperti jeli.", "Pop! Jadi bintang krom berkilau."];
  const pop = clamp01((t - MORPH_B + 0.1) / 0.25);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", fontFamily: "'Trebuchet MS', 'Verdana', sans-serif", color: P.hudInk }}>
      <div style={{ position: "absolute", top: 196 * s, left: 60 * s, right: 60 * s, display: "flex", justifyContent: "space-between", alignItems: "flex-start", opacity: fadeIn }}>
        <div>
          <div style={{ fontSize: 22 * s, letterSpacing: 4 * s, fontWeight: 700, color: "#FFFFFF", textShadow: `0 ${2 * s}px ${6 * s}px rgba(0,60,160,0.5)`, marginBottom: 8 * s }}>✦ MILLENNIUM MODE // 2000</div>
          <div
            style={{
              fontSize: 70 * s,
              fontWeight: 900,
              lineHeight: 0.98,
              letterSpacing: -1 * s,
              background: "linear-gradient(180deg, #0B3C9C 0%, #1667D9 46%, #00A3FF 54%, #0B4FB8 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: `drop-shadow(0 0 ${3 * s}px #FFFFFF) drop-shadow(0 ${4 * s}px ${8 * s}px rgba(0,50,140,0.45))`,
            }}
          >
            Liquid
            <br />
            Chrome
          </div>
        </div>
        <div style={{ ...glossPill(s), borderRadius: 999, padding: `${10 * s}px ${20 * s}px`, fontWeight: 800, fontSize: 21 * s, letterSpacing: 2 * s }}>Y2KCHROME // 54</div>
      </div>

      <div style={{ position: "absolute", bottom: 400 * s, left: 60 * s, right: 60 * s, display: "flex", justifyContent: "space-between", alignItems: "flex-end", opacity: fadeIn }}>
        <div style={{ ...glossPill(s), borderRadius: 34 * s, padding: `${20 * s}px ${28 * s}px`, maxWidth: 680 * s, transform: `scale(${1 + pop * (1 - pop) * 0.3})` }}>
          <div style={{ fontSize: 33 * s, fontWeight: 700, lineHeight: 1.28, marginBottom: 8 * s }}>"{quotes[beat]}"</div>
          <div style={{ fontSize: 17 * s, letterSpacing: 2 * s, color: "rgba(6,48,110,0.65)" }}>AQUA SKY // IRIDESCENT BUBBLE // CHROME BLOB</div>
        </div>
        <div style={{ fontSize: 18 * s, fontWeight: 700, color: "#FFFFFF", textShadow: `0 ${2 * s}px ${6 * s}px rgba(0,60,160,0.5)`, textAlign: "right" }}>Creator: AUDIRA</div>
      </div>
    </div>
  );
};
