import React from "react";
import { useVideoConfig } from "remotion";
import { STAINED_PALETTE } from "../lib/palette";
import { assembled, smooth } from "../core/motion";

const TOTAL_PANES = 273; // 216 diamond quarries + 57 rose segments

/** Illuminated-manuscript HUD: chapter kicker, serif title, pane counter, caption. Safe zones: top 180 / bottom 380 px @1920. */
export const StainedglassOverlay: React.FC<{ t: number }> = ({ t }) => {
  const { height } = useVideoConfig();
  const s = height / 1920;
  const fade = smooth(0.2, 1.0, t);
  const set = Math.round(assembled(t) * TOTAL_PANES);
  const payoff = smooth(9.0, 9.8, t);
  const serif = "'Georgia', 'Times New Roman', serif";

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", fontFamily: serif, color: "#FBF3E2", opacity: fade }}>
      <div style={{ position: "absolute", top: 196 * s, left: 60 * s, right: 60 * s, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 21 * s, letterSpacing: 5 * s, color: STAINED_PALETTE.inkGold, marginBottom: 10 * s }}>✦ LEADLIGHT // NAVE WINDOW III</div>
          <div style={{ fontSize: 62 * s, fontStyle: "italic", fontWeight: 700, lineHeight: 1.04, textShadow: `0 ${3 * s}px ${18 * s}px rgba(0,0,0,0.6)` }}>
            The Window of
            <br />
            First Light
          </div>
        </div>
        <div style={{ border: `${2 * s}px solid ${STAINED_PALETTE.inkGold}`, background: STAINED_PALETTE.parchment, padding: `${10 * s}px ${18 * s}px`, borderRadius: 4 * s, fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 21 * s, letterSpacing: 3 * s, color: STAINED_PALETTE.inkGold }}>
          STAINEDGLASS // 58
        </div>
      </div>

      <div style={{ position: "absolute", left: 60 * s, right: 60 * s, bottom: 404 * s, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 * s }}>
        <div style={{ maxWidth: 720 * s, background: STAINED_PALETTE.parchment, border: `${1.5 * s}px solid rgba(232,199,122,0.55)`, borderRadius: 6 * s, padding: `${18 * s}px ${26 * s}px` }}>
          <div style={{ fontSize: 30 * s, fontStyle: "italic", lineHeight: 1.38 }}>
            {payoff > 0.5 ? "“Each pane holds one colour. The story only appears when the sun walks through.”" : "“Piece by piece, the glazier sets colour into lead.”"}
          </div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 17 * s, letterSpacing: 2 * s, color: STAINED_PALETTE.inkGold, marginTop: 10 * s }}>
            PANES SET {String(set).padStart(3, "0")} / {TOTAL_PANES} · POT-METAL GLASS · LEAD CAME
          </div>
        </div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 18 * s, color: "rgba(251,243,226,0.75)", textAlign: "right", whiteSpace: "nowrap" }}>Creator: AUDIRA</div>
      </div>
    </div>
  );
};
