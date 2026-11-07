import React from "react";
import { useVideoConfig } from "remotion";
import { MOSAIC_PALETTE } from "../lib/palette";
import { seatedFraction, smooth } from "../core/motion";
import { TESSERAE_COUNT } from "../scene/TesseraeField3D";

/** Excavation-catalogue HUD: panel kicker, title, tesserae counter, caption. Safe zones: top 180 / bottom 380 px @1920. */
export const MosaicforgeOverlay: React.FC<{ t: number }> = ({ t }) => {
  const { height } = useVideoConfig();
  const s = height / 1920;
  const fade = smooth(0.2, 1.0, t);
  const set = Math.round(seatedFraction(t) * TESSERAE_COUNT);
  const payoff = smooth(9.0, 9.8, t);
  const mono = "'Consolas', 'Courier New', monospace";

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", fontFamily: "'Palatino Linotype', 'Georgia', serif", color: "#FBF1DF", opacity: fade }}>
      <div style={{ position: "absolute", top: 196 * s, left: 60 * s, right: 60 * s, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontFamily: mono, fontSize: 21 * s, letterSpacing: 5 * s, color: MOSAIC_PALETTE.hudGold, marginBottom: 10 * s }}>◆ OPUS TESSELLATUM // PANEL IX</div>
          <div style={{ fontSize: 66 * s, fontWeight: 700, letterSpacing: 1 * s, lineHeight: 1.02, textShadow: `0 ${3 * s}px ${16 * s}px rgba(0,0,0,0.7)` }}>The Sun-Bird</div>
        </div>
        <div style={{ border: `${2 * s}px solid ${MOSAIC_PALETTE.hudGold}`, background: MOSAIC_PALETTE.hudInk, padding: `${10 * s}px ${18 * s}px`, borderRadius: 3 * s, fontFamily: mono, fontWeight: 700, fontSize: 21 * s, letterSpacing: 3 * s, color: MOSAIC_PALETTE.hudGold }}>
          MOSAICFORGE // 60
        </div>
      </div>

      <div style={{ position: "absolute", left: 60 * s, right: 60 * s, bottom: 404 * s, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 * s }}>
        <div style={{ maxWidth: 720 * s, background: MOSAIC_PALETTE.hudInk, borderLeft: `${5 * s}px solid ${MOSAIC_PALETTE.terracotta}`, padding: `${18 * s}px ${26 * s}px` }}>
          <div style={{ fontSize: 30 * s, lineHeight: 1.36 }}>
            {payoff > 0.5 ? "Thousands of single-colour stones. Step back, and they become a bird." : "One tessera at a time, set into wet lime."}
          </div>
          <div style={{ fontFamily: mono, fontSize: 17 * s, letterSpacing: 2 * s, color: MOSAIC_PALETTE.hudGold, marginTop: 10 * s }}>
            TESSERAE SET {set.toLocaleString("en-US")} / {TESSERAE_COUNT.toLocaleString("en-US")} · LAPIS · TERRACOTTA · GOLD SMALTI
          </div>
        </div>
        <div style={{ fontFamily: mono, fontSize: 18 * s, color: "rgba(251,241,223,0.75)", textAlign: "right", whiteSpace: "nowrap" }}>Creator: AUDIRA</div>
      </div>
    </div>
  );
};
