import React from "react";
import { useVideoConfig } from "remotion";
import { ABYSS_PALETTE } from "../lib/palette";
import { depthMetres, smooth, zoneName } from "../core/motion";

/** Submersible HUD: depth counter, sonar ring, zone ticker, caption. Respects 9:16 safe zones (top 180 / bottom 380 px @1920). */
export const AbyssforgeOverlay: React.FC<{ t: number }> = ({ t }) => {
  const { width, height } = useVideoConfig();
  const s = height / 1920;
  const fade = smooth(0.1, 0.8, t);
  const m = depthMetres(t);
  const zone = zoneName(m);
  const pressure = 1 + m / 10;
  const temp = Math.max(1.6, 18 - m * 0.0075);
  const sweep = (t * 140) % 360;
  const captionIn = smooth(9.3, 10.1, t);
  const mono = "'Consolas', 'Courier New', monospace";

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", color: "#E6FBFF", fontFamily: "'Segoe UI', 'Inter', sans-serif", opacity: fade }}>
      {/* top block */}
      <div style={{ position: "absolute", top: 196 * s, left: 60 * s, right: 60 * s, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontFamily: mono, fontSize: 22 * s, letterSpacing: 5 * s, color: ABYSS_PALETTE.hudCyan, marginBottom: 10 * s }}>● DESCENT LOG // DIVE 052</div>
          <div style={{ fontSize: 64 * s, fontWeight: 800, lineHeight: 1.02, letterSpacing: -1 * s, textShadow: `0 0 ${24 * s}px rgba(56,246,255,0.35)` }}>
            The Light
            <br />
            Below
          </div>
        </div>
        <div style={{ border: `${2 * s}px solid ${ABYSS_PALETTE.hudCyan}`, background: ABYSS_PALETTE.hudInk, padding: `${10 * s}px ${18 * s}px`, borderRadius: 6 * s, fontFamily: mono, fontWeight: 700, fontSize: 22 * s, letterSpacing: 3 * s, color: ABYSS_PALETTE.hudCyan }}>
          ABYSSFORGE // 52
        </div>
      </div>

      {/* right-edge depth gauge + sonar (between safe zones) */}
      <div style={{ position: "absolute", right: 56 * s, top: 560 * s, width: 230 * s, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14 * s }}>
        <svg width={190 * s} height={190 * s} viewBox="-100 -100 200 200">
          <defs>
            <linearGradient id="abyssSweep" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={ABYSS_PALETTE.hudCyan} stopOpacity="0" />
              <stop offset="1" stopColor={ABYSS_PALETTE.hudCyan} stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <circle r="96" fill="rgba(2,10,20,0.55)" stroke={ABYSS_PALETTE.hudCyan} strokeOpacity="0.6" strokeWidth="2" />
          {[32, 64].map((r) => (
            <circle key={r} r={r} fill="none" stroke={ABYSS_PALETTE.hudCyan} strokeOpacity="0.3" strokeWidth="1.5" />
          ))}
          <line x1="-96" y1="0" x2="96" y2="0" stroke={ABYSS_PALETTE.hudCyan} strokeOpacity="0.2" />
          <line x1="0" y1="-96" x2="0" y2="96" stroke={ABYSS_PALETTE.hudCyan} strokeOpacity="0.2" />
          <g transform={`rotate(${sweep})`}>
            <path d="M0 0 L96 0 A96 96 0 0 0 83 -48 Z" fill="url(#abyssSweep)" />
          </g>
          {/* contacts: jellies early, the big echo appears at the payoff */}
          <circle cx={-40} cy={30} r={4} fill={ABYSS_PALETTE.lumenMagenta} opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 2))} />
          <circle cx={52} cy={-22} r={3} fill={ABYSS_PALETTE.hudCyan} opacity={0.5 + 0.5 * Math.abs(Math.sin(t * 1.6))} />
          <circle cx={6} cy={58 - smooth(8, 11, t) * 40} r={4 + smooth(8.5, 10, t) * 9} fill="none" stroke={ABYSS_PALETTE.hudAmber} strokeWidth="3" opacity={smooth(8.2, 9, t)} />
        </svg>
        <div style={{ fontFamily: mono, textAlign: "right", background: ABYSS_PALETTE.hudInk, padding: `${10 * s}px ${14 * s}px`, borderRight: `${4 * s}px solid ${ABYSS_PALETTE.hudCyan}` }}>
          <div style={{ fontSize: 46 * s, fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>
            {Math.round(m).toLocaleString("en-US")}
            <span style={{ fontSize: 22 * s, color: ABYSS_PALETTE.hudCyan }}> m</span>
          </div>
          <div style={{ fontSize: 17 * s, letterSpacing: 2 * s, color: m >= 1000 ? ABYSS_PALETTE.lumenMagenta : ABYSS_PALETTE.hudCyan, marginTop: 6 * s }}>{zone}</div>
          <div style={{ fontSize: 16 * s, color: "rgba(230,251,255,0.7)", marginTop: 6 * s }}>
            {pressure.toFixed(0)} atm · {temp.toFixed(1)} °C
          </div>
        </div>
      </div>

      {/* bottom caption (ends above the 380 px safe zone) */}
      <div style={{ position: "absolute", left: 60 * s, right: 60 * s, bottom: 404 * s, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ maxWidth: 700 * s, background: ABYSS_PALETTE.hudInk, borderLeft: `${5 * s}px solid ${captionIn > 0.5 ? ABYSS_PALETTE.hudAmber : ABYSS_PALETTE.hudCyan}`, padding: `${18 * s}px ${24 * s}px` }}>
          <div style={{ fontSize: 30 * s, lineHeight: 1.35, fontWeight: 600 }}>
            {captionIn > 0.5 ? "Contact. Something down here makes its own light." : "Below 1,000 m no sunlight survives. Every glow here is alive."}
          </div>
          <div style={{ fontFamily: mono, fontSize: 17 * s, letterSpacing: 2 * s, color: "rgba(230,251,255,0.6)", marginTop: 10 * s }}>SONAR PING 0.4 HZ // MARINE SNOW DENSITY HIGH</div>
        </div>
        <div style={{ fontFamily: mono, fontSize: 18 * s, color: "rgba(230,251,255,0.7)", textAlign: "right", width: Math.min(200 * s, width * 0.2) }}>
          Creator: AUDIRA
        </div>
      </div>
    </div>
  );
};
