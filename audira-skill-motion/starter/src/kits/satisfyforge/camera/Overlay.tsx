import React from "react";
import { useVideoConfig } from "remotion";
import { clamp01 } from "../core/motion";
import { SATISFYFORGE_PALETTE as P } from "../lib/palette";

// Soft pastel HUD. Authored at 1080x1920, scaled by height/1920; text stays out of the
// top 180 px and bottom 380 px safe bands.
export const SatisfyforgeOverlay: React.FC<{ f: number }> = ({ f }) => {
  const { height } = useVideoConfig();
  const s = height / 1920;
  const t = f / 60;
  const fadeIn = clamp01((t - 0.1) / 0.5);
  const loop = t < 4 ? 0 : t < 7.9 ? 1 : 2;
  const labels = ["SLICE", "FILL", "FIT"];
  const quotes = [
    "Delapan irisan. Empat lapis warna. Tak ada butir yang meleset.",
    "Tiga warna mengisi hati kaca — berhenti tepat di garisnya.",
    "Setiap bentuk menemukan lubangnya. Pas. Sempurna.",
  ];
  const fit = t > 10.75;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", color: P.ink }}>
      <div style={{ position: "absolute", top: 196 * s, left: 64 * s, right: 64 * s, display: "flex", justifyContent: "space-between", alignItems: "flex-start", opacity: fadeIn }}>
        <div>
          <div style={{ fontSize: 22 * s, letterSpacing: 5 * s, fontWeight: 700, color: P.hudAccent, marginBottom: 10 * s }}>● LOOP {String(loop + 1).padStart(2, "0")}/03 — {labels[loop]}</div>
          <div style={{ fontSize: 64 * s, fontWeight: 800, lineHeight: 1.02, letterSpacing: -1 * s }}>
            Oddly
            <br />
            Satisfying
          </div>
          <div style={{ display: "flex", gap: 10 * s, marginTop: 16 * s }}>
            {labels.map((l, i) => (
              <div
                key={l}
                style={{
                  width: (i === loop ? 64 : 20) * s,
                  height: 12 * s,
                  borderRadius: 6 * s,
                  background: i <= loop ? [P.pink, P.lilac, P.mint][i] : "rgba(75,63,92,0.15)",
                }}
              />
            ))}
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.8)", border: `${2 * s}px solid ${P.hudAccent}`, padding: `${10 * s}px ${18 * s}px`, borderRadius: 999, fontWeight: 800, fontSize: 21 * s, letterSpacing: 2 * s }}>
          SATISFYFORGE // 50
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 400 * s, left: 64 * s, right: 64 * s, display: "flex", justifyContent: "space-between", alignItems: "flex-end", opacity: fadeIn }}>
        <div style={{ background: "rgba(255,255,255,0.86)", borderRadius: 28 * s, padding: `${20 * s}px ${28 * s}px`, maxWidth: 690 * s, boxShadow: `0 ${10 * s}px ${30 * s}px rgba(120,90,160,0.18)` }}>
          <div style={{ fontSize: 33 * s, fontWeight: 600, lineHeight: 1.3, marginBottom: 10 * s }}>
            {fit ? "PERFECT FIT ✓ — dan semuanya berulang." : `"${quotes[loop]}"`}
          </div>
          <div style={{ fontSize: 17 * s, letterSpacing: 2 * s, color: "rgba(75,63,92,0.6)" }}>PASTEL CYCLORAMA // SOFT BOX // SEAMLESS LOOP</div>
        </div>
        <div style={{ fontSize: 18 * s, textAlign: "right", color: "rgba(75,63,92,0.65)", lineHeight: 1.5, fontWeight: 700 }}>Creator: AUDIRA</div>
      </div>
    </div>
  );
};
