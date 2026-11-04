// CIRCUITFORGE Overlay — Hardware diagnostic telemetry, silicon clock indicators & PCB pinout status.

import React from "react";
import { lerp, seg, ease } from "../core/motion";
import { CIRCUIT_PALETTE } from "../lib/palette";

export interface CircuitOverlayProps {
  f: number;
}

export const CircuitOverlay: React.FC<CircuitOverlayProps> = ({ f }) => {
  const introFade = seg(f, 0, 40, ease.smooth);
  const clockGhz = (4.2 + seg(f, 60, 200, ease.smooth) * 0.6).toFixed(2);
  const currentAmps = (28.4 + Math.sin(f * 0.08) * 1.6).toFixed(1);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        fontFamily: "'Share Tech Mono', 'SF Mono', Consolas, monospace",
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
          <div style={{ color: CIRCUIT_PALETTE.clockCyan, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase" }}>
            AUDIRA CIRCUITFORGE // SMT 18
          </div>
          <div style={{ fontSize: 24, fontWeight: 400, color: "#ffffff", marginTop: 4 }}>
            SILICON ARCHITECTURE
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 11, color: "rgba(255, 255, 255, 0.65)" }}>
          <div>VDD: 1.15 V DC // 65W TDP</div>
          <div style={{ color: CIRCUIT_PALETTE.electronAmber }}>CORE CLK: {clockGhz} GHz</div>
        </div>
      </div>

      {/* Mid Callout Chip Badge (Active during 3/4 orbital reveal) */}
      {f >= 140 && f <= 340 && (
        <div
          style={{
            alignSelf: "flex-start",
            background: "rgba(6, 23, 15, 0.8)",
            border: `1px solid ${CIRCUIT_PALETTE.copperTraceBevel}`,
            borderRadius: 6,
            padding: "10px 14px",
            fontSize: 11,
            opacity: seg(f, 140, 160, ease.smooth) * (f < 320 ? 1 : 1 - seg(f, 320, 340, ease.smooth)),
          }}
        >
          <div style={{ color: CIRCUIT_PALETTE.enigGold, textTransform: "uppercase", fontSize: 10, letterSpacing: "0.1em" }}>
            [ BGA-1440 INTERPOSER ]
          </div>
          <div style={{ color: "#ffffff", fontWeight: 600, marginTop: 2 }}>CURRENT: {currentAmps} A</div>
          <div style={{ color: "rgba(255, 255, 255, 0.5)", marginTop: 2, fontSize: 10 }}>0402 DECOUPLING ARRAY: LOCKED</div>
        </div>
      )}

      {/* Bottom Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ fontSize: 10, color: "rgba(255, 255, 255, 0.5)" }}>
          FR-4 HIGH TG SUBSTRATE • ENIG 2U" GOLD • 8-LAYER STACKUP
        </div>
        <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.6)" }}>
          FRAME {String(Math.floor(f)).padStart(4, "0")} / 0480
        </div>
      </div>
    </div>
  );
};
