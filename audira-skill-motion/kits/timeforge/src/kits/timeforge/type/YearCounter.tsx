// Rolling year counter: mechanical odometer digits that pass through every year of a
// transition. Higher digits roll only while every lower digit is turning over (9 → 0),
// exactly like a real counter; fast-spinning digits pick up a little motion blur.

import React from "react";

const digitPos = (y: number, k: number) => {
  const p = 10 ** k;
  const base = Math.floor(y / p) % 10;
  if (k === 0) return y % 10;
  return base + Math.min(1, Math.max(0, (y % p) - (p - 1)));
};

export const YearCounter: React.FC<{
  year: number;
  /** Year one frame earlier, for blur. */
  prev: number;
  size: number;
  font: string;
  color: string;
  weight?: number;
  suffix?: { text: string; opacity: number };
}> = ({ year, prev, size, font, color, weight = 200, suffix }) => {
  const lineH = size * 1.04;
  const cellW = size * 0.6;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", fontFamily: font, fontWeight: weight, fontSize: size, color, lineHeight: `${lineH}px` }}>
      {[3, 2, 1, 0].map((k) => {
        const pos = digitPos(year, k);
        const speed = Math.abs(pos - digitPos(prev, k));
        const blur = Math.min(size * 0.035, Math.max(0, (speed > 5 ? 10 - speed : speed) - 0.15) * size * 0.05);
        return (
          <div key={k} style={{ width: cellW, height: lineH, overflow: "hidden", position: "relative" }}>
            <div style={{ transform: `translateY(${-pos * lineH}px)`, filter: blur > 0.2 ? `blur(${blur}px)` : undefined, textAlign: "center" }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, i) => (
                <div key={i} style={{ height: lineH }}>
                  {d}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {suffix ? (
        <div style={{ width: size * 0.44 * suffix.opacity, opacity: suffix.opacity, overflow: "hidden", height: lineH, textAlign: "left" }}>{suffix.text}</div>
      ) : null}
    </div>
  );
};
