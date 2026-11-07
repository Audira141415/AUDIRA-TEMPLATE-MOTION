// ANATOMIX overlay — clinical HUD: vitals with a live ECG trace, projected anatomy labels with leader lines,
// stage caption and disclaimer. Everything stays in the 9:16 safe zone (top 180 / bottom 380 px of 1920).
import React from "react";
import { ANATOMY_PALETTE as P } from "../lib/palette";
import { ANCHORS, BPM, clamp, seg, TL } from "../core/motion";
import { projectToScreen } from "./rig";

const CAPTIONS = [
  { tag: "HOOK", text: "About 100,000 beats a day. Two pumps share every single one." },
  { tag: "RIGHT HEART · BLUE", text: "Oxygen-poor blood returns from the body and is pushed to the lungs." },
  { tag: "LEFT HEART · RED", text: "Fresh, oxygen-rich blood comes back from the lungs and is pushed to the body." },
  { tag: "ONE BEAT, TWO CIRCUITS", text: "Both sides squeeze together: lungs and body are fed at the same moment." },
];

/** ECG-like trace (stylised PQRST), pure function of phase. */
const ecg = (ph: number) => {
  const g = (c: number, w: number, a: number) => a * Math.exp(-Math.pow((ph - c) / w, 2));
  return g(0.1, 0.03, 0.12) - g(0.18, 0.008, 0.15) + g(0.2, 0.01, 1) - g(0.225, 0.012, 0.3) + g(0.42, 0.05, 0.25);
};

