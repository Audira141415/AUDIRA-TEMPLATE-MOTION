import React from "react";
import { WATERCOLOR_PALETTE } from "../lib/palette";

export const WatercolorOverlay: React.FC<{ f: number }> = ({ f }) => {
  const opacity = Math.min(1, f / 35);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "54px 44px",
        fontFamily: "'Georgia', serif",
        color: "#2C2723",
      }}
    >
      {/* Top Storybook Chapter Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          opacity,
        }}
      >
        <div>
          <div
            style={{
              fontSize: "14px",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "3px",
              color: WATERCOLOR_PALETTE.washOchreGold,
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            ● CHAPTER I // THE WHISPERING OAK
          </div>
          <div
            style={{
              fontSize: "36px",
              fontWeight: 700,
              fontStyle: "italic",
              letterSpacing: "-0.5px",
              lineHeight: 1.1,
              color: "#28231F",
            }}
          >
            A Storybook Journey
          </div>
        </div>

        {/* Vintage Stamp Badge */}
        <div
          style={{
            background: "rgba(250, 246, 239, 0.95)",
            border: "2px solid #E8AB48",
            color: "#4E7B9C",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 800,
            fontFamily: "monospace",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          AQUARELLE // 33
        </div>
      </div>

      {/* Bottom Story Excerpt Card */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          opacity,
        }}
      >
        <div
          style={{
            background: "rgba(255, 252, 247, 0.92)",
            border: "1px solid rgba(232, 171, 72, 0.4)",
            borderRadius: "12px",
            padding: "16px 24px",
            maxWidth: "680px",
            boxShadow: "0 8px 24px rgba(78, 123, 156, 0.1)",
          }}
        >
          <div
            style={{
              fontSize: "19px",
              fontStyle: "italic",
              lineHeight: 1.45,
              color: "#342E28",
              marginBottom: "8px",
            }}
          >
            "Once upon a quiet morning, when the sun dipped its brush into golden light..."
          </div>
          <div
            style={{
              fontSize: "12px",
              fontFamily: "monospace",
              letterSpacing: "1px",
              color: "#7B5943",
            }}
          >
            HAND-CRAFTED 3D WATERCOLOR WASH // PENCIL OUTLINE // 300GSM RAG
          </div>
        </div>

        <div
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            color: "rgba(44, 39, 35, 0.6)",
            textAlign: "right",
          }}
        >
          AUDIRA STORYBOOK
          <br />
          EBU R128 (-14 LUFS)
        </div>
      </div>
    </div>
  );
};
