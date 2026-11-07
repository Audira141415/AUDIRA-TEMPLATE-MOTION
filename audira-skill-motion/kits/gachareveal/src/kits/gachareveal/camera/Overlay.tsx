import React from "react";
import { useVideoConfig } from "remotion";
import { BURST, FLIP, TIERS, clamp01, easeOutBack, flash, tierIndex } from "../core/motion";
import { GACHAREVEAL_PALETTE as P } from "../lib/palette";

// Summon HUD: rarity meter that climbs blue → purple → gold, a big tier label that slams in on
// each upgrade, white screen flash, and the reveal caption. Authored at 1080x1920, scaled by
// height/1920, inside the 180/380 px safe bands.
export const GacharevealOverlay: React.FC<{ f: number }> = ({ f }) => {
  const { height } = useVideoConfig();
  const s = height / 1920;
  const t = f / 60;
  const fadeIn = clamp01((t - 0.1) / 0.4);
  const tier = tierIndex(t);
  const col = tier >= 0 ? TIERS[tier].color : "#7C86B8";
  const label = tier >= 0 ? TIERS[tier].label : "MEMANGGIL…";
  const slam = tier >= 0 ? easeOutBack(clamp01((t - TIERS[tier].at) / 0.3), 2.2) : 1;
  const fl = flash(t);
  const revealed = t > FLIP[1];
  const caption = t < BURST ? "Kapsul bergetar… cahayanya naik kelas." : !revealed ? "PECAH! Sebuah kartu berputar keluar…" : "NEBULIN — Roh Bintang ★★★★★ LEGENDARIS!";

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", color: P.hudWhite }}>
      <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", opacity: Math.min(0.85, fl * 0.55) }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 50%, rgba(4,3,16,0.7) 100%)" }} />

      <div style={{ position: "absolute", top: 196 * s, left: 60 * s, right: 60 * s, display: "flex", justifyContent: "space-between", alignItems: "flex-start", opacity: fadeIn }}>
        <div>
          <div style={{ fontSize: 21 * s, letterSpacing: 5 * s, fontWeight: 800, color: col, marginBottom: 8 * s }}>◆ SUMMON x1 // TARIKAN HARIAN</div>
          <div style={{ fontSize: 76 * s, fontWeight: 900, letterSpacing: 2 * s, lineHeight: 1, transform: `scale(${slam})`, transformOrigin: "left center", color: col, textShadow: `0 0 ${18 * s}px ${col}, 0 ${4 * s}px ${10 * s}px rgba(0,0,0,0.6)` }}>{label}</div>
          {/* rarity meter */}
          <div style={{ display: "flex", gap: 8 * s, marginTop: 18 * s }}>
            {TIERS.map((tr, i) => (
              <div key={tr.label} style={{ width: 120 * s, height: 14 * s, borderRadius: 7 * s, background: i <= tier ? tr.color : "rgba(255,255,255,0.15)", boxShadow: i <= tier ? `0 0 ${12 * s}px ${tr.color}` : "none" }} />
            ))}
          </div>
        </div>
        <div style={{ border: `${2 * s}px solid ${P.hudGold}`, background: "rgba(10,8,30,0.75)", padding: `${10 * s}px ${18 * s}px`, borderRadius: 8 * s, fontWeight: 800, fontSize: 20 * s, letterSpacing: 2 * s, color: P.hudGold }}>
          GACHAREVEAL // 65
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 400 * s, left: 60 * s, right: 60 * s, display: "flex", justifyContent: "space-between", alignItems: "flex-end", opacity: fadeIn }}>
        <div style={{ background: "rgba(10,8,30,0.78)", border: `${2 * s}px solid ${revealed ? P.hudGold : col}`, borderRadius: 16 * s, padding: `${18 * s}px ${26 * s}px`, maxWidth: 690 * s, boxShadow: `0 0 ${24 * s}px ${revealed ? P.hudGold : col}55` }}>
          <div style={{ fontSize: 32 * s, fontWeight: 700, lineHeight: 1.3, marginBottom: 8 * s, color: revealed ? P.hudGold : P.hudWhite }}>{caption}</div>
          <div style={{ fontSize: 16 * s, letterSpacing: 2 * s, color: "rgba(245,243,255,0.6)" }}>CAPSULE BURST // HOLO FOIL CARD // ORIGINAL CREATURE</div>
        </div>
        <div style={{ fontSize: 18 * s, fontWeight: 700, textAlign: "right", color: "rgba(245,243,255,0.75)" }}>Creator: AUDIRA</div>
      </div>
    </div>
  );
};
