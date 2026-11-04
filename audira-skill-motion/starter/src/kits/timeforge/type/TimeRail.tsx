// Time rail: a hairline with one stop per era and a marker that travels with the morph.

import React from "react";

export const TimeRail: React.FC<{
  labels: string[];
  pos: number; // continuous era coordinate
  width: number;
  font: string;
  ink: string;
  soft: string;
  accent: string;
}> = ({ labels, pos, width, font, ink, soft, accent }) => {
  const n = labels.length;
  const x = (i: number) => (i / (n - 1)) * width;
  const mx = x(pos);
  return (
    <div style={{ position: "relative", width, height: 70, fontFamily: font }}>
      <div style={{ position: "absolute", left: 0, top: 14, width, height: 2, background: soft, opacity: 0.45 }} />
      <div style={{ position: "absolute", left: 0, top: 14, width: mx, height: 2, background: accent }} />
      {labels.map((l, i) => {
        const near = Math.max(0, 1 - Math.abs(pos - i) * 1.4);
        return (
          <React.Fragment key={l}>
            <div
              style={{
                position: "absolute", left: x(i) - 5, top: 10, width: 10, height: 10, borderRadius: 5,
                background: i <= pos + 1e-3 ? accent : "#f4f2ee", border: `2px solid ${i <= pos + 1e-3 ? accent : soft}`, boxSizing: "border-box",
              }}
            />
            <div
              style={{
                position: "absolute", left: x(i) - 60, top: 34, width: 120, textAlign: "center",
                fontSize: 25, fontWeight: near > 0.5 ? 600 : 500, letterSpacing: "0.08em", color: near > 0.5 ? ink : soft, opacity: 0.6 + 0.4 * near,
              }}
            >
              {l}
            </div>
          </React.Fragment>
        );
      })}
      <div
        style={{
          position: "absolute", left: mx - 11, top: 4, width: 22, height: 22, borderRadius: 11,
          border: `2px solid ${accent}`, boxSizing: "border-box", background: "rgba(255,255,255,0.6)",
        }}
      />
    </div>
  );
};
