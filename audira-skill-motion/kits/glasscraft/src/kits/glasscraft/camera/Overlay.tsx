// GLASSCRAFT HUD Overlay — Frosted Spatial Computing Badges & Chromatic Metadata.

import React from "react";
import { lerp, seg, ease } from "../core/motion";
import { GLASS_PALETTE } from "../lib/palette";

export interface GlassOverlayProps {
  f: number;
}

export const GlassOverlay: React.FC<GlassOverlayProps> = ({ f }) => {
  const introFade = seg(f, 0, 45, ease.smooth);
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.08);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#ffffff",
        padding: "36px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        opacity: introFade,
      }}
    >
      {/* Top Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        {/* Left: Spatial Pill Badge */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.22)",
            borderRadius: "24px",
            padding: "8px 18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.18)",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: GLASS_PALETTE.prismaticCyan,
              boxShadow: `0 0 10px ${GLASS_PALETTE.prismaticCyan}`,
              opacity: pulse,
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            AUDIRA // GLASSCRAFT
          </span>
          <span style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: 12 }}>|</span>
          <span style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.75)", fontWeight: 400 }}>
            Spatial Computing 1.4
          </span>
        </div>

        {/* Right: Optical Telemetry */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "16px",
            padding: "8px 14px",
            fontSize: 11,
            color: "rgba(255, 255, 255, 0.65)",
            fontFamily: "monospace",
            textAlign: "right",
          }}
        >
          <div>IOR: 1.52 (BOROSILICATE)</div>
          <div style={{ color: GLASS_PALETTE.prismaticViolet }}>DISPERSION: 0.045</div>
        </div>
      </div>

      {/* Center Cinematic Title (Appears mid-act) */}
      {f > 60 && (
        <div
          style={{
            alignSelf: "center",
            textAlign: "center",
            opacity: seg(f, 60, 90, ease.smooth) * (f < 280 ? 1 : 1 - seg(f, 280, 310, ease.smooth)),
            transform: `translateY(${lerp(15, 0, seg(f, 60, 90, ease.spatialFloat))}px)`,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: GLASS_PALETTE.prismaticCyan,
              marginBottom: 6,
            }}
          >
            Acoustic & Refractive Subsurface
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #ffffff 40%, rgba(255, 255, 255, 0.5) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            Liquid Prism Architecture
          </div>
        </div>
      )}

      {/* Bottom Control Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        {/* Left: Floating Status Capsule */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.07)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            borderRadius: "18px",
            padding: "10px 16px",
            fontSize: 12,
            lineHeight: 1.4,
          }}
        >
          <div style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Field Depth
          </div>
          <div style={{ fontWeight: 500, color: "#ffffff" }}>f/1.8 • Caustics Active</div>
        </div>

        {/* Right: Minimal Frame Indicator */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "14px",
            padding: "8px 14px",
            fontSize: 11,
            color: "rgba(255, 255, 255, 0.6)",
            fontFamily: "monospace",
          }}
        >
          FRAME {String(Math.floor(f)).padStart(4, "0")} / 0480
        </div>
      </div>
    </div>
  );
};

