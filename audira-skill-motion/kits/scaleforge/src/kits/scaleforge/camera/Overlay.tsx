// SCALEFORGE overlay — live order-of-magnitude readout, log gauge (10⁻³ … 10⁹ m), subject caption, credit.
// Cards are always dark glass so they read on both the white studio and deep space. Safe zones respected.
import React from "react";
import { SCALE_PALETTE as P } from "../lib/palette";
import { clamp, fmtLen, OBJECTS, sup, zoomAt } from "../core/motion";
import { frameHeightUnits } from "./rig";

const CAPTIONS = [
  "An ant: about 5 millimetres long. Start here.",
  "×350 — a person, 1.75 metres.",
  "×190 — a 330-metre skyscraper.",
  "×27 — a mountain 8.8 kilometres high.",
  "×1,450 — Earth, 12,742 kilometres across.",
  "×109 — the Sun. 109 Earths fit across its face.",
];
const STAGE_T = [0, 2.3, 4.1, 5.9, 7.8, 9.7];

export const ScaleOverlay: React.FC<{ t: number; height: number }> = ({ t, height }) => {
  const s = height / 1920;
  const z = zoomAt(t);
  const fade = clamp(t / 0.5);
  const frameM = z.S * frameHeightUnits(t);
  const ex = Math.log10(frameM);
  let stage = 0;
  STAGE_T.forEach((st, i) => {
    if (t >= st) stage = i;
  });
  const stageIn = clamp((t - STAGE_T[stage]) / 0.35);
  const mono = "'JetBrains Mono', 'Consolas', monospace";
  const card = { background: "rgba(9,14,24,0.84)", borderRadius: 10 * s, border: "1px solid rgba(255,255,255,0.12)" };
  // gauge from 10^-3 to 10^10 m
  const g0 = -3;
  const g1 = 10;
  const gk = clamp((ex - g0) / (g1 - g0));

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif", color: P.inkLight }}>
      <div style={{ position: "absolute", top: 196 * s, left: 56 * s, right: 56 * s, opacity: fade }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ ...card, padding: `${14 * s}px ${20 * s}px` }}>
            <div style={{ fontSize: 20 * s, letterSpacing: 4 * s, color: P.accent, fontWeight: 700 }}>● LOG ZOOM // 13 ORDERS OF MAGNITUDE</div>
            <div style={{ fontSize: 60 * s, fontWeight: 900, lineHeight: 1.05, marginTop: 6 * s }}>HOW BIG IS BIG?</div>
          </div>
          <div
            style={{
              ...card,
              border: `${2 * s}px solid ${P.accent}`,
              padding: `${8 * s}px ${16 * s}px`,
              fontSize: 22 * s,
              fontWeight: 800,
              letterSpacing: 2 * s,
              fontFamily: mono,
            }}
          >
            SCALEFORGE // 49
          </div>
        </div>
        <div style={{ ...card, display: "inline-flex", alignItems: "baseline", gap: 14 * s, marginTop: 16 * s, padding: `${10 * s}px ${20 * s}px`, fontFamily: mono }}>
          <span style={{ fontSize: 20 * s, color: "rgba(232,238,246,0.7)", letterSpacing: 2 * s }}>FRAME</span>
          <span style={{ fontSize: 50 * s, fontWeight: 800 }}>
            10
            <sup style={{ fontSize: 28 * s, color: P.accent }}>{ex.toFixed(1)}</sup> m
          </span>
          <span style={{ fontSize: 24 * s, color: "rgba(232,238,246,0.75)" }}>≈ {fmtLen(frameM)}</span>
        </div>
      </div>

      {/* log gauge on the right edge (vertical, inside the safe band) */}
      <div style={{ position: "absolute", right: 40 * s, top: 560 * s, height: 860 * s, width: 70 * s, opacity: fade, fontFamily: mono }}>
        <div style={{ position: "absolute", left: 32 * s, top: 0, bottom: 0, width: 4 * s, background: "rgba(140,150,165,0.6)", borderRadius: 2 * s }} />
        {OBJECTS.map((o) => {
          const k = clamp((Math.log10(o.size) - g0) / (g1 - g0));
          return (
            <div key={o.key} style={{ position: "absolute", left: 0, top: (1 - k) * 860 * s - 10 * s, fontSize: 15 * s, color: "rgba(150,160,175,0.95)", width: 30 * s, textAlign: "right" }}>
              {sup(Math.floor(Math.log10(o.size)))}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 22 * s,
            top: (1 - gk) * 860 * s - 12 * s,
            width: 24 * s,
            height: 24 * s,
            borderRadius: 12 * s,
            background: P.accent,
            boxShadow: `0 0 ${16 * s}px ${P.accent}`,
          }}
        />
      </div>

      <div style={{ position: "absolute", bottom: 400 * s, left: 56 * s, right: 56 * s, opacity: fade }}>
        <div
          style={{
            ...card,
            borderLeft: `${6 * s}px solid ${P.accent}`,
            padding: `${18 * s}px ${24 * s}px`,
            transform: `translateY(${(1 - stageIn) * 14 * s}px)`,
            opacity: 0.4 + 0.6 * stageIn,
          }}
        >
          <div style={{ fontFamily: mono, fontSize: 20 * s, letterSpacing: 3 * s, color: P.accent, fontWeight: 700 }}>
            {OBJECTS[stage].name} · 10{sup(Math.floor(Math.log10(OBJECTS[stage].size)))} m
          </div>
          <div style={{ fontSize: 30 * s, lineHeight: 1.35, marginTop: 8 * s, fontWeight: 600 }}>"{CAPTIONS[stage]}"</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 * s, fontFamily: mono, fontSize: 18 * s, letterSpacing: 2 * s }}>
          <span style={{ ...card, padding: `${4 * s}px ${10 * s}px`, color: "rgba(232,238,246,0.75)" }}>SIZES ROUNDED · NOT TO SCALE IN DISTANCE</span>
          <span style={{ ...card, padding: `${4 * s}px ${10 * s}px`, color: "rgba(232,238,246,0.75)" }}>Creator: AUDIRA</span>
        </div>
      </div>
    </div>
  );
};
