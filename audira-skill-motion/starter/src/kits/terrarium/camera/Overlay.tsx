// TERRARIUM overlay — quiet nature-journal HUD: time-of-day clock with a day arc, caption per phase, credit.
// Text stays inside the 9:16 safe zone (top 180 / bottom 380 px of 1920).
import React from "react";
import { TERRA_PALETTE as P } from "../lib/palette";
import { clamp, dayState } from "../core/motion";

const CAPTIONS = [
  { at: 0, tag: "MORNING", text: "Sealed in glass, one small jar makes its own weather." },
  { at: 3.2, tag: "MIDDAY", text: "Leaves breathe out water. It beads on the cool glass..." },
  { at: 6.6, tag: "DUSK", text: "...runs back down the walls and waters the moss again." },
  { at: 9.3, tag: "NIGHT", text: "When the light goes, the tiny mushrooms take over." },
];

export const TerraOverlay: React.FC<{ t: number; height: number }> = ({ t, height }) => {
  const s = height / 1920;
  const fade = clamp(t / 0.6);
  const day = dayState(t);
  let i = 0;
  CAPTIONS.forEach((c, k) => {
    if (t >= c.at) i = k;
  });
  const cap = CAPTIONS[i];
  const capIn = clamp((t - cap.at) / 0.4);
  const serif = "'Georgia', 'Times New Roman', serif";
  const mono = "'JetBrains Mono', 'Consolas', monospace";
  const card = { background: "rgba(20,24,18,0.62)", border: "1px solid rgba(245,241,232,0.22)", borderRadius: 12 * s };
  const arc = clamp(t / 12);
  const sunCol = day.night > 0.5 ? "#BFD2FF" : "#FFD27A";

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", color: P.hud, fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }}>
      <div style={{ position: "absolute", top: 196 * s, left: 56 * s, right: 56 * s, opacity: fade }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ ...card, padding: `${14 * s}px ${20 * s}px` }}>
            <div style={{ fontSize: 20 * s, letterSpacing: 4 * s, color: P.fernTip, fontWeight: 700 }}>● LIVING ECOSYSTEM // CLOSED GLASS JAR</div>
            <div style={{ fontSize: 60 * s, fontFamily: serif, fontStyle: "italic", fontWeight: 700, lineHeight: 1.05, marginTop: 6 * s }}>A World in a Jar</div>
          </div>
          <div style={{ ...card, border: `${2 * s}px solid ${P.fernTip}`, padding: `${8 * s}px ${16 * s}px`, fontSize: 22 * s, fontWeight: 800, letterSpacing: 2 * s, fontFamily: mono }}>
            TERRARIUM // 62
          </div>
        </div>
        {/* clock + day arc */}
        <div style={{ ...card, display: "flex", alignItems: "center", gap: 16 * s, marginTop: 16 * s, padding: `${10 * s}px ${18 * s}px`, width: 520 * s }}>
          <div style={{ fontFamily: mono, fontSize: 40 * s, fontWeight: 800 }}>{day.clock}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: mono, fontSize: 17 * s, letterSpacing: 3 * s, color: "rgba(245,241,232,0.75)" }}>{day.label}</div>
            <div style={{ position: "relative", height: 10 * s, marginTop: 8 * s, borderRadius: 5 * s, background: "linear-gradient(90deg,#F2D3AE,#CFE2EA 45%,#D98A57 72%,#0D1426)" }}>
              <div
                style={{
                  position: "absolute",
                  left: `calc(${arc * 100}% - ${9 * s}px)`,
                  top: -4 * s,
                  width: 18 * s,
                  height: 18 * s,
                  borderRadius: 9 * s,
                  background: sunCol,
                  boxShadow: `0 0 ${14 * s}px ${sunCol}`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 400 * s, left: 56 * s, right: 56 * s, opacity: fade }}>
        <div
          style={{
            ...card,
            borderLeft: `${6 * s}px solid ${day.night > 0.5 ? P.glow : P.fernTip}`,
            padding: `${18 * s}px ${24 * s}px`,
            transform: `translateY(${(1 - capIn) * 14 * s}px)`,
            opacity: 0.4 + 0.6 * capIn,
          }}
        >
          <div style={{ fontFamily: mono, fontSize: 20 * s, letterSpacing: 3 * s, color: day.night > 0.5 ? P.glow : P.fernTip, fontWeight: 700 }}>{cap.tag}</div>
          <div style={{ fontSize: 32 * s, fontFamily: serif, fontStyle: "italic", lineHeight: 1.35, marginTop: 8 * s }}>"{cap.text}"</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 * s, fontFamily: mono, fontSize: 18 * s, letterSpacing: 2 * s }}>
          <span style={{ ...card, padding: `${4 * s}px ${10 * s}px` }}>MACRO · 12 HOURS IN 12 SECONDS</span>
          <span style={{ ...card, padding: `${4 * s}px ${10 * s}px` }}>Creator: AUDIRA</span>
        </div>
      </div>
    </div>
  );
};
