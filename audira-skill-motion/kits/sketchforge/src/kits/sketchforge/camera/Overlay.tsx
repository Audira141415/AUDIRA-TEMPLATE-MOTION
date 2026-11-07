import React from "react";
import { SKETCH_PALETTE as P } from "../lib/palette";
import { BEAT } from "../core/motion";

const HAND = "'Segoe Print', 'Bradley Hand', 'Comic Sans MS', cursive";
const MONO = "'Courier New', monospace";

const STAGES: { label: string; at: number }[] = [
  { label: "SKETCH", at: 0 },
  { label: "WIRE", at: BEAT.extrude[0] },
  { label: "CLAY", at: BEAT.clay[0] },
  { label: "COLOUR", at: BEAT.colour[0] },
  { label: "LIFT", at: BEAT.lift[0] },
];

export const SketchforgeOverlay: React.FC<{ f: number; width: number; height: number }> = ({ f, width, height }) => {
  const s = height / 1920;
  const t = f / 60;
  const inK = Math.min(1, f / 30);
  let active = 0;
  STAGES.forEach((st, i) => {
    if (t >= st.at) active = i;
  });
  const quote =
    t < BEAT.extrude[0] ? "Every object starts as a few honest pencil lines." : t < BEAT.clay[0] ? "The lines peel off the page and find their depth." : t < BEAT.colour[0] ? "Clay fills the wire — now it has weight." : t < BEAT.lift[0] ? "One accent colour, and the drawing becomes a home." : "From graphite to something you could walk into.";
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width,
        height,
        pointerEvents: "none",
        boxSizing: "border-box",
        padding: `${180 * s}px ${56 * s}px ${380 * s}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        opacity: inK,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ background: "rgba(38,38,42,0.82)", padding: `${12 * s}px ${18 * s}px`, borderLeft: `${5 * s}px solid ${P.accent}` }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 21 * s, letterSpacing: 4 * s, color: P.paper, textShadow: `0 ${2 * s}px ${6 * s}px rgba(0,0,0,0.6)` }}>STUDY NO.63 // HB → 3D</div>
          <div style={{ fontFamily: HAND, fontSize: 64 * s, lineHeight: 1.05, color: P.paperWhite, marginTop: 6 * s, textShadow: `0 ${3 * s}px ${10 * s}px rgba(0,0,0,0.55)` }}>
            From Line
            <br />
            to Life
          </div>
        </div>
        <div style={{ border: `${2 * s}px solid ${P.accent}`, background: "rgba(38,38,42,0.85)", color: P.paperWhite, fontFamily: MONO, fontWeight: 700, fontSize: 21 * s, padding: `${8 * s}px ${14 * s}px`, letterSpacing: 2 * s }}>
          SKETCHFORGE // 63
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 * s }}>
        <div style={{ display: "flex", gap: 8 * s }}>
          {STAGES.map((st, i) => (
            <div
              key={st.label}
              style={{
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: 17 * s,
                letterSpacing: 2 * s,
                padding: `${5 * s}px ${10 * s}px`,
                color: i === active ? P.paperWhite : i < active ? P.paper : "rgba(243,235,221,0.45)",
                background: i === active ? P.accent : "rgba(38,38,42,0.7)",
                border: `${1.5 * s}px solid ${i <= active ? P.accent : "rgba(243,235,221,0.3)"}`,
              }}
            >
              {st.label}
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(251,247,239,0.94)", borderLeft: `${6 * s}px solid ${P.accent}`, padding: `${14 * s}px ${20 * s}px`, maxWidth: 820 * s, boxShadow: `0 ${6 * s}px ${18 * s}px rgba(0,0,0,0.3)` }}>
          <div style={{ fontFamily: HAND, fontSize: 30 * s, lineHeight: 1.3, color: P.graphite }}>{quote}</div>
          <div style={{ fontFamily: MONO, fontSize: 15 * s, letterSpacing: 2 * s, color: P.graphiteMid, marginTop: 6 * s, fontWeight: 700 }}>GRAPHITE · PAPER CREAM · ONE ACCENT</div>
        </div>
        <div style={{ textAlign: "right", fontFamily: MONO, fontWeight: 700, fontSize: 18 * s, color: P.paper, letterSpacing: 2 * s }}>Creator: AUDIRA</div>
      </div>
    </div>
  );
};
