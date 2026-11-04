// CYBERFORGE 2D Tactical HUD Overlay — screen-space telemetry, targeting graphics, and frame metadata.

import React from "react";
import { AbsoluteFill } from "remotion";
import { CYBER_PALETTE } from "../lib/palette";
import { blink } from "../core/motion";

interface CyberOverlayProps {
  f: number;
  lockProgress?: number;
  brandTitle?: string;
}

export const CyberOverlay: React.FC<CyberOverlayProps> = ({
  f,
  lockProgress = 0,
  brandTitle = "CYBERFORGE // QUANTUM PROTOCOL",
}) => {
  const isLocked = lockProgress > 0.85;
  const lockText = isLocked ? "TARGET: LOCKED" : "TARGET: ACQUIRING...";
  const statusColor = isLocked ? CYBER_PALETTE.alertMagenta : CYBER_PALETTE.cyan;

  // Formatted timecode
  const sec = Math.floor(f / 60);
  const frameRem = Math.floor(f % 60);
  const timecode = `00:00:0${sec}:${frameRem < 10 ? "0" : ""}${frameRem}`;

  // Fake dynamic telemetry numbers
  const azimuth = (142.4 + (f * 0.35) % 360).toFixed(1);
  const elevation = (28.1 + Math.sin(f * 0.05) * 4.2).toFixed(1);
  const fluxOutput = (94.2 + (Math.sin(f * 0.2) + 1) * 2.8).toFixed(2);

  const shouldBlink = isLocked ? blink(f, 16) : 1;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "'Courier New', Courier, monospace",
        color: CYBER_PALETTE.hudCyan,
        padding: "50px 40px",
        boxSizing: "border-box",
        justifyContent: "space-between",
      }}
    >
      {/* 1. Header Telemetry */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
        <div>
          <div style={{ fontSize: "16px", fontWeight: "bold", letterSpacing: "2px", color: CYBER_PALETTE.cyan }}>
            {brandTitle}
          </div>
          <div style={{ fontSize: "12px", color: CYBER_PALETTE.hudMuted, marginTop: "4px" }}>
            SYS.ID: 0x9F4 // CLK: {timecode} // 60FPS
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: statusColor,
              opacity: shouldBlink,
              letterSpacing: "1px",
            }}
          >
            {lockText}
          </div>
          <div style={{ fontSize: "11px", color: CYBER_PALETTE.hudMuted, marginTop: "2px" }}>
            FLUX: {fluxOutput} THz
          </div>
        </div>
      </div>

      {/* 2. Center Crosshair Reticle Tick in 2D */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "24px",
          height: "24px",
          border: `1px solid ${CYBER_PALETTE.hudScanline}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "4px", height: "4px", backgroundColor: CYBER_PALETTE.cyan }} />
      </div>

      {/* 3. Footer Telemetry */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
        <div style={{ fontSize: "12px", color: CYBER_PALETTE.hudMuted }}>
          <div>AZM: {azimuth}° // ELV: {elevation}°</div>
          <div style={{ marginTop: "3px" }}>RENDER: DETERMINISTIC_CORE_09</div>
        </div>

        <div style={{ textAlign: "right", fontSize: "11px", color: CYBER_PALETTE.hudMuted }}>
          <div>LAT: -06°12'53" // LON: 106°49'38"</div>
          <div style={{ color: CYBER_PALETTE.matrixLime, marginTop: "3px" }}>● SYSTEM NOMINAL</div>
        </div>
      </div>

      {/* 4. Screen Corner Crop Marks */}
      <div
        style={{
          position: "absolute",
          top: "30px",
          left: "30px",
          width: "16px",
          height: "16px",
          borderTop: `2px solid ${CYBER_PALETTE.cyan}`,
          borderLeft: `2px solid ${CYBER_PALETTE.cyan}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30px",
          right: "30px",
          width: "16px",
          height: "16px",
          borderTop: `2px solid ${CYBER_PALETTE.cyan}`,
          borderRight: `2px solid ${CYBER_PALETTE.cyan}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          left: "30px",
          width: "16px",
          height: "16px",
          borderBottom: `2px solid ${CYBER_PALETTE.cyan}`,
          borderLeft: `2px solid ${CYBER_PALETTE.cyan}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          right: "30px",
          width: "16px",
          height: "16px",
          borderBottom: `2px solid ${CYBER_PALETTE.cyan}`,
          borderRight: `2px solid ${CYBER_PALETTE.cyan}`,
        }}
      />
    </AbsoluteFill>
  );
};
