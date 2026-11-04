// Cut-out shape library. Every builder returns a ShapeSpec: a cache key plus a factory, so
// identical cut-outs share one ExtrudeGeometry no matter how many sets use them.
//
// Convention: shapes stand on the origin — x centred, y from 0 upward — so a pop-up's crease
// is always the shape's own base line. Extrusion depth is centred on z = 0.

import { ExtrudeGeometry, Path, Shape, ShapeGeometry, type BufferGeometry } from "three";

export type ShapeSpec = { key: string; make: () => Shape };

const r3 = (n: number) => Math.round(n * 1000) / 1000;
const k = (name: string, ...args: (number | string)[]) => `${name}(${args.map((a) => (typeof a === "number" ? r3(a) : a)).join(",")})`;

/** Trace a rounded rectangle [x0,x1]×[y0,y1] into a Shape or Path (counter-clockwise). */
const traceRoundRect = (p: Path, x0: number, y0: number, x1: number, y1: number, r: number) => {
  const rr = Math.min(r, (x1 - x0) / 2, (y1 - y0) / 2);
  p.moveTo(x0 + rr, y0);
  p.lineTo(x1 - rr, y0);
  if (rr > 0) p.absarc(x1 - rr, y0 + rr, rr, -Math.PI / 2, 0, false);
  p.lineTo(x1, y1 - rr);
  if (rr > 0) p.absarc(x1 - rr, y1 - rr, rr, 0, Math.PI / 2, false);
  p.lineTo(x0 + rr, y1);
  if (rr > 0) p.absarc(x0 + rr, y1 - rr, rr, Math.PI / 2, Math.PI, false);
  p.lineTo(x0, y0 + rr);
  if (rr > 0) p.absarc(x0 + rr, y0 + rr, rr, Math.PI, Math.PI * 1.5, false);
  return p;
};

/** Arch outline (rectangle with a semicircular head) from the base line. */
const traceArch = (p: Path, cx: number, y0: number, w: number, h: number, ccw = true) => {
  const r = w / 2;
  const spring = y0 + Math.max(0, h - r);
  if (ccw) {
    p.moveTo(cx - r, y0);
    p.lineTo(cx + r, y0);
    p.lineTo(cx + r, spring);
    p.absarc(cx, spring, r, 0, Math.PI, false);
    p.lineTo(cx - r, y0);
  } else {
    p.moveTo(cx - r, y0);
    p.lineTo(cx - r, spring);
    p.absarc(cx, spring, r, Math.PI, 0, true);
    p.lineTo(cx + r, y0);
    p.lineTo(cx - r, y0);
  }
  return p;
};

export type Outline = "arch" | "rect" | "gothic";

/** Door/window outline of any kind, base on y0, centred on cx. */
export const traceOutline = (p: Path, kind: Outline, cx: number, y0: number, w: number, h: number) => {
  if (kind === "rect") return traceRoundRect(p, cx - w / 2, y0, cx + w / 2, y0 + h, 0);
  if (kind === "arch") return traceArch(p, cx, y0, w, h);
  // equilateral pointed arch
  const spring = y0 + Math.max(0, h - 0.866 * w);
  p.moveTo(cx - w / 2, y0);
  p.lineTo(cx + w / 2, y0);
  p.lineTo(cx + w / 2, spring);
  p.absarc(cx - w / 2, spring, w, 0, Math.PI / 3, false);
  p.absarc(cx + w / 2, spring, w, (2 * Math.PI) / 3, Math.PI, false);
  p.lineTo(cx - w / 2, y0);
  return p;
};

export type Hole =
  | { kind: "rect"; x: number; y: number; w: number; h: number; r?: number }
  | { kind: "arch"; x: number; y: number; w: number; h: number }
  | { kind: "circle"; x: number; y: number; r: number };

const holeKey = (hs: Hole[]) =>
  hs.map((h) => (h.kind === "circle" ? k("c", h.x, h.y, h.r) : k(h.kind, h.x, h.y, h.w, h.h, h.kind === "rect" ? h.r ?? 0 : 0))).join("");

