import React from "react";
import { AbsoluteFill } from "remotion";
import { URBAN_PALETTE } from "../lib/palette";

interface UrbanOverlayProps {
  timeString?: string;
  activeLayer?: string;
  buildingCount?: number;
  maxHeight?: string;
}

export const UrbanOverlay: React.FC<UrbanOverlayProps> = ({
  timeString = "14:30",
  activeLayer = "HEIGHT MATRIX & SOLAR OCCLUSION",
  buildingCount = 24,
  maxHeight = "168 M",
}) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "44px 36px",
        fontFamily: "'Space Grotesk', -apple-system, sans-serif",
      }}
    >
      {/* Top Architectural Meta Block */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          background: "rgba(10, 10, 12, 0.8)",
          backdropFilter: "blur(12px)",
          padding: "16px 22px",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        <div>
          <div
            style={{
              color: URBAN_PALETTE.projectedCyan,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1.5px",
            }}
          >
            URBAN PLANNING ARCHITECTURE // 1:1000
          </div>
          <div
            style={{
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: 800,
              marginTop: "4px",
              letterSpacing: "0.5px",
            }}
          >
            URBANFORGE 3D MODEL
          </div>
        </div>

        {/* Solar Time Clock */}
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#8e929b", fontSize: "10px", letterSpacing: "1px" }}>
            SOLAR POSITION
          </div>
          <div
            style={{
              color: URBAN_PALETTE.projectedAmber,
              fontSize: "18px",
              fontWeight: 800,
              fontFamily: "monospace",
            }}
          >
            {timeString}
          </div>
        </div>
      </div>

      {/* Bottom Architectural Legend Bar */}
      <div
        style={{
          background: "rgba(10, 10, 12, 0.85)",
          backdropFilter: "blur(16px)",
          padding: "14px 20px",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "20px" }}>
          <div>
            <div style={{ color: "#8e929b", fontSize: "10px" }}>TOTAL BLOCKS</div>
            <div style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700 }}>
              {buildingCount} BLOCKS
            </div>
          </div>
          <div>
            <div style={{ color: "#8e929b", fontSize: "10px" }}>HERO PEAK HEIGHT</div>
            <div style={{ color: URBAN_PALETTE.projectedCyan, fontSize: "14px", fontWeight: 700 }}>
              {maxHeight}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#8e929b", fontSize: "10px" }}>ACTIVE PROJECTION</div>
          <div
            style={{
              color: URBAN_PALETTE.projectedEmerald,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            {activeLayer}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
