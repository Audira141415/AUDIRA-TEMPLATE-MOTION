// PaperBuilding — a folded cardstock house: a front facade with cut windows over a darker
// backing, a plain back facade, two side walls and a roof, all real board with thickness.
// Pops up with the parallel-fold (box) mechanism, so it collapses flat like a pop-up book.

import React from "react";
import { hash01 } from "../motion/easing.ts";
import { S, type Hole } from "../geometry/shapes.ts";
import { Cut, ShearPop, type V3 } from "./Paper.tsx";

export type BuildingSpec = {
  w: number;
  d: number;
  h: number;
  roof: "gable" | "flat" | "step";
  rh?: number;
  wall: string;
  roofColor: string;
  trim: string;
  window: string;
  cols: number;
  rows: number;
  door?: string;
  /** Skip sills and back/side walls (for far rows that only show their face). */
  facadeOnly?: boolean;
  seed?: number;
};

const B = 0.16; // board

const facadeShape = (b: BuildingSpec, holes: Hole[]) => {
  const rh = b.rh ?? b.w * 0.35;
  if (b.roof === "gable") return S.gable(b.w, b.h, rh, holes);
  if (b.roof === "step") {
    const w = b.w, h = b.h, s = Math.min(0.9, rh / 3);
    const pts: [number, number][] = [
      [-w / 2, 0], [w / 2, 0], [w / 2, h],
      [w * 0.32, h], [w * 0.32, h + s], [w * 0.16, h + s], [w * 0.16, h + 2 * s], [-w * 0.16, h + 2 * s],
      [-w * 0.16, h + s], [-w * 0.32, h + s], [-w * 0.32, h], [-w / 2, h],
    ];
    const base = S.poly(`step-${w}-${h}-${s}`, pts);
    return { key: base.key + JSON.stringify(holes), make: () => { const sh = base.make(); for (const ho of S.rect(1, 1, 0, holes).make().holes) sh.holes.push(ho); return sh; } };
  }
  return S.rect(b.w, b.h, 0, holes);
};

export const windowGrid = (b: BuildingSpec): Hole[] => {
  const holes: Hole[] = [];
  const ww = Math.min(0.95, (b.w / b.cols) * 0.46);
  const wh = ww * 1.45;
  const y0 = b.door ? 3.0 : 1.4;
  const usable = b.h - y0 - 0.6;
  const pitchY = b.rows > 1 ? usable / b.rows : 0;
  const arched = hash01((b.seed ?? 0) * 7 + 3) < 0.35;
  for (let r = 0; r < b.rows; r++)
    for (let c = 0; c < b.cols; c++) {
      const x = -b.w / 2 + (b.w / b.cols) * (c + 0.5);
      const y = y0 + r * pitchY + (pitchY - wh) * 0.4;
      if (b.door && r === 0 && Math.abs(x) < 1.0) continue;
      holes.push(arched ? { kind: "arch", x, y, w: ww, h: wh } : { kind: "rect", x, y, w: ww, h: wh, r: 0.06 });
    }
  return holes;
};

export const PaperBuilding: React.FC<{ b: BuildingSpec; t?: number; position?: V3; yaw?: number }> = ({ b, t = 1, position, yaw = 0 }) => {
  const holes = windowGrid(b);
  const rh = b.rh ?? b.w * 0.35;
  const front = facadeShape(b, holes);
  const plain = facadeShape(b, []);
  const half = b.d / 2;
  const slope = Math.atan2(rh, b.w / 2);
  const rafter = Math.hypot(b.w / 2, rh) + 0.35;
  return (
    <ShearPop t={t} position={position} yaw={yaw}>
      {/* front facade, with a darker backing behind the cut windows */}
      <Cut shape={front} color={b.wall} depth={B} position={[0, 0, half]} />
      <Cut shape={S.rect(b.w - 0.3, b.h - 0.3)} color={b.window} depth={0.04} position={[0, 0.1, half - 0.35]} opts={{ relief: 0.5 }} />
      {!b.facadeOnly ? (
        <>
          {holes.map((h, i) => (
            <Cut key={i} shape={S.rectC(("w" in h ? h.w : 1) + 0.28, 0.14, 0.03)} color={b.trim} depth={0.22} position={[h.x, h.y - 0.05, half + 0.1]} />
          ))}
          <Cut shape={plain} color={b.wall} depth={B} position={[0, 0, -half]} />
          {[-1, 1].map((s) => (
            <Cut key={s} shape={S.rect(b.d, b.h)} color={b.wall} depth={B} position={[(s * b.w) / 2 - s * B * 0.5, 0, 0]} rotation={[0, (s * Math.PI) / 2, 0]} />
          ))}
        </>
      ) : null}
      {/* roof */}
      {b.roof === "gable" ? (
        [-1, 1].map((s) => (
          <group key={s} position={[0, b.h + rh, 0]} rotation={[0, 0, s * -slope]}>
            <Cut shape={S.rectC(b.d + 0.5, 0.2)} color={b.roofColor} depth={rafter} position={[(s * rafter) / 2, 0.08, 0]} rotation={[0, Math.PI / 2, 0]} />
          </group>
        ))
      ) : (
        <>
          <Cut shape={S.rectC(b.w + 0.3, b.d + 0.3)} color={b.roofColor} depth={0.18} position={[0, b.h, 0]} rotation={[-Math.PI / 2, 0, 0]} />
          <Cut shape={S.rectC(b.w + 0.45, 0.32, 0.04)} color={b.trim} depth={0.26} position={[0, b.h - 0.3, half + 0.1]} />
        </>
      )}
      {b.door ? (
        <>
          <Cut shape={S.outline("arch", 1.3, 2.3)} color={b.door} depth={0.08} position={[0, 0, half + 0.1]} />
          <Cut shape={S.circle(0.09)} color="gold" depth={0.08} position={[0.35, 1.1, half + 0.18]} />
          <Cut shape={S.rectC(1.9, 0.2, 0.05)} color={b.trim} depth={0.5} position={[0, 0.1, half + 0.2]} />
        </>
      ) : null}
    </ShearPop>
  );
};
