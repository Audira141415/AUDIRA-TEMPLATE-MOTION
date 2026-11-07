// DISASTERSIM overlay — calm geoscience HUD: magnitude readout + seismograph, warning-level ramp,
// wave ETA, stage caption and credit. Text stays inside the 9:16 safe zone (top 180 / bottom 380 px of 1920).
import React from "react";
import { DISASTER_PALETTE as P } from "../lib/palette";
import { clamp, EVENT, magnitude, prng, warnLevel } from "../core/motion";

const LEVELS = [
  { name: "MONITORING", col: P.lvlInfo },
  { name: "ADVISORY", col: P.lvlAdvisory },
  { name: "WARNING", col: P.lvlWarning },
  { name: "MOVE TO HIGH GROUND", col: P.lvlEvac },
];

const CAPTIONS = [
  { tag: "1 · LOCKED FAULT", text: "Two plates press together. Stress builds for centuries where they are stuck." },
  { tag: "2 · RUPTURE", text: "The fault slips in seconds. The seafloor jumps and lifts the water above it." },
  { tag: "3 · THE WAVE TRAVELS", text: "In deep water the wave is low and fast. Near the coast it slows and grows taller." },
  { tag: "4 · ACT EARLY", text: "Strong shaking near the coast is the warning. Walk to high ground, not to the beach." },
];

const SEISMO = (() => {
  const r = prng(4807);
  return Array.from({ length: 120 }, () => r() * 2 - 1);
})();

export const DisasterOverlay: React.FC<{ t: number; height: number }> = ({ t, height }) => {
  const s = height / 1920;
  const fade = clamp(t / 0.6);
  const lvl = warnLevel(t);
  const stage = t < EVENT.slip ? 0 : t < 4.6 ? 1 : t < 7.6 ? 2 : 3;
  const stageIn = clamp((t - [0, EVENT.slip, 4.6, 7.6][stage]) / 0.4);
  const mag = magnitude(t);
  const etaMin = Math.max(0, 18 * (1 - clamp((t - EVENT.slip) / (EVENT.arrive - EVENT.slip))));
  const eta = t < EVENT.slip ? "--:--" : `${String(Math.floor(etaMin)).padStart(2, "0")}:${String(Math.floor((etaMin % 1) * 60)).padStart(2, "0")}`;
  const mono = "'JetBrains Mono', 'Consolas', monospace";

  // seismograph: quiet before the slip, big burst after, decaying
  const W = 300;
  const Hh = 64;
  const pts = SEISMO.map((n, i) => {
    const tt = t - (SEISMO.length - i) * 0.03;
    const d = tt - EVENT.slip;
    const amp = d < 0 ? 0.06 : Math.min(1, d * 6) * Math.exp(-d * 0.6);
    return `${(i / (SEISMO.length - 1)) * W},${Hh / 2 + n * amp * (Hh / 2 - 2)}`;
  }).join(" ");

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif", color: P.hud }}>
      <div style={{ position: "absolute", top: 196 * s, left: 56 * s, right: 56 * s, opacity: fade }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 22 * s, letterSpacing: 4 * s, color: P.lvlInfo, fontWeight: 700 }}>● GEOHAZARD LAB // SUBDUCTION MARGIN</div>
            <div style={{ fontSize: 60 * s, fontWeight: 900, lineHeight: 1.05, marginTop: 8 * s, textShadow: "0 4px 18px rgba(0,0,0,0.7)" }}>
              HOW A TSUNAMI
              <br />
              IS BORN
            </div>
          </div>
          <div
            style={{
              background: "rgba(8,16,22,0.85)",
              border: `${2 * s}px solid ${P.lvlInfo}`,
              padding: `${8 * s}px ${16 * s}px`,
              borderRadius: 6 * s,
              fontSize: 22 * s,
              fontWeight: 800,
              letterSpacing: 2 * s,
              fontFamily: mono,
            }}
          >
            DISASTERSIM // 48
          </div>
        </div>

        {/* instrument row */}
        <div style={{ display: "flex", gap: 14 * s, marginTop: 22 * s }}>
          <div style={{ background: "rgba(8,16,22,0.82)", borderRadius: 10 * s, padding: `${12 * s}px ${16 * s}px`, border: "1px solid rgba(159,227,255,0.25)" }}>
            <div style={{ fontFamily: mono, fontSize: 18 * s, letterSpacing: 2 * s, color: "rgba(234,244,248,0.7)" }}>MAGNITUDE</div>
            <div style={{ fontFamily: mono, fontSize: 52 * s, fontWeight: 800, color: mag > 0.1 ? LEVELS[Math.max(1, lvl)].col : P.hud }}>
              M {mag.toFixed(1)}
            </div>
          </div>
          <div style={{ flex: 1, background: "rgba(8,16,22,0.82)", borderRadius: 10 * s, padding: `${12 * s}px ${16 * s}px`, border: "1px solid rgba(159,227,255,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 18 * s, letterSpacing: 2 * s, color: "rgba(234,244,248,0.7)" }}>
              <span>SEISMOGRAPH</span>
              <span>WAVE ETA {eta}</span>
            </div>
            <svg width={W * s * 1.55} height={Hh * s * 1.1} viewBox={`0 0 ${W} ${Hh}`} preserveAspectRatio="none" style={{ display: "block", marginTop: 4 * s }}>
              <polyline points={pts} fill="none" stroke={P.ring} strokeWidth={1.6} />
            </svg>
          </div>
        </div>

        {/* warning ramp */}
        <div style={{ display: "flex", gap: 6 * s, marginTop: 14 * s }}>
          {LEVELS.map((L, i) => (
            <div
              key={L.name}
              style={{
                flex: i === 3 ? 2.2 : 1,
                height: 44 * s,
                borderRadius: 6 * s,
                background: i <= lvl ? L.col : "rgba(8,16,22,0.7)",
                opacity: i === lvl ? 1 : i < lvl ? 0.55 : 0.8,
                color: i <= lvl ? "#0B141C" : "rgba(234,244,248,0.55)",
                fontFamily: mono,
                fontWeight: 800,
                fontSize: 15 * s,
                letterSpacing: 1 * s,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${L.col}`,
              }}
            >
              {L.name}
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 400 * s, left: 56 * s, right: 56 * s, opacity: fade }}>
        <div
          style={{
            background: "rgba(8,16,22,0.86)",
            borderLeft: `${6 * s}px solid ${LEVELS[lvl].col}`,
            borderRadius: 8 * s,
            padding: `${18 * s}px ${24 * s}px`,
            transform: `translateY(${(1 - stageIn) * 14 * s}px)`,
            opacity: 0.4 + 0.6 * stageIn,
          }}
        >
          <div style={{ fontFamily: mono, fontSize: 20 * s, letterSpacing: 3 * s, color: LEVELS[lvl].col, fontWeight: 700 }}>{CAPTIONS[stage].tag}</div>
          <div style={{ fontSize: 30 * s, lineHeight: 1.35, marginTop: 8 * s, fontWeight: 600 }}>"{CAPTIONS[stage].text}"</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 * s, fontFamily: mono, fontSize: 18 * s, letterSpacing: 2 * s, color: "rgba(234,244,248,0.65)" }}>
          <span>FICTIONAL SCENARIO · EDUCATIONAL MODEL</span>
          <span>Creator: AUDIRA</span>
        </div>
      </div>
    </div>
  );
};
