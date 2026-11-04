import React from "react";
import { AbsoluteFill } from "remotion";
import { BRICK_PALETTE } from "../lib/palette";

interface BrickOverlayProps {
  title?: string;
  subtitle?: string;
  stepNumber?: number;
}

export const BrickOverlay: React.FC<BrickOverlayProps> = ({
  title = "BRICKCRAFT 3D",
  subtitle = "MODULAR TOY ASSEMBLY • STOP-MOTION MACRO",
  stepNumber = 12,
}) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 36px",
        fontFamily: "'Space Grotesk', -apple-system, sans-serif",
      }}
    >
      {/* Top Header Card */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(33, 37, 41, 0.85)",
          backdropFilter: "blur(12px)",
          padding: "14px 22px",
          borderRadius: "16px",
          border: "2px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Toy Stud Graphic Icon */}
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: BRICK_PALETTE.red,
              boxShadow: "0 2px 4px rgba(0,0,0,0.4), inset 0 2px 2px rgba(255,255,255,0.4)",
            }}
          />
          <div style={{ color: "#ffffff", fontWeight: 800, fontSize: "16px", letterSpacing: "1px" }}>
            {title}
          </div>
        </div>

        {/* Step Indicator */}
        <div
          style={{
            background: BRICK_PALETTE.yellow,
            color: "#000000",
            fontWeight: 800,
            fontSize: "12px",
            padding: "4px 10px",
            borderRadius: "8px",
            letterSpacing: "0.5px",
          }}
        >
          BUILD #{stepNumber}
        </div>
      </div>

      {/* Bottom Subtitle / Narration Pill */}
      <div
        style={{
          alignSelf: "center",
          background: "rgba(33, 37, 41, 0.9)",
          backdropFilter: "blur(16px)",
          padding: "14px 28px",
          borderRadius: "30px",
          border: "2px solid rgba(255, 255, 255, 0.15)",
          textAlign: "center",
          boxShadow: "0 12px 36px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "0.8px",
            textTransform: "uppercase",
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
