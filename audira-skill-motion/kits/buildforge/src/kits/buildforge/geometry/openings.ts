// Installable units that fill openings: glazing, doors, balustrades. Local origin is the
// bottom-left corner of the opening; the unit's mid-plane sits on z = 0, outside is +z.

import { box, merge, sub } from "./shapes.ts";
import type { SubMesh } from "../types.ts";

export type GlazingOpts = { frame?: number; depth?: number; maxPane?: number; transom?: number };

/** Aluminium frame with mullions every ≤ maxPane metres, an optional transom, and glass. */
export const glazing = (w: number, h: number, o: GlazingOpts = {}): SubMesh[] => {
  const f = o.frame ?? 0.06, d = (o.depth ?? 0.07) / 2, maxPane = o.maxPane ?? 1.5;
  const gap = 0.002;
  const W = w - gap * 2, H = h - gap * 2;
  const x0 = gap, y0 = gap;
  const n = Math.max(1, Math.ceil(W / maxPane));
  const parts = [
    box([x0, y0, -d], [x0 + f, y0 + H, d]),
    box([x0 + W - f, y0, -d], [x0 + W, y0 + H, d]),
    box([x0 + f, y0, -d], [x0 + W - f, y0 + f, d]),
    box([x0 + f, y0 + H - f, -d], [x0 + W - f, y0 + H, d]),
  ];
  for (let i = 1; i < n; i++) {
    const x = x0 + (W * i) / n;
    parts.push(box([x - f * 0.4, y0 + f, -d * 0.9], [x + f * 0.4, y0 + H - f, d * 0.9]));
  }
  if (o.transom) parts.push(box([x0 + f, y0 + o.transom - f * 0.4, -d * 0.9], [x0 + W - f, y0 + o.transom + f * 0.4, d * 0.9]));
  const glass = box([x0 + f * 0.5, y0 + f * 0.5, -0.006], [x0 + W - f * 0.5, y0 + H - f * 0.5, 0.006]);
  return [sub(merge(parts), "frame"), sub(glass, "glass")];
};

/** Full-height pivot door: slim frame, solid timber leaf, long steel pull. */
export const pivotDoor = (w: number, h: number): SubMesh[] => {
  const f = 0.05, d = 0.04, gap = 0.002;
  const frame = merge([
    box([gap, gap, -d], [gap + f, h - gap, d]),
    box([w - gap - f, gap, -d], [w - gap, h - gap, d]),
    box([gap + f, h - gap - f, -d], [w - gap - f, h - gap, d]),
  ]);
  const leaf = box([gap + f + 0.004, 0.01, -0.03], [w - gap - f - 0.004, h - gap - f - 0.004, 0.03]);
  const pull = merge([
    box([w - 0.32, 0.75, 0.03], [w - 0.29, 1.95, 0.065]),
    box([w - 0.32, 0.8, 0.03], [w - 0.29, 0.84, 0.065]),
  ]);
  return [sub(frame, "frame"), sub(leaf, "wood"), sub(pull, "steel")];
};

/** Frameless glass balustrade panel in a steel base shoe. */
export const balustrade = (w: number, h: number): SubMesh[] => [
  sub(box([0, 0, -0.05], [w, 0.1, 0.05]), "steel"),
  sub(box([0.004, 0.06, -0.008], [w - 0.004, h, 0.008]), "glass"),
];