const addHoles = (s: Shape, hs: Hole[]) => {
  for (const h of hs) {
    const p = new Path();
    if (h.kind === "rect") traceRoundRect(p, h.x - h.w / 2, h.y, h.x + h.w / 2, h.y + h.h, h.r ?? 0);
    else if (h.kind === "arch") traceArch(p, h.x, h.y, h.w, h.h);
    else p.absarc(h.x, h.y, h.r, 0, Math.PI * 2, false);
    s.holes.push(p);
  }
  return s;
};

export const S = {
  /** Rounded rectangle standing on the base line. */
  rect: (w: number, h: number, r = 0, holes: Hole[] = []): ShapeSpec => ({
    key: k("rect", w, h, r) + holeKey(holes),
    make: () => addHoles(traceRoundRect(new Shape(), -w / 2, 0, w / 2, h, r) as Shape, holes),
  }),
  /** Centred rounded rectangle (for slabs that sit on their centre). */
  rectC: (w: number, h: number, r = 0, holes: Hole[] = []): ShapeSpec => ({
    key: k("rectC", w, h, r) + holeKey(holes),
    make: () => addHoles(traceRoundRect(new Shape(), -w / 2, -h / 2, w / 2, h / 2, r) as Shape, holes),
  }),
  arch: (w: number, h: number, holes: Hole[] = []): ShapeSpec => ({
    key: k("arch", w, h) + holeKey(holes),
    make: () => addHoles(traceArch(new Shape(), 0, 0, w, h) as Shape, holes),
  }),
  circle: (r: number, holes: Hole[] = []): ShapeSpec => ({
    key: k("circle", r) + holeKey(holes),
    make: () => {
      const s = new Shape();
      s.absarc(0, 0, r, 0, Math.PI * 2, false);
      return addHoles(s, holes);
    },
  }),
  ellipse: (rx: number, ry: number): ShapeSpec => ({
    key: k("ellipse", rx, ry),
    make: () => {
      const s = new Shape();
      s.absellipse(0, 0, rx, ry, 0, Math.PI * 2, false, 0);
      return s;
    },
  }),
  /** Annulus (ring), e.g. a clock rim. */
  ring: (r0: number, r1: number): ShapeSpec => ({
    key: k("ring", r0, r1),
    make: () => {
      const s = new Shape();
      s.absarc(0, 0, r1, 0, Math.PI * 2, false);
      const h = new Path();
      h.absarc(0, 0, r0, 0, Math.PI * 2, true);
      s.holes.push(h);
      return s;
    },
  }),
  /** Arbitrary polygon from points (counter-clockwise). */
  poly: (name: string, pts: [number, number][]): ShapeSpec => ({
    key: k("poly", name),
    make: () => {
      const s = new Shape();
      pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
      s.closePath();
      return s;
    },
  }),
  /** Free path: `draw` receives a fresh Shape. `name` must uniquely describe it. */
  path: (name: string, draw: (s: Shape) => void): ShapeSpec => ({
    key: k("path", name),
    make: () => {
      const s = new Shape();
      draw(s);
      return s;
    },
  }),
  /** Gabled house front: body w×h with a roof of height rh. Optional window/door holes. */
  gable: (w: number, h: number, rh: number, holes: Hole[] = []): ShapeSpec => ({
    key: k("gable", w, h, rh) + holeKey(holes),
    make: () => {
      const s = new Shape();
      s.moveTo(-w / 2, 0);
      s.lineTo(w / 2, 0);
      s.lineTo(w / 2, h);
      s.lineTo(0, h + rh);
      s.lineTo(-w / 2, h);
      s.closePath();
      return addHoles(s, holes);
    },
  }),
  /** Opening of any outline kind (door leaves, portal surfaces, windows). */
  outline: (kind: Outline, w: number, h: number, holes: Hole[] = []): ShapeSpec => ({
    key: k("outline", kind, w, h) + holeKey(holes),
    make: () => addHoles(traceOutline(new Shape(), kind, 0, 0, w, h) as Shape, holes),
  }),
  /** Frame: outer outline minus an inner opening (inner base may sit above the outer base). */
  frame: (outer: Outline, ow: number, oh: number, inner: Outline, iw: number, ih: number, iy = 0): ShapeSpec => ({
    key: k("frame", outer, ow, oh, inner, iw, ih, iy),
    make: () => {
      const s = traceOutline(new Shape(), outer, 0, 0, ow, oh) as Shape;
      s.holes.push(traceOutline(new Path(), inner, 0, iy, iw, ih));
      return s;
    },
  }),
  /** Rolling hill silhouette: width w, peak h, base thickness b (stands on y=0). */
  hill: (w: number, h: number, b: number, skew = 0): ShapeSpec => ({
    key: k("hill", w, h, b, skew),
    make: () => {
      const s = new Shape();
      s.moveTo(-w / 2, 0);
      s.lineTo(w / 2, 0);
      s.lineTo(w / 2, b);
      s.bezierCurveTo(w * 0.25 + skew, b + h * 0.15, w * 0.2 + skew, b + h, skew, b + h);
      s.bezierCurveTo(-w * 0.2 + skew, b + h, -w * 0.25 + skew, b + h * 0.15, -w / 2, b);
      s.closePath();
      return s;
    },
  }),
  /** Puffy cloud from overlapping lobes along a flat base. */
  cloud: (w: number, h: number, lobes = 4): ShapeSpec => ({
    key: k("cloud", w, h, lobes),
    make: () => {
      const s = new Shape();
      s.moveTo(-w / 2, 0);
      s.lineTo(w / 2, 0);
      const n = lobes;
      for (let i = n - 1; i >= 0; i--) {
        const t0 = i / n, t1 = (i + 1) / n;
        const xa = -w / 2 + w * t1, xb = -w / 2 + w * t0;
        const peak = h * (0.55 + 0.45 * Math.sin(Math.PI * (t0 + t1) * 0.5));
        s.bezierCurveTo(xa, peak * 0.9, xb, peak * 0.9, xb, i === 0 ? 0 : peak * 0.35);
      }
      s.closePath();
      return s;
    },
  }),
  /** Five-point star. */
  star: (r: number, inner = 0.45): ShapeSpec => ({
    key: k("star", r, inner),
    make: () => {
      const s = new Shape();
      for (let i = 0; i < 10; i++) {
        const a = Math.PI / 2 + (i * Math.PI) / 5;
        const rr = i % 2 ? r * inner : r;
        const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
        if (i) s.lineTo(x, y);
        else s.moveTo(x, y);
      }
      s.closePath();
      return s;
    },
  }),
  /** Crescent: disc of radius r minus an offset disc. */
  crescent: (r: number, cut: number, off: number): ShapeSpec => ({
    key: k("crescent", r, cut, off),
    make: () => {
      // Intersections of the two circles, then two arcs.
      const d = off;
      const x = (d * d + r * r - cut * cut) / (2 * d);
      const y = Math.sqrt(Math.max(0, r * r - x * x));
      const a0 = Math.atan2(y, x), a1 = Math.atan2(-y, x);
      const b0 = Math.atan2(y, x - d), b1 = Math.atan2(-y, x - d);
      const s = new Shape();
      s.absarc(0, 0, r, a0, a1 + Math.PI * 2, false);
      s.absarc(d, 0, cut, b1, b0, true);
      s.closePath();
      return s;
    },
  }),
};

// ── Geometry cache ─────────────────────────────────────────────────────────────

const geoCache = new Map<string, BufferGeometry>();

/** Extruded cut-out with centred thickness. Groups: 0 = faces, 1 = cut edges. */
export const extrude = (spec: ShapeSpec, depth: number, curveSegments = 24): BufferGeometry => {
  const key = `${spec.key}|${r3(depth)}|${curveSegments}`;
  let g = geoCache.get(key);
  if (!g) {
    g = new ExtrudeGeometry(spec.make(), { depth, bevelEnabled: false, curveSegments, steps: 1 });
    g.translate(0, 0, -depth / 2);
    g.computeBoundingSphere();
    geoCache.set(key, g);
  }
  return g;
};

/** Flat (zero-thickness) shape, for printed details lying on a face. */
export const flat = (spec: ShapeSpec, curveSegments = 24): BufferGeometry => {
  const key = `${spec.key}|flat|${curveSegments}`;
  let g = geoCache.get(key);
  if (!g) {
    g = new ShapeGeometry(spec.make(), curveSegments);
    geoCache.set(key, g);
  }
  return g;
};
