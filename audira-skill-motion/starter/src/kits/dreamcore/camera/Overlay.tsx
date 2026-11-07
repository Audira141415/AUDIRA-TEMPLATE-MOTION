import React from "react";
import { useVideoConfig } from "remotion";
import { DREAM_PALETTE } from "../lib/palette";
import { smooth } from "../core/motion";

/** Soft dream-journal HUD: timestamp kicker, rounded title, badge, caption, credit. Safe zones: top 180 / bottom 380 px @1920. */
export const DreamcoreOverlay: React.FC<{ t: number }> = ({ t }) => {
  const { height } = useVideoConfig();
  const s = height / 1920;
  const fade = smooth(0.2, 1.2, t);
  const payoff = smooth(9.0, 9.8, t);
  const font = "'Nunito', 'Segoe UI Rounded', 'Segoe UI', sans-serif";
  const mono = "'Consolas', 'Courier New', monospace";
  const clock = `03:${String(17 + Math.floor(t / 4)).padStart(2, "0")} AM`;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", fontFamily: font, color: DREAM_PALETTE.hudText, opacity: fade }}>
      <div style={{ position: "absolute", top: 196 * s, left: 60 * s, right: 60 * s, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontFamily: mono, fontSize: 21 * s, letterSpacing: 5 * s, color: "#FFFFFF", background: "rgba(122, 62, 120, 0.55)", display: "inline-block", padding: `${4 * s}px ${12 * s}px`, borderRadius: 20 * s, marginBottom: 12 * s }}>☾ DREAM LOG // {clock}</div>
          <div style={{ fontSize: 62 * s, fontWeight: 800, lineHeight: 1.04, color: "#FFFFFF", textShadow: `0 ${2 * s}px ${20 * s}px rgba(120, 80, 160, 0.55)` }}>
            The Pool That
            <br />
            Leads Outside
          </div>
        </div>
        <div style={{ background: DREAM_PALETTE.hudInk, border: `${2 * s}px solid ${DREAM_PALETTE.hudAccent}`, borderRadius: 40 * s, padding: `${10 * s}px ${20 * s}px`, fontFamily: mono, fontWeight: 700, fontSize: 20 * s, letterSpacing: 3 * s, color: DREAM_PALETTE.hudAccent }}>
          DREAMCORE // 64
        </div>
      </div>

      <div style={{ position: "absolute", left: 60 * s, right: 60 * s, bottom: 404 * s, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 * s }}>
        <div style={{ maxWidth: 700 * s, background: DREAM_PALETTE.hudInk, borderRadius: 22 * s, padding: `${18 * s}px ${26 * s}px`, boxShadow: `0 ${8 * s}px ${30 * s}px rgba(150, 110, 190, 0.25)` }}>
          <div style={{ fontSize: 30 * s, lineHeight: 1.36, fontWeight: 600 }}>
            {payoff > 0.5 ? "The stairs go up. The door is already open. Nobody is waiting." : "You have been here before. You just can't remember when."}
          </div>
          <div style={{ fontFamily: mono, fontSize: 17 * s, letterSpacing: 2 * s, color: DREAM_PALETTE.hudAccent, marginTop: 10 * s }}>WATER 0.4 M · NO EXITS FOUND · SKY INDOORS</div>
        </div>
        <div style={{ fontFamily: mono, fontSize: 18 * s, color: "#FFFFFF", textShadow: `0 0 ${10 * s}px rgba(90,60,120,0.6)`, textAlign: "right", whiteSpace: "nowrap" }}>Creator: AUDIRA</div>
      </div>
    </div>
  );
};
