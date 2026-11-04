// INNERWORKS Overlay — Technical cutaway telemetry, kinematic RPM readouts & section indicators.

import React from "react";
import { lerp, seg, ease } from "../core/motion";
import { INNERWORKS_PALETTE } from "../lib/palette";

export interface InnerworksOverlayProps {
  f: number;
}

export const InnerworksOverlay: React.FC<InnerworksOverlayProps> = ({ f }) => {
  const introFade = seg(f, 0, 40, ease.smooth);
  const rpm = Math.floor(lerp(1200, 3600, seg(f, 60, 200, ease.smooth)));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        fontFamily: "'SF Mono', Consolas, Monaco, monospace",
        color: "#ffffff",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        opacity: introFade,
      }}
    >
      {/* Top Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: INNERWORKS_PALETTE.xrayCyan, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            AUDIRA INNERWORKS // CUTAWAY 05
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#ffffff", marginTop: 4 }}>
            PLANETARY DRIVE TRANSMISSION
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 11, color: "rgba(255, 255, 255, 0.6)" }}>
          <div>VELOCITY: {rpm} RPM</div>
          <div style={{ color: INNERWORKS_PALETTE.hydraulicAmber }}>GEAR RATIO: 1 : 1.60</div>
        </div>
      </div>

      {/* Mid Crosshair Section (Active during x-ray dive) */}
      {f >= 120 && f <= 340 && (
        <div
          style={{
            alignSelf: "flex-end",
            background: "rgba(9, 13, 22, 0.75)",
            border: `1px solid ${INNERWORKS_PALETTE.xrayCyan}`,
            borderRadius: 6,
            padding: "10px 14px",
            fontSize: 11,
            color: INNERWORKS_PALETTE.xrayCyan,
            opacity: seg(f, 120, 140, ease.smooth) * (f < 320 ? 1 : 1 - seg(f, 320, 340, ease.smooth)),
          }}
        >
          <div>[ CUTAWAY SECTION B-B ]</div>
          <div style={{ color: "#ffffff", marginTop: 2 }}>MESH ENGAGEMENT: 99.4%</div>
        </div>
      )}

      {/* Bottom Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.45)" }}>
          MECHANICAL X-RAY KINEMATICS
        </div>
        <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.6)" }}>
          {String(Math.floor(f)).padStart(4, "0")} / 0480
        </div>
      </div>
    </div>
  );
};

