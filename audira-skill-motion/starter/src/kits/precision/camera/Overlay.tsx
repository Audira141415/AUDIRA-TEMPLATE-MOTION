// PRECISION Overlay — Minimalist Swiss typography, CMF technical specifications & engineering callouts.

import React from "react";
import { lerp, seg, ease } from "../core/motion";
import { PRECISION_PALETTE } from "../lib/palette";

export interface PrecisionOverlayProps {
  f: number;
}

export const PrecisionOverlay: React.FC<PrecisionOverlayProps> = ({ f }) => {
  const introFade = seg(f, 0, 40, ease.smoothStep);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        color: "#ffffff",
        padding: "48px 40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        opacity: introFade,
      }}
    >
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.24em", color: "rgba(255, 255, 255, 0.45)", textTransform: "uppercase" }}>
            AUDIRA PRECISION // CMF 03
          </div>
          <div style={{ fontSize: 26, fontWeight: 300, letterSpacing: "-0.01em", marginTop: 4 }}>
            Aero Acoustic Architecture
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 11, color: "rgba(255, 255, 255, 0.5)", fontFamily: "monospace" }}>
          <div>TOLERANCE ±0.005mm</div>
          <div style={{ color: PRECISION_PALETTE.laserOrange }}>GRADE 5 TITANIUM</div>
        </div>
      </div>

      {/* Exploded Callouts (Active between frames 150 - 320) */}
      {f >= 140 && f <= 330 && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "8%",
            borderLeft: `2px solid ${PRECISION_PALETTE.laserOrange}`,
            paddingLeft: 14,
            opacity: seg(f, 140, 160, ease.smoothStep) * (f < 310 ? 1 : 1 - seg(f, 310, 330, ease.smoothStep)),
          }}
        >
          <div style={{ fontSize: 10, letterSpacing: "0.15em", color: PRECISION_PALETTE.laserOrange, textTransform: "uppercase" }}>
            Acoustic Chamber
          </div>
          <div style={{ fontSize: 16, fontWeight: 400, color: "#ffffff", marginTop: 2 }}>
            Monolithic Ceramic Dome
          </div>
          <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.5)", marginTop: 4, fontFamily: "monospace" }}>
            40mm Graphene Dual Driver
          </div>
        </div>
      )}

      {/* Bottom Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.4)", letterSpacing: "0.08em" }}>
          ENGINEERED IN COPENHAGEN
        </div>
        <div style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255, 255, 255, 0.5)" }}>
          {String(Math.floor(f)).padStart(4, "0")} / 0480
        </div>
      </div>
    </div>
  );
};
