import React from "react";
import { GLITCH_PALETTE as P } from "../lib/palette";
import { BEAT, GlitchState } from "../core/motion";

const MONO = "'Courier New', 'Lucida Console', monospace";
const SANS = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

const tc = (t: number) => {
  const fr = Math.floor((t % 1) * 60);
  return `00:00:${String(Math.floor(t)).padStart(2, "0")}:${String(fr).padStart(2, "0")}`;
};

export const GlitchforgeOverlay: React.FC<{ s: GlitchState; width: number; height: number }> = ({ s, width, height }) => {
  const k = height / 1920;
  const t = s.t;
  const inK = Math.min(1, t / 0.5);
  const err = s.hud > 0.35;
  const jx = err ? (((s.seed * 37) % 7) - 3) * 2 * k * s.hud : 0;
  const status = s.lost > 0 ? "NO SIGNAL" : t >= BEAT.snap ? "SIGNAL RESTORED" : err ? `ERR 0x${Math.floor(s.seed * 211).toString(16).toUpperCase().padStart(4, "0")}` : "SIGNAL OK";
  const quote = t < BEAT.creep[0] ? "A perfect object. A perfect feed." : t < BEAT.lost[0] ? "Then the data starts to remember the wrong frames." : t < BEAT.snap ? "…" : "Snap. Clean again — but you saw what's underneath.";
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width,
        height,
        pointerEvents: "none",
        boxSizing: "border-box",
        padding: `${180 * k}px ${56 * k}px ${380 * k}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        opacity: inK,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", transform: `translateX(${jx}px)` }}>
        <div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 21 * k, letterSpacing: 4 * k, color: P.ink }}>
            <span style={{ color: P.signalRed }}>● REC</span> FEED 68 · {tc(t)}
          </div>
          <div style={{ position: "relative", fontFamily: SANS, fontWeight: 900, fontSize: 84 * k, lineHeight: 0.95, letterSpacing: -2 * k, marginTop: 8 * k, color: P.ink }}>
            {err && (
              <>
                <div style={{ position: "absolute", left: 5 * k * s.hud, top: 0, color: P.signalRed, mixBlendMode: "multiply" }}>
                  DATA
                  <br />
                  ROT
                </div>
                <div style={{ position: "absolute", left: -5 * k * s.hud, top: 2 * k, color: P.cyan, mixBlendMode: "multiply" }}>
                  DATA
                  <br />
                  ROT
                </div>
              </>
            )}
            <div style={{ position: "relative" }}>
              DATA
              <br />
              ROT
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ background: P.ink, color: "#FFFFFF", fontFamily: MONO, fontWeight: 700, fontSize: 21 * k, padding: `${8 * k}px ${14 * k}px`, letterSpacing: 2 * k, borderLeft: `${5 * k}px solid ${P.signalGreen}` }}>GLITCHFORGE // 68</div>
          <div style={{ marginTop: 10 * k, fontFamily: MONO, fontWeight: 700, fontSize: 20 * k, color: s.lost > 0 || err ? P.signalRed : t >= BEAT.snap ? "#0E9F5A" : P.ink }}>{status}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 * k }}>
        <div style={{ background: "rgba(255,255,255,0.9)", borderLeft: `${6 * k}px solid ${P.signalRed}`, padding: `${14 * k}px ${20 * k}px`, maxWidth: 820 * k, boxShadow: `0 ${6 * k}px ${20 * k}px rgba(0,0,0,0.12)` }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32 * k, lineHeight: 1.2, color: P.ink }}>{quote}</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 15 * k, letterSpacing: 2 * k, color: "#5A5D66", marginTop: 6 * k }}>RGB SPLIT · MACROBLOCK · DATAMOSH · PIXEL SORT</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontWeight: 700, fontSize: 18 * k, color: P.ink, letterSpacing: 2 * k }}>
          <span>BITRATE {s.lost > 0 ? "0.0" : (48 - 40 * Math.min(1, s.hud)).toFixed(1)} Mb/s</span>
          <span>Creator: AUDIRA</span>
        </div>
      </div>
    </div>
  );
};
