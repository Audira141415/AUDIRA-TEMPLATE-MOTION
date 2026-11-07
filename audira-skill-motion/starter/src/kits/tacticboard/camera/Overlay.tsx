// TACTICBOARD overlay — coach-board HUD: score bug + match clock, formation chips, step card, credit.
// All text lives inside the 9:16 safe zone (top 180 px / bottom 380 px of 1080x1920 kept clear).
import React from "react";
import { TACTIC_PALETTE as P } from "../lib/palette";
import { BEATS, beatIndex, clamp } from "../core/motion";

const STEPS = [
  { tag: "STEP 1/3 · SWITCH", text: "Two quick passes pull the block left, then the ball is switched to the right winger." },
  { tag: "STEP 2/3 · OVERLAP", text: "The winger drags the full-back inside; our right-back overlaps into the empty lane." },
  { tag: "STEP 3/3 · NEAR POST", text: "Low cross across the six-yard box. The striker attacks the near post and finishes." },
  { tag: "REPLAY · 5 PASSES, 6 SECONDS", text: "One overload, one third-man run. The whole move traced in gold." },
];

export const TacticOverlay: React.FC<{ t: number; height: number }> = ({ t, height }) => {
  const s = height / 1920;
  const fade = clamp(t / 0.6);
  const scored = t >= BEATS.goal;
  const flash = scored ? Math.max(0, 1 - (t - BEATS.goal) / 1.4) : 0;
  const secs = 4 + Math.floor(t);
  const clock = `78:${String(secs).padStart(2, "0")}`;
  const b = beatIndex(t);
  const step = STEPS[b];
  const stepIn = clamp((t - [0, 3.0, 6.0, 7.8][b]) / 0.35);
  const mono = "'JetBrains Mono', 'Consolas', monospace";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        color: P.hud,
      }}
    >
      {/* TOP (starts below the 180 px reserved band) */}
      <div style={{ position: "absolute", top: 196 * s, left: 56 * s, right: 56 * s, opacity: fade }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* score bug */}
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              borderRadius: 10 * s,
              overflow: "hidden",
              boxShadow: `0 ${8 * s}px ${24 * s}px rgba(0,0,0,0.45)`,
              fontWeight: 800,
              fontSize: 26 * s,
              letterSpacing: 1 * s,
            }}
          >
            <div style={{ background: P.home, color: "#fff", padding: `${10 * s}px ${16 * s}px` }}>HBR</div>
            <div
              style={{
                background: scored ? `rgba(255,201,74,${0.85 + flash * 0.15})` : "rgba(8,12,18,0.9)",
                color: scored ? "#1A1206" : "#fff",
                padding: `${10 * s}px ${18 * s}px`,
                fontFamily: mono,
              }}
            >
              {scored ? "2 – 1" : "1 – 1"}
            </div>
            <div style={{ background: P.away, color: "#fff", padding: `${10 * s}px ${16 * s}px` }}>VLY</div>
            <div style={{ background: "rgba(8,12,18,0.9)", padding: `${10 * s}px ${16 * s}px`, fontFamily: mono, color: P.lane }}>{clock}</div>
          </div>
          <div
            style={{
              background: "rgba(8,12,18,0.82)",
              border: `${2 * s}px solid ${P.lane}`,
              padding: `${8 * s}px ${16 * s}px`,
              borderRadius: 6 * s,
              fontSize: 22 * s,
              fontWeight: 800,
              letterSpacing: 2 * s,
              fontFamily: mono,
            }}
          >
            TACTICBOARD // 46
          </div>
        </div>

        <div style={{ marginTop: 26 * s, fontSize: 22 * s, letterSpacing: 4 * s, color: P.lane, fontWeight: 700, textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
          ● MATCH ANALYSIS // RIGHT-FLANK OVERLOAD
        </div>
        <div
          style={{
            fontSize: 64 * s,
            fontWeight: 900,
            lineHeight: 1.04,
            letterSpacing: -0.5 * s,
            color: "#fff",
            textShadow: `0 ${4 * s}px ${18 * s}px rgba(0,0,0,0.75)`,
            marginTop: 6 * s,
          }}
        >
          THE THIRD-MAN RUN
        </div>
        <div style={{ display: "flex", gap: 10 * s, marginTop: 14 * s, fontFamily: mono, fontSize: 20 * s, fontWeight: 700 }}>
          <span style={{ background: P.home, color: "#fff", padding: `${4 * s}px ${12 * s}px`, borderRadius: 4 * s }}>4-3-3</span>
          <span style={{ color: "rgba(255,255,255,0.7)", padding: `${4 * s}px 0` }}>vs</span>
          <span style={{ background: P.away, color: "#fff", padding: `${4 * s}px ${12 * s}px`, borderRadius: 4 * s }}>4-4-2</span>
        </div>
      </div>

      {/* GOAL flash */}
      {flash > 0 && (
        <div
          style={{
            position: "absolute",
            top: 720 * s,
            width: "100%",
            textAlign: "center",
            fontSize: 150 * s * (1 + (1 - flash) * 0.15),
            fontWeight: 900,
            letterSpacing: 12 * s,
            color: P.goalGold,
            opacity: flash,
            textShadow: `0 0 ${40 * s}px rgba(255,201,74,0.8), 0 ${6 * s}px ${20 * s}px rgba(0,0,0,0.7)`,
          }}
        >
          GOAL
        </div>
      )}

      {/* BOTTOM (ends above the 380 px reserved band) */}
      <div style={{ position: "absolute", bottom: 400 * s, left: 56 * s, right: 56 * s, opacity: fade }}>
        <div
          style={{
            background: "rgba(7,11,16,0.86)",
            borderLeft: `${6 * s}px solid ${b === 3 ? P.goalGold : P.lane}`,
            borderRadius: 8 * s,
            padding: `${18 * s}px ${24 * s}px`,
            transform: `translateY(${(1 - stepIn) * 16 * s}px)`,
            opacity: 0.4 + 0.6 * stepIn,
          }}
        >
          <div style={{ fontFamily: mono, fontSize: 20 * s, letterSpacing: 3 * s, color: b === 3 ? P.goalGold : P.lane, fontWeight: 700 }}>{step.tag}</div>
          <div style={{ fontSize: 30 * s, lineHeight: 1.35, marginTop: 8 * s, color: "#F4F7FA", fontWeight: 600 }}>"{step.text}"</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 14 * s,
            fontFamily: mono,
            fontSize: 18 * s,
            letterSpacing: 2 * s,
            color: "rgba(232,255,240,0.7)",
          }}
        >
          <span>FICTIONAL TEAMS · TELESTRATOR VIEW</span>
          <span>Creator: AUDIRA</span>
        </div>
      </div>
    </div>
  );
};
