// NANOFORGE Overlay — Cryo-EM & High-Resolution Optical Microscopy HUD.

import React from "react";
import { lerp, seg, ease } from "../core/motion";
import { NANO_PALETTE } from "../lib/palette";

export interface NanoOverlayProps {
  f: number;
}

export const NanoOverlay: React.FC<NanoOverlayProps> = ({ f }) => {
  const introFade = seg(f, 0, 40, ease.smooth);
  const mag = Math.floor(lerp(280000, 650000, seg(f, 0, 300, ease.bioFlow)));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        fontFamily: "'SF Mono', Consolas, Monaco, 'Courier New', monospace",
        color: "#ffffff",
        padding: "36px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        opacity: introFade,
      }}
    >
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: NANO_PALETTE.thymineCyan, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            AUDIRA NANOFORGE // BIO-SEM 15
          </div>
          <div style={{ fontSize: 22, fontWeight: 300, color: "#ffffff", marginTop: 4, letterSpacing: "0.02em" }}>
            MOLECULAR HELIX SEQUENCING
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 11, color: "rgba(255, 255, 255, 0.6)" }}>
          <div>ACCEL: 200 kV</div>
          <div style={{ color: NANO_PALETTE.membraneGlow }}>MAG: {mag.toLocaleString()}×</div>
        </div>
      </div>

      {/* Mid Micro-Reticle (Active during macro inspection) */}
      {f >= 40 && f <= 300 && (
        <div
          style={{
            alignSelf: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: seg(f, 40, 70, ease.smooth) * (f < 270 ? 1 : 1 - seg(f, 270, 300, ease.smooth)),
          }}
        >
          {/* Circular Nanometer Reticle */}
          <div
            style={{
              width: 140,
              height: 140,
              border: "1px dashed rgba(0, 245, 212, 0.4)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div style={{ width: 6, height: 6, background: NANO_PALETTE.thymineCyan, borderRadius: "50%" }} />
            <div style={{ position: "absolute", top: -18, fontSize: 10, color: NANO_PALETTE.thymineCyan }}>
              H-BOND COUPLING
            </div>
          </div>
        </div>
      )}

      {/* Bottom Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        {/* Scale Bar */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 70, height: 2, background: "#ffffff" }} />
            <span style={{ fontSize: 10, color: "rgba(255, 255, 255, 0.7)" }}>25 nm</span>
          </div>
          <div style={{ fontSize: 10, color: "rgba(255, 255, 255, 0.45)" }}>CRYO-EM RECONSTRUCTION // 1.8 Å</div>
        </div>

        {/* Frame Counter */}
        <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.5)" }}>
          FRAME {String(Math.floor(f)).padStart(4, "0")} / 0480
        </div>
      </div>
    </div>
  );
};

