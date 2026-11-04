// Building-geometry primitives in metres. UVs are metric (1 unit = 1 m) so textures keep
// one density on every element, whatever its size.

import { BoxGeometry, BufferGeometry, Float32BufferAttribute } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { Piece, SubMesh, Vec3 } from "../types.ts";

/** Planar UVs from the dominant normal axis, in metres. */
export const metricUV = (g: BufferGeometry) => {
  const p = g.attributes.position, n = g.attributes.normal;
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    const [u, v] = ax >= ay && ax >= az ? [p.getZ(i), p.getY(i)] : ay >= az ? [p.getX(i), p.getZ(i)] : [p.getX(i), p.getY(i)];
    uv[i * 2] = u;
    uv[i * 2 + 1] = v;
  }
  g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  return g;
};

export const merge = (gs: BufferGeometry[]) => {
  const m = mergeGeometries(gs.map((g) => (g.index ? g.toNonIndexed() : g)), false);
  if (!m) throw new Error("merge failed");
  return m;
};

const size = (min: Vec3, max: Vec3): Vec3 => [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
const centre = (min: Vec3, max: Vec3): Vec3 => [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];

/** Axis-aligned box between two corners. `segs` subdivides (a pour front needs vertices to bend). */
export const box = (min: Vec3, max: Vec3, segs: [number, number, number] = [1, 1, 1]) => {
  const s = size(min, max), c = centre(min, max);
  const g = new BoxGeometry(s[0], s[1], s[2], ...segs);
  g.translate(...c);
  return metricUV(g);
};

/** Precast element: a box with a small arris radius so the edges catch light like real cast concrete. */
export const cast = (min: Vec3, max: Vec3, radius = 0.012) => {
  const s = size(min, max), c = centre(min, max);
  const g = new RoundedBoxGeometry(s[0], s[1], s[2], 2, Math.min(radius, Math.min(...s) * 0.3));
  g.translate(...c);
  return metricUV(g);
};

/** Opening in wall coordinates: [x0, x1, y0, y1], x along the wall, y up from the floor. */
export type Rect = [number, number, number, number];

/** Solid parts of an L × H rectangle minus openings, as non-overlapping vertical strips. */
export const solidRects = (L: number, H: number, holes: Rect[]): Rect[] => {
  const cl = (v: number) => Math.min(L, Math.max(0, v));
  const xs = [...new Set([0, L, ...holes.flatMap((h) => [cl(h[0]), cl(h[1])])])].sort((a, b) => a - b);
  const out: Rect[] = [];
  for (let i = 0; i < xs.length - 1; i++) {
    const a = xs[i], b = xs[i + 1];
    if (b - a < 1e-4) continue;
    const mid = (a + b) / 2;
    const cuts = holes
      .filter((h) => h[0] < mid && h[1] > mid)
      .map((h) => [Math.max(0, h[2]), Math.min(H, h[3])])
      .sort((p, q) => p[0] - q[0]);
    let y = 0;
    for (const [y0, y1] of cuts) {
      if (y0 - y > 1e-4) out.push([a, b, y, y0]);
      y = Math.max(y, y1);
    }
    if (H - y > 1e-4) out.push([a, b, y, H]);
  }
  return out;
};

/** Flat panel (render coat, cladding board) with openings, between local z0 and z1. */
export const panelBoxes = (L: number, H: number, z0: number, z1: number, holes: Rect[]): [Vec3, Vec3][] =>
  solidRects(L, H, holes).map((r) => [[r[0], r[2], z0], [r[1], r[3], z1]]);
export const panel = (L: number, H: number, z0: number, z1: number, holes: Rect[]) => merge(panelBoxes(L, H, z0, z1, holes).map(([a, b]) => box(a, b)));

type Span = [number, number];
const subtract = (span: Span, cuts: Span[]): Span[] => {
  let out: Span[] = [span];
  for (const [c0, c1] of cuts) {
    out = out.flatMap(([a, b]) => {
      if (c1 <= a || c0 >= b) return [[a, b] as Span];
      const r: Span[] = [];
      if (c0 > a) r.push([a, c0]);
      if (c1 < b) r.push([c1, b]);
      return r;
    });
  }
  return out.filter(([a, b]) => b - a > 1e-3);
};

/**
 * Running-bond blockwork filling an L × H bay around openings (opening edges sit on course
 * lines), a precast lintel over every opening that stops below the top, and a recessed mortar
 * bed per course. Pieces come out in laying order: course by course, along the wall.
 */
export const masonry = (L: number, H: number, z0: number, z1: number, holes: Rect[], o = { block: 0.4, course: 0.2, joint: 0.01 }) => {
  const pieces: Piece[] = [];
  const t = z1 - z0, zc = (z0 + z1) / 2;
  const lintels = holes.filter((h) => h[3] < H - 1e-3).map((h) => ({ x0: Math.max(0, h[0] - 0.2), x1: Math.min(L, h[1] + 0.2), y0: h[3], y1: Math.min(H, h[3] + o.course), done: false }));
  let tone = 0.37;
  for (let k = 0, y = 0; y < H - 1e-4; k++, y += o.course) {
    const y1 = Math.min(H, y + o.course), h = y1 - y;
    const blocked: Span[] = holes.filter((q) => q[2] < y1 - 1e-4 && q[3] > y + 1e-4).map((q) => [q[0], q[1]]);
    const course: Piece[] = [];
    for (const l of lintels) {
      if (l.y0 < y1 - 1e-4 && l.y1 > y + 1e-4) {
        blocked.push([l.x0, l.x1]);
        if (!l.done) {
          course.push({ c: [(l.x0 + l.x1) / 2, (l.y0 + l.y1 - o.joint) / 2, zc], s: [l.x1 - l.x0 - o.joint, l.y1 - l.y0 - o.joint, t], tone: 1.06 });
          l.done = true;
        }
      }
    }
    const offset = (k % 2) * (o.block / 2);
    const spans = subtract([0, L], blocked);
    for (const [a, b] of spans) {
      const cuts = [a];
      for (let g = Math.ceil((a + offset) / o.block) * o.block - offset; g < b - 0.05; g += o.block) if (g > a + 0.05) cuts.push(g);
      cuts.push(b);
      for (let i = 0; i < cuts.length - 1; i++) {
        tone = (tone * 9301 + 49297) % 233280 / 233280;
        course.push({ c: [(cuts[i] + cuts[i + 1]) / 2, y + (h - o.joint) / 2, zc], s: [cuts[i + 1] - cuts[i] - o.joint, h - o.joint, t], tone: 0.93 + tone * 0.1 });
      }
    }
    course.sort((p, q) => p.c[0] - q.c[0]);
    pieces.push(...course);
    // mortar bed: recessed, appears once the course is complete so open joints never show daylight
    for (const [a, b] of spans) pieces.push({ c: [(a + b) / 2, y + h / 2, zc], s: [b - a, h, t - 0.024], tone: 0.82, instant: true });
  }
  return pieces;
};

/** Local bounds of a piece list. */
export const pieceBounds = (pieces: Piece[]) => {
  const min: Vec3 = [Infinity, Infinity, Infinity], max: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const p of pieces)
    for (let a = 0; a < 3; a++) {
      min[a] = Math.min(min[a], p.c[a] - p.s[a] / 2);
      max[a] = Math.max(max[a], p.c[a] + p.s[a] / 2);
    }
  return { min, max };
};

/** Bounds of a set of boxes given as [min, max] corners. */
export const boundsOf = (...boxes: [Vec3, Vec3][]) => {
  const min: Vec3 = [Infinity, Infinity, Infinity], max: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (const [a, b] of boxes)
    for (let i = 0; i < 3; i++) {
      min[i] = Math.min(min[i], a[i]);
      max[i] = Math.max(max[i], b[i]);
    }
  return { min, max };
};

export const sub = (geom: BufferGeometry, material?: string): SubMesh => ({ geom, material });
