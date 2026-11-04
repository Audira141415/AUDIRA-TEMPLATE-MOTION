// Stage label: a small numbered caption and a five-stop progress rail. Deliberately quiet;
// the construction carries the story. Laid out at 1080 × 1920 and scaled to the render size.

import React from "react";
import { ease, remap } from "../motion/easing.ts";

export type Stage = { from: number; to: number; n: string; label: string };

export const StageLabel: React.FC<{
  stages: Stage[]; frame: number; fps?: number; show?: number; width: number; font: string; ink: string; soft: string; accent: string;
}> = ({ stages, frame, fps = 30, show = 1, width, font, ink, soft, accent }) => {
  const k = width / 1080;
  const r = fps / 30; // timings are authored at 30 fps
  const T = 14 * r;
  const intro = ease.type(remap(frame, 6 * r, 30 * r)) * show;
  const total = stages[stages.length - 1].to;
  if (intro <= 0.001) return null;
  return (
    <div style={{ position: "absolute", inset: 0, width: 1080, height: 1920, transform: `scale(${k})`, transformOrigin: "0 0", fontFamily: font, opacity: intro }}>
      {stages.map((s, i) => {
        const inK = i === 0 ? 1 : ease.type(remap(frame, s.from, s.from + T));
        const outK = i === stages.length - 1 ? 0 : ease.type(remap(frame, s.to - 4 * r, s.to + T - 6 * r));
        const v = inK * (1 - outK);
        if (v <= 0.001) return null;
        return (
          <div key={s.n} style={{ position: "absolute", left: 92, top: 132, opacity: v, transform: `translateY(${(1 - inK) * 22 - outK * 18}px)` }}>
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "0.32em", color: accent }}>{s.n}</div>
            <div style={{ marginTop: 6, fontSize: 40, fontWeight: 500, letterSpacing: "0.2em", color: ink }}>{s.label}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 92, top: 252, width: 300, height: 3, background: soft, opacity: 0.35 }} />
      <div style={{ position: "absolute", left: 92, top: 252, width: 300 * Math.min(1, frame / total), height: 3, background: accent }} />
      {stages.map((s, i) => (
        <div key={`t${s.n}`} style={{ position: "absolute", left: 92 + (300 * s.from) / total - 3, top: 249, width: 9, height: 9, borderRadius: 9, background: frame >= s.from ? accent : soft, opacity: frame >= s.from ? 1 : 0.4, display: i === 0 ? "none" : "block" }} />
      ))}
    </div>
  );
};
