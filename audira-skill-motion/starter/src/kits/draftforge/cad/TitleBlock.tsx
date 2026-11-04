// DRAFTFORGE Engineering Title Block — standard ISO/ANSI drawing metadata stamp.

import React from "react";
import { DRAFT_PALETTE } from "../lib/palette";

interface TitleBlockProps {
  projectTitle?: string;
  sheetNo?: string;
  scale?: string;
  revision?: string;
  discipline?: string;
}

export const TitleBlock: React.FC<TitleBlockProps> = ({
  projectTitle = "PROJECT: AEROSPACE TURBOJET MK-IV",
  sheetNo = "01 / 04",
  scale = "1 : 25 [METRIC]",
  revision = "REV. 03 [APPROVED]",
  discipline = "MECHANICAL CAD SCHEMATIC",
}) => {
  return (
    <div
      style={{
        border: `2px solid ${DRAFT_PALETTE.cadWhite}`,
        backgroundColor: "rgba(9, 27, 54, 0.92)",
        color: DRAFT_PALETTE.textPrimary,
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "11px",
        width: "280px",
        padding: "8px 12px",
        boxSizing: "border-box",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "12px", borderBottom: `1px solid ${DRAFT_PALETTE.gridMajor}`, paddingBottom: "4px" }}>
        {projectTitle}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", marginTop: "6px", fontSize: "10px", color: DRAFT_PALETTE.textMuted }}>
        <div>SCALE: <span style={{ color: DRAFT_PALETTE.cadWhite }}>{scale}</span></div>
        <div>SHEET: <span style={{ color: DRAFT_PALETTE.cadWhite }}>{sheetNo}</span></div>
        <div>STATUS: <span style={{ color: DRAFT_PALETTE.stampCrimson, fontWeight: "bold" }}>{revision}</span></div>
        <div>TYPE: <span style={{ color: DRAFT_PALETTE.cadCyan }}>{discipline}</span></div>
      </div>
    </div>
  );
};
