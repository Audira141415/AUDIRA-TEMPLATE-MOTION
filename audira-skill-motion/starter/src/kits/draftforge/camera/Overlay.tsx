// DRAFTFORGE 2D Drafting Sheet Overlay — architectural sheet borders, coordinate zone markers, graphic scale bar, and title block stamp.

import React from "react";
import { AbsoluteFill } from "remotion";
import { DRAFT_PALETTE } from "../lib/palette";
import { TitleBlock } from "../cad/TitleBlock";

interface DraftOverlayProps {
  f: number;
  projectTitle?: string;
  sheetNo?: string;
}

export const DraftOverlay: React.FC<DraftOverlayProps> = ({
  f,
  projectTitle = "PROJECT: AEROSPACE TURBOJET MK-IV",
  sheetNo = "01 / 04",
}) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        fontFamily: "'Courier New', Courier, monospace",
        color: DRAFT_PALETTE.textPrimary,
        padding: "35px",
        boxSizing: "border-box",
        justifyContent: "space-between",
      }}
    >
      {/* 1. Outer Double Margin Architectural Border */}
      <div
        style={{
          position: "absolute",
          top: "24px",
          left: "24px",
          right: "24px",
          bottom: "24px",
          border: `2px solid ${DRAFT_PALETTE.cadWhite}`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30px",
          left: "30px",
          right: "30px",
          bottom: "30px",
          border: `1px solid ${DRAFT_PALETTE.gridMajor}`,
          pointerEvents: "none",
        }}
      />

      {/* 2. Top Header & Zone Marks */}
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", zIndex: 2 }}>
        <div style={{ fontSize: "11px", letterSpacing: "1.5px", color: DRAFT_PALETTE.cadWhite }}>
          SECTION A-A // ISOMETRIC EXPLODED ASSEMBLY
        </div>
        <div style={{ fontSize: "10px", color: DRAFT_PALETTE.textMuted }}>
          GRID ZONE: [E-4] // METRIC STANDARD
        </div>
      </div>

      {/* 3. Bottom Footer with Graphic Scale Bar & Title Block */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", zIndex: 2 }}>
        {/* Graphic Scale Bar */}
        <div style={{ fontSize: "10px", color: DRAFT_PALETTE.textMuted }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
            <div style={{ width: "30px", height: "4px", backgroundColor: DRAFT_PALETTE.cadWhite }} />
            <div style={{ width: "30px", height: "4px", backgroundColor: DRAFT_PALETTE.gridFine }} />
            <div style={{ width: "60px", height: "4px", backgroundColor: DRAFT_PALETTE.cadWhite }} />
          </div>
          <div>0m &nbsp;&nbsp;&nbsp; 1m &nbsp;&nbsp;&nbsp; 2m &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 4m</div>
          <div style={{ marginTop: "3px", color: DRAFT_PALETTE.cadCyan }}>GRAPHIC SCALE BAR 1:25</div>
        </div>

        {/* Title Block Stamp */}
        <TitleBlock projectTitle={projectTitle} sheetNo={sheetNo} />
      </div>
    </AbsoluteFill>
  );
};
