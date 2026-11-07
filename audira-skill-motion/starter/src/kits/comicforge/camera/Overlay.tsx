import React from "react";
import { COMIC_PALETTE as P } from "../lib/palette";

const FONT = "Impact, 'Arial Black', 'Segoe UI Black', sans-serif";

export const ComicforgeOverlay: React.FC<{ f: number; width: number; height: number }> = ({ f, width, height }) => {
  const s = height / 1920;
  const t = f / 60;
  const inK = Math.min(1, f / 30);
  const capK = Math.min(1, Math.max(0, (t - 9.3) / 0.4));
  const quote = t < 4.4 ? "Neon Bay sleeps. One hero keeps watch from the rooftops." : t < 8.8 ? "A rogue drone dives for the harbour — he jumps." : "One punch. One page. The city is safe tonight.";
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        padding: `${180 * s}px ${56 * s}px ${380 * s}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: FONT,
        width,
        height,
        boxSizing: "border-box",
      }}
    >
      {/* top: issue kicker, title, badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", opacity: inK }}>
        <div>
          <div style={{ fontSize: 24 * s, letterSpacing: 4 * s, color: P.yellow, textShadow: `${2 * s}px ${2 * s}px 0 ${P.ink}` }}>ISSUE #51 // NEON BAY</div>
          <div
            style={{
              fontSize: 76 * s,
              lineHeight: 0.95,
              fontStyle: "italic",
              color: "#FFFFFF",
              WebkitTextStroke: `${3 * s}px ${P.ink}`,
              textShadow: `${6 * s}px ${6 * s}px 0 ${P.ink}`,
              transform: "rotate(-3deg)",
              marginTop: 8 * s,
            }}
          >
            SKYLINE
            <br />
            GUARDIAN
          </div>
        </div>
        <div
          style={{
            background: P.yellow,
            border: `${4 * s}px solid ${P.ink}`,
            boxShadow: `${6 * s}px ${6 * s}px 0 ${P.ink}`,
            padding: `${10 * s}px ${18 * s}px`,
            fontSize: 26 * s,
            color: P.ink,
            letterSpacing: 2 * s,
            transform: "rotate(2deg)",
          }}
        >
          COMICFORGE // 51
        </div>
      </div>

      {/* bottom: narration caption box + credit */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14 * s }}>
        <div
          style={{
            background: P.newsprint,
            border: `${4 * s}px solid ${P.ink}`,
            boxShadow: `${7 * s}px ${7 * s}px 0 ${P.ink}`,
            padding: `${16 * s}px ${22 * s}px`,
            maxWidth: 820 * s,
            opacity: inK,
          }}
        >
          <div style={{ fontSize: 36 * s, lineHeight: 1.12, color: P.ink, textTransform: "uppercase", letterSpacing: 1 * s }}>{quote}</div>
          <div style={{ fontSize: 18 * s, marginTop: 10 * s, color: P.magenta, letterSpacing: 3 * s, fontFamily: "'Courier New', monospace", fontWeight: 700 }}>
            CEL-SHADED 3D // INK HULL // BEN-DAY CMYK
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "flex-end" }}>
          <div
            style={{
              fontSize: 22 * s,
              color: "#FFFFFF",
              background: P.ink,
              padding: `${6 * s}px ${12 * s}px`,
              letterSpacing: 3 * s,
              opacity: 0.3 + 0.7 * capK,
            }}
          >
            TO BE CONTINUED...
          </div>
          <div style={{ fontSize: 20 * s, color: "#FFFFFF", letterSpacing: 2 * s, textShadow: `${2 * s}px ${2 * s}px 0 ${P.ink}` }}>Creator: AUDIRA</div>
        </div>
      </div>
    </div>
  );
};
