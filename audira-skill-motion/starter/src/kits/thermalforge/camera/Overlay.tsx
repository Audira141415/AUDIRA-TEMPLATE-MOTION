import React from "react";
import { AbsoluteFill } from "remotion";
import { THERMAL_PALETTE } from "../lib/palette";

export const ThermalOverlay: React.FC<{ f: number }> = ({ f }) => {
  const temp = (78.4 + Math.sin(f * 0.08) * 4.2).toFixed(1);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", padding: 60, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ display: "flex", justifyContent: "space-between", color: THERMAL_PALETTE.hudCyan, fontFamily: "monospace" }}>
        <div>
          <span style={{ fontSize: 22, fontWeight: 900 }}>FLIR IR-SENSOR // 12-BIT</span>
          <div style={{ fontSize: 14 }}>RANGE: 15.0°C - 120.0°C | ε = 0.95</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: THERMAL_PALETTE.flirYellow }}>{temp}°C</div>
          <div style={{ fontSize: 13, color: "#fff" }}>MAX HOTSPOT DETECTED</div>
        </div>
      </div>
      <div style={{ background: "rgba(10, 10, 16, 0.75)", border: `1px solid ${THERMAL_PALETTE.hudCyan}`, padding: 20, borderRadius: 8 }}>
        <h4 style={{ margin: 0, color: THERMAL_PALETTE.hudCyan, fontSize: 20, fontFamily: "monospace" }}>
          DISIPASI TERMAL EFISIEN
        </h4>
        <p style={{ margin: "6px 0 0 0", color: "#ddd", fontSize: 15, lineHeight: 1.4 }}>
          Spektrum gradien Ironbow memperlihatkan transfer energi kalor dari inti silikon menuju sirip radiator pendingin.
        </p>
      </div>
    </AbsoluteFill>
  );
};