export const AnatomyOverlay: React.FC<{ t: number; width: number; height: number }> = ({ t, width, height }) => {
  const s = height / 1920;
  const fade = clamp(t / 0.6);
  const stage = t < 2.4 ? 0 : t < TL.red ? 1 : t < TL.payoff ? 2 : 3;
  const stageIn = clamp((t - [0, 2.4, TL.red, TL.payoff][stage]) / 0.4);
  const mono = "'JetBrains Mono', 'Consolas', monospace";
  const card = { background: "rgba(3,20,26,0.82)", border: "1px solid rgba(63,224,208,0.3)", borderRadius: 10 * s };

  // ECG: 3 s window scrolling
  const EW = 320;
  const EH = 60;
  const hz = BPM / 60;
  const pts = Array.from({ length: 160 }, (_, i) => {
    const tt = t - 3 + (i / 159) * 3;
    const ph = ((tt * hz) % 1 + 1) % 1;
    return `${(i / 159) * EW},${EH * 0.7 - ecg(ph) * EH * 0.6}`;
  }).join(" ");

  const labelX = { left: 56 * s, right: width - 56 * s };
  const safeTop = 620 * s;
  const safeBot = height - 640 * s;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif", color: P.hud }}>
      {/* TOP */}
      <div style={{ position: "absolute", top: 196 * s, left: 56 * s, right: 56 * s, opacity: fade }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 22 * s, letterSpacing: 4 * s, color: P.holo, fontWeight: 700 }}>● CARDIAC IMAGING // 4-CHAMBER VIEW</div>
            <div style={{ fontSize: 64 * s, fontWeight: 900, lineHeight: 1.04, marginTop: 8 * s, textShadow: "0 4px 18px rgba(0,0,0,0.6)" }}>THE DOUBLE PUMP</div>
          </div>
          <div style={{ ...card, border: `${2 * s}px solid ${P.holo}`, padding: `${8 * s}px ${16 * s}px`, fontSize: 22 * s, fontWeight: 800, letterSpacing: 2 * s, fontFamily: mono }}>
            ANATOMIX // 56
          </div>
        </div>
        <div style={{ display: "flex", gap: 14 * s, marginTop: 20 * s }}>
          <div style={{ ...card, padding: `${10 * s}px ${16 * s}px`, fontFamily: mono }}>
            <div style={{ fontSize: 17 * s, letterSpacing: 2 * s, color: "rgba(230,251,248,0.65)" }}>HEART RATE</div>
            <div style={{ fontSize: 44 * s, fontWeight: 800, color: P.oxy }}>
              {BPM}
              <span style={{ fontSize: 20 * s, color: "rgba(230,251,248,0.7)" }}> BPM</span>
            </div>
          </div>
          <div style={{ ...card, flex: 1, padding: `${10 * s}px ${16 * s}px`, fontFamily: mono }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17 * s, letterSpacing: 2 * s, color: "rgba(230,251,248,0.65)" }}>
              <span>ECG · LEAD II (STYLISED)</span>
              <span>SpO₂ 98%</span>
            </div>
            <svg width={EW * 1.6 * s} height={EH * s} viewBox={`0 0 ${EW} ${EH}`} preserveAspectRatio="none" style={{ display: "block", marginTop: 4 * s }}>
              <polyline points={pts} fill="none" stroke={P.holo} strokeWidth={2} />
            </svg>
          </div>
        </div>
      </div>

      {/* projected anatomy labels */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {ANCHORS.map((a, i) => {
          const o = seg(t, TL.labels[i], TL.labels[i] + 0.5);
          if (o <= 0.01) return null;
          const p = projectToScreen(t, a.p, width, height);
          const lx = a.side < 0 ? labelX.left + 250 * s : labelX.right - 250 * s;
          const ly = clamp(p.y, safeTop + i * 10 * s, safeBot);
          return (
            <g key={a.name} opacity={o}>
              <polyline points={`${p.x},${p.y} ${(p.x + lx) / 2},${ly} ${lx},${ly}`} fill="none" stroke={P.holoSoft} strokeWidth={2 * s} />
              <circle cx={p.x} cy={p.y} r={7 * s} fill={a.color} stroke="#FFFFFF" strokeWidth={2 * s} />
            </g>
          );
        })}
      </svg>
      {ANCHORS.map((a, i) => {
        const o = seg(t, TL.labels[i], TL.labels[i] + 0.5);
        if (o <= 0.01) return null;
        const p = projectToScreen(t, a.p, width, height);
        const ly = clamp(p.y, safeTop + i * 10 * s, safeBot);
        return (
          <div
            key={a.name}
            style={{
              position: "absolute",
              top: ly - 34 * s,
              left: a.side < 0 ? labelX.left : undefined,
              right: a.side > 0 ? width - labelX.right : undefined,
              width: 250 * s,
              textAlign: a.side < 0 ? "left" : "right",
              opacity: o,
              ...card,
              borderLeft: a.side < 0 ? `${5 * s}px solid ${a.color}` : card.border,
              borderRight: a.side > 0 ? `${5 * s}px solid ${a.color}` : card.border,
              padding: `${8 * s}px ${12 * s}px`,
            }}
          >
            <div style={{ fontSize: 20 * s, fontWeight: 800, letterSpacing: 1 * s }}>{a.name}</div>
            <div style={{ fontSize: 16 * s, fontFamily: mono, color: "rgba(230,251,248,0.7)" }}>{a.sub}</div>
          </div>
        );
      })}

      {/* BOTTOM */}
      <div style={{ position: "absolute", bottom: 400 * s, left: 56 * s, right: 56 * s, opacity: fade }}>
        <div
          style={{
            ...card,
            borderLeft: `${6 * s}px solid ${stage === 1 ? P.deoxy : stage === 2 ? P.oxy : P.holo}`,
            padding: `${18 * s}px ${24 * s}px`,
            transform: `translateY(${(1 - stageIn) * 14 * s}px)`,
            opacity: 0.4 + 0.6 * stageIn,
          }}
        >
          <div style={{ fontFamily: mono, fontSize: 20 * s, letterSpacing: 3 * s, color: P.holo, fontWeight: 700 }}>{CAPTIONS[stage].tag}</div>
          <div style={{ fontSize: 30 * s, lineHeight: 1.35, marginTop: 8 * s, fontWeight: 600 }}>"{CAPTIONS[stage].text}"</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 * s, fontFamily: mono, fontSize: 18 * s, letterSpacing: 2 * s, color: "rgba(230,251,248,0.6)" }}>
          <span>STYLISED MODEL · EDUCATIONAL ONLY</span>
          <span>Creator: AUDIRA</span>
        </div>
      </div>
    </div>
  );
};
