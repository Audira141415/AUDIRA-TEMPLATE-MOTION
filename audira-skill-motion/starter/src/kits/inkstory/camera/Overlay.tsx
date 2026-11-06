// INKSTORY Overlay — Vertical East Asian calligraphy, traditional verse & dynasty seal border.

import React from "react";
import { seg, ease } from "../core/motion";
import { INK_PALETTE } from "../lib/palette";

export interface InkOverlayProps {
  f: number;
}

export const InkOverlay: React.FC<InkOverlayProps> = ({ f }) => {
  const introFade = seg(f, 0, 45, ease.smoothWash);
  const textFade = seg(f, 60, 110, ease.zenFloat);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        fontFamily: "'Songti SC', 'SimSun', 'Noto Serif SC', 'Georgia', serif",
        color: INK_PALETTE.denseInk,
        padding: "48px 36px",
        display: "flex",
        justifyContent: "space-between",
        opacity: introFade,
      }}
    >
      {/* Left Column: Vertical Poetic Calligraphy */}
      <div
        style={{
          writingMode: "vertical-rl",
          textOrientation: "upright",
          letterSpacing: "0.45em",
          fontSize: 20,
          fontWeight: 400,
          color: INK_PALETTE.pineSootBlack,
          opacity: textFade,
          lineHeight: 2.2,
        }}
      >
        <span>山水有清音</span>
        <span style={{ fontSize: 13, color: INK_PALETTE.dilutedWash, marginTop: 12 }}>
          何必絲與竹
        </span>
      </div>

      {/* Right Column: Title & Dynastic Stamp Telemetry */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        {/* Top Kicker */}
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.28em",
              color: INK_PALETTE.dilutedWash,
              textTransform: "uppercase",
              fontFamily: "sans-serif",
            }}
          >
            AUDIRA INKSTORY // ZEN 16
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: INK_PALETTE.pineSootBlack,
              marginTop: 4,
            }}
          >
            Sumi-e Mountain Mist
          </div>
        </div>

        {/* Bottom Dynastic Seal Character */}
        <div
          style={{
            border: `2px solid ${INK_PALETTE.vermilionCinnabar}`,
            borderRadius: 4,
            padding: "6px 10px",
            color: INK_PALETTE.vermilionCinnabar,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.15em",
          }}
        >
          雅韻
        </div>
      </div>
    </div>
  );
};
