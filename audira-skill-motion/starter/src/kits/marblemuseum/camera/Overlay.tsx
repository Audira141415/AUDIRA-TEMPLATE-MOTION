import React from "react";
import { useVideoConfig } from "remotion";
import { MARBLE_PALETTE } from "../lib/palette";
import { labelIn, smooth } from "../core/motion";

/** Museum HUD: gallery kicker, serif title, style badge, wall-label card, credit. Safe zones: top 180 / bottom 380 px @1920. */
export const MarblemuseumOverlay: React.FC<{ t: number }> = ({ t }) => {
  const { height } = useVideoConfig();
  const s = height / 1920;
  const fade = smooth(0.2, 1.0, t);
  const card = labelIn(t);
  const serif = "'Didot', 'Bodoni MT', 'Georgia', serif";
  const sans = "'Helvetica Neue', 'Segoe UI', sans-serif";

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", color: "#F7F1E6", fontFamily: serif }}>
      <div style={{ position: "absolute", top: 196 * s, left: 60 * s, right: 60 * s, display: "flex", justifyContent: "space-between", alignItems: "flex-start", opacity: fade }}>
        <div>
          <div style={{ fontFamily: sans, fontSize: 20 * s, letterSpacing: 6 * s, color: MARBLE_PALETTE.hudGilt, marginBottom: 10 * s }}>GALLERY IV // CLASSICAL SCULPTURE</div>
          <div style={{ fontSize: 66 * s, fontWeight: 400, letterSpacing: 1 * s, lineHeight: 1.02, textShadow: `0 ${3 * s}px ${18 * s}px rgba(0,0,0,0.6)` }}>
            Hall of
            <br />
            <span style={{ fontStyle: "italic" }}>Thinkers</span>
          </div>
        </div>
        <div style={{ border: `${1.5 * s}px solid ${MARBLE_PALETTE.hudGilt}`, background: "rgba(18,8,7,0.7)", padding: `${10 * s}px ${18 * s}px`, fontFamily: sans, fontWeight: 700, fontSize: 20 * s, letterSpacing: 3 * s, color: MARBLE_PALETTE.hudGilt }}>
          MARBLEMUSEUM // 61
        </div>
      </div>

      <div style={{ position: "absolute", left: 60 * s, right: 60 * s, bottom: 404 * s, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 * s }}>
        {/* museum wall label */}
        <div
          style={{
            width: 560 * s,
            background: MARBLE_PALETTE.card,
            color: MARBLE_PALETTE.cardInk,
            padding: `${22 * s}px ${28 * s}px`,
            boxShadow: `0 ${10 * s}px ${30 * s}px rgba(0,0,0,0.45)`,
            opacity: card,
            transform: `translateY(${(1 - card) * 24 * s}px)`,
            fontFamily: sans,
          }}
        >
          <div style={{ fontSize: 15 * s, letterSpacing: 3 * s, color: "#7A6A55", marginBottom: 8 * s }}>OBJECT 061</div>
          <div style={{ fontFamily: serif, fontSize: 34 * s, lineHeight: 1.1, marginBottom: 6 * s }}>Bust of an Unknown Thinker</div>
          <div style={{ fontSize: 18 * s, lineHeight: 1.45, color: "#3B342D" }}>
            Statuary marble, carved in the classical manner
            <br />
            <span style={{ fontStyle: "italic" }}>“Stone keeps every idea the chisel was patient enough to find.”</span>
          </div>
        </div>
        <div style={{ fontFamily: sans, fontSize: 18 * s, color: "rgba(247,241,230,0.75)", textAlign: "right", whiteSpace: "nowrap", opacity: fade }}>Creator: AUDIRA</div>
      </div>

      {/* before the label: a quiet caption so the hook is never text-free */}
      <div style={{ position: "absolute", left: 60 * s, bottom: 404 * s, opacity: fade * (1 - card), fontSize: 32 * s, fontStyle: "italic", maxWidth: 620 * s, textShadow: `0 ${2 * s}px ${12 * s}px rgba(0,0,0,0.8)` }}>
        Some faces were carved to outlive their names.
      </div>
    </div>
  );
};
