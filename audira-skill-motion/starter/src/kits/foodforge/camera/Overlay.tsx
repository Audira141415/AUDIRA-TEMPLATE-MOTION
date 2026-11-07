import React from "react";
import { useVideoConfig } from "remotion";
import { clamp01 } from "../core/motion";
import { FOODFORGE_PALETTE as P } from "../lib/palette";

// HUD layer. All sizes are authored for 1080x1920 and scaled by height/1920.
// Text lives below the 180 px top safe band and above the 380 px bottom safe band.
export const FoodforgeOverlay: React.FC<{ f: number }> = ({ f }) => {
  const { height } = useVideoConfig();
  const s = height / 1920;
  const t = f / 60;
  const fadeIn = clamp01((t - 0.2) / 0.6);
  const beat = t < 2.4 ? 0 : t < 7 ? 1 : t < 9 ? 2 : 3;
  const captions = [
    "Lima bahan melayang — gerak lambat 1000 fps.",
    "Telur setengah matang, chashu, nori: jatuh, mendarat, diam.",
    "Uap naik. Minyak cabai menetes ke kaldu.",
    "Satu angkatan sumpit. Kenyal, berkilau, siap disantap.",
  ];
  const capIn = clamp01(((t - [0, 2.4, 7, 9][beat]) / 0.35));

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", fontFamily: "'Georgia', 'Times New Roman', serif", color: P.hudCream }}>
      {/* cinematic vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 45%, rgba(8,4,2,0.55) 100%)" }} />

      {/* top block (below 180 px safe band) */}
      <div style={{ position: "absolute", top: 196 * s, left: 64 * s, right: 64 * s, display: "flex", justifyContent: "space-between", alignItems: "flex-start", opacity: fadeIn }}>
        <div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 22 * s, letterSpacing: 5 * s, color: P.hudAccent, marginBottom: 10 * s }}>
            ● REC // MACRO 100MM // F2.8
          </div>
          <div style={{ fontSize: 66 * s, fontWeight: 700, fontStyle: "italic", lineHeight: 1.02, textShadow: `0 ${4 * s}px ${18 * s}px rgba(0,0,0,0.6)` }}>
            Ramen
            <br />
            Tengah Malam
          </div>
        </div>
        <div
          style={{
            border: `${2 * s}px solid ${P.hudAccent}`,
            background: "rgba(20,12,8,0.7)",
            padding: `${10 * s}px ${18 * s}px`,
            borderRadius: 6 * s,
            fontFamily: "'Courier New', monospace",
            fontWeight: 800,
            fontSize: 22 * s,
            letterSpacing: 2 * s,
          }}
        >
          FOODFORGE // 45
        </div>
      </div>

      {/* bottom block (above 380 px safe band) */}
      <div style={{ position: "absolute", bottom: 400 * s, left: 64 * s, right: 64 * s, display: "flex", justifyContent: "space-between", alignItems: "flex-end", opacity: fadeIn }}>
        <div
          style={{
            background: "rgba(18,10,6,0.72)",
            borderLeft: `${6 * s}px solid ${P.hudAccent}`,
            padding: `${18 * s}px ${26 * s}px`,
            maxWidth: 700 * s,
            transform: `translateY(${(1 - capIn) * 14 * s}px)`,
            opacity: 0.3 + 0.7 * capIn,
          }}
        >
          <div style={{ fontSize: 34 * s, fontStyle: "italic", lineHeight: 1.3, marginBottom: 10 * s }}>"{captions[beat]}"</div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 18 * s, letterSpacing: 2 * s, color: "rgba(255,244,226,0.7)" }}>
            KEY 3200K // RIM BACKLIGHT // SLOW ORBIT
          </div>
        </div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 18 * s, textAlign: "right", color: "rgba(255,244,226,0.7)", lineHeight: 1.5 }}>
          Creator: AUDIRA
          <br />
          {String(Math.floor(t)).padStart(2, "0")}:{String(Math.floor((t % 1) * 60)).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
};
