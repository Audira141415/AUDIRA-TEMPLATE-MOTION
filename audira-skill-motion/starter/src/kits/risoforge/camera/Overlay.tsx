import React from "react";
import { RISO_PALETTE as P } from "../lib/palette";
import { misregister } from "../core/motion";

const FONT = "'Arial Black', 'Segoe UI Black', Impact, sans-serif";
const MONO = "'Courier New', monospace";

const RegMark: React.FC<{ s: number; style: React.CSSProperties }> = ({ s, style }) => (
  <div style={{ position: "absolute", width: 34 * s, height: 34 * s, ...style }}>
    <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1.5 * s, background: P.ink }} />
    <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1.5 * s, background: P.ink }} />
    <div style={{ position: "absolute", inset: 8 * s, border: `${1.5 * s}px solid ${P.ink}`, borderRadius: "50%" }} />
  </div>
);

export const RisoforgeOverlay: React.FC<{ f: number; width: number; height: number }> = ({ f, width, height }) => {
  const s = height / 1920;
  const t = f / 60;
  const inK = Math.min(1, f / 30);
  const [px, py] = misregister(t, 0, 1);
  const [bx, by] = misregister(t, 1, 1);
  const quote = t < 4.6 ? "Three drums, one sheet of paper: the city prints itself flat." : t < 8.4 ? "Lift the layers and the zine becomes a street you can walk into." : "Yellow over pink, blue over yellow — the sun rises in overprint.";
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", width, height }}>
      <RegMark s={s} style={{ left: 30 * s, top: 120 * s }} />
      <RegMark s={s} style={{ right: 30 * s, top: 120 * s }} />
      <RegMark s={s} style={{ left: 30 * s, bottom: 300 * s }} />
      <RegMark s={s} style={{ right: 30 * s, bottom: 300 * s }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: `${180 * s}px ${60 * s}px ${380 * s}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
          opacity: inK,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22 * s, letterSpacing: 4 * s, color: P.ink }}>ZINE NO.53 // 3-DRUM PRINT</div>
            <div style={{ position: "relative", fontFamily: FONT, fontSize: 92 * s, lineHeight: 0.92, marginTop: 10 * s, letterSpacing: -2 * s }}>
              <div style={{ color: P.blue, mixBlendMode: "multiply", transform: `translate(${bx * 3 * s}px, ${by * 3 * s}px)` }}>
                SOFT
                <br />
                CITY
              </div>
              <div style={{ position: "absolute", left: 6 * s, top: 4 * s, color: P.fluoPink, mixBlendMode: "multiply", transform: `translate(${px * 3 * s}px, ${py * 3 * s}px)` }}>
                SOFT
                <br />
                CITY
              </div>
            </div>
          </div>
          <div style={{ background: P.yellow, color: P.ink, fontFamily: MONO, fontWeight: 700, fontSize: 22 * s, padding: `${8 * s}px ${14 * s}px`, mixBlendMode: "multiply", border: `${2 * s}px solid ${P.ink}` }}>
            RISOFORGE // 53
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 * s }}>
          <div style={{ background: "rgba(246,240,226,0.94)", border: `${2 * s}px dashed ${P.ink}`, padding: `${16 * s}px ${20 * s}px`, maxWidth: 820 * s }}>
            <div style={{ fontFamily: FONT, fontSize: 32 * s, lineHeight: 1.15, color: P.ink }}>{quote}</div>
            <div style={{ display: "flex", gap: 10 * s, marginTop: 12 * s, alignItems: "center" }}>
              {[P.fluoPink, P.blue, P.yellow].map((c) => (
                <div key={c} style={{ width: 26 * s, height: 26 * s, background: c, borderRadius: "50%", mixBlendMode: "multiply" }} />
              ))}
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 17 * s, color: P.ink, letterSpacing: 2 * s, marginLeft: 6 * s }}>FLUO PINK · BLUE · YELLOW // SOY INK</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontWeight: 700, fontSize: 18 * s, color: P.ink, letterSpacing: 2 * s }}>
            <span>EDITION 053/100 · STAPLE-BOUND</span>
            <span>Creator: AUDIRA</span>
          </div>
        </div>
      </div>
    </div>
  );
};
