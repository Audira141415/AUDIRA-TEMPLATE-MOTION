import React from "react";
import { useVideoConfig } from "remotion";
import { CATCH, HOP, clamp01, stepT } from "../core/motion";
import { FELTCRAFT_PALETTE as P } from "../lib/palette";

// Hand-sewn HUD: felt-label cards with dashed "stitched" borders. Text updates on twos too.
// Authored at 1080x1920, scaled by height/1920, inside the 180/380 px safe bands.
export const FeltcraftOverlay: React.FC<{ f: number }> = ({ f }) => {
  const { height } = useVideoConfig();
  const s = height / 1920;
  const t = stepT(f / 60);
  const fadeIn = clamp01((t - 0.15) / 0.5);
  const beat = t < HOP[0] ? 0 : t < CATCH - 0.4 ? 1 : 2;
  const quotes = ["Matahari kancing terbit. Kopi si rubah wol mengintip…", "Lompat, lompat, di jalan jahitan menuju pohon benang.", "Tuk! Apel flanel jatuh tepat ke pelukannya."];
  const stitched = (bg: string): React.CSSProperties => ({
    background: bg,
    borderRadius: 18 * s,
    outline: `${3 * s}px dashed ${P.hudAccent}`,
    outlineOffset: -10 * s,
    boxShadow: `0 ${8 * s}px ${20 * s}px rgba(60,35,20,0.25)`,
  });

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", fontFamily: "'Georgia', 'Palatino Linotype', serif", color: P.hudInk }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(60,35,15,0.28) 100%)" }} />
      <div style={{ position: "absolute", top: 196 * s, left: 60 * s, right: 60 * s, display: "flex", justifyContent: "space-between", alignItems: "flex-start", opacity: fadeIn }}>
        <div style={{ ...stitched("rgba(255,247,232,0.92)"), padding: `${22 * s}px ${30 * s}px` }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 19 * s, letterSpacing: 4 * s, color: P.hudAccent, marginBottom: 6 * s, fontWeight: 700 }}>✂ BAB 1 // 12 POSE PER DETIK</div>
          <div style={{ fontSize: 56 * s, fontWeight: 700, fontStyle: "italic", lineHeight: 1.02 }}>
            Kopi &amp;
            <br />
            Pohon Benang
          </div>
        </div>
        <div style={{ ...stitched(P.scarf), color: "#FFFFFF", padding: `${14 * s}px ${22 * s}px`, fontFamily: "'Courier New', monospace", fontWeight: 800, fontSize: 20 * s, letterSpacing: 2 * s, outline: `${2 * s}px dashed #FFFFFF`, outlineOffset: -7 * s }}>
          FELTCRAFT // 55
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 400 * s, left: 60 * s, right: 60 * s, display: "flex", justifyContent: "space-between", alignItems: "flex-end", opacity: fadeIn }}>
        <div style={{ ...stitched("rgba(255,247,232,0.94)"), padding: `${22 * s}px ${30 * s}px`, maxWidth: 690 * s }}>
          <div style={{ fontSize: 32 * s, fontStyle: "italic", lineHeight: 1.32, marginBottom: 8 * s }}>"{quotes[beat]}"</div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 16 * s, letterSpacing: 2 * s, color: "rgba(74,46,30,0.65)" }}>NEEDLE-FELT WOOL // BLANKET STITCH // STOP-MOTION</div>
        </div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 18 * s, fontWeight: 700, textAlign: "right", color: P.hudPaper, textShadow: `0 ${2 * s}px ${5 * s}px rgba(60,35,15,0.6)` }}>Creator: AUDIRA</div>
      </div>
    </div>
  );
};
