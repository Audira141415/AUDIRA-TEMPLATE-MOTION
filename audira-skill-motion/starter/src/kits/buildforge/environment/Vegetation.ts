// Planting geometry: trees and shrubs as soft, irregular foliage masses (noise-displaced
// clusters with per-vertex colour: darker and cooler underneath, lighter where the sun hits).
// Origin at the base, so "grow" scales them up out of the ground.

import { BoxGeometry, BufferAttribute, CylinderGeometry, IcosahedronGeometry, type BufferGeometry, Color, Vector3 } from "three";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { noise3, rng } from "../geometry/noise.ts";
import type { SubMesh } from "../types.ts";

export type Palette = { low: string; mid: string; high: string };

const blob = (r: number, cx: number, cy: number, cz: number, seed: number, stretchY = 1, detail = 3) => {
  const ico = new IcosahedronGeometry(r, detail);
  ico.deleteAttribute("normal");
  ico.deleteAttribute("uv");
  // shared vertices → smooth normals after displacement (no faceted "low-poly toy" look)
  const g = mergeVertices(ico);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const k = 1 + 0.34 * noise3(x * 1.6 / r + seed, y * 1.6 / r, z * 1.6 / r) + 0.16 * noise3(x * 5 / r, y * 5 / r + seed, z * 5 / r) + 0.07 * noise3(x * 13 / r + seed, y * 13 / r, z * 13 / r);
    p.setXYZ(i, cx + x * k, cy + y * k * stretchY, cz + z * k);
  }
  return g;
};

const merge = (gs: BufferGeometry[]) => mergeGeometries(gs, false)!;

const paint = (g: BufferGeometry, pal: Palette, y0: number, y1: number, seed: number) => {
  const lo = new Color(pal.low), mid = new Color(pal.mid), hi = new Color(pal.high), c = new Color();
  const p = g.attributes.position;
  const col = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++) {
    const t = Math.min(1, Math.max(0, (p.getY(i) - y0) / (y1 - y0)));
    const n = noise3(p.getX(i) * 0.9 + seed, p.getY(i) * 0.9, p.getZ(i) * 0.9);
    c.copy(lo).lerp(mid, Math.min(1, t * 1.6)).lerp(hi, Math.max(0, t - 0.55) * 1.6).multiplyScalar(0.92 + n * 0.3);
    col.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute("color", new BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
};

/**
 * Deciduous tree, `h` metres tall: a forked trunk under a crown built from many leaf masses.
 * `spread` > 1 flattens and widens the crown (open-grown shade trees).
 */
export const roundTree = (h: number, seed: number, pal: Palette, spread = 1): SubMesh[] => {
  const r = rng(seed);
  const trunkH = h * 0.4;
  const trunk = new CylinderGeometry(h * 0.016, h * 0.028, trunkH, 7);
  trunk.translate(0, trunkH / 2, 0);
  const crownR = h * 0.31, cy = trunkH + crownR * 0.7;
  const limbs = [trunk];
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + r(), len = crownR * 0.9;
    const limb = new CylinderGeometry(h * 0.006, h * 0.012, len, 5);
    limb.translate(0, len / 2, 0);
    limb.rotateZ(0.65);
    limb.rotateY(a);
    limb.translate(0, trunkH * 0.88, 0);
    limbs.push(limb);
  }
  const masses = [];
  for (let i = 0; i < 22; i++) {
    // leaf masses fill an ellipsoid, the outer ones smaller so the silhouette breaks up
    const a = r() * Math.PI * 2, u = r() * 2 - 1, d = Math.cbrt(0.25 + r() * 0.75);
    const x = Math.cos(a) * Math.sqrt(1 - u * u) * d, y = u * d, z = Math.sin(a) * Math.sqrt(1 - u * u) * d;
    const rr = crownR * (0.44 - d * 0.17) * (0.8 + r() * 0.4);
    masses.push(blob(rr * (0.85 + 0.15 * spread), x * crownR * 0.8 * spread, cy + (y * crownR * 0.6) / spread, z * crownR * 0.8 * spread, seed * 7 + i, 0.88 / spread, 2));
  }
  const crown = paint(merge(masses), pal, cy - crownR * 0.8, cy + crownR * 0.9, seed);
  return [{ geom: mergeGeometries(limbs.map((g) => g.toNonIndexed()))!, material: "bark" }, { geom: crown, material: "foliage" }];
};

/** Slender columnar tree (garden accent): stacked leaf masses on a short trunk. */
export const columnTree = (h: number, seed: number, pal: Palette): SubMesh[] => {
  const r = rng(seed);
  const trunk = new CylinderGeometry(h * 0.01, h * 0.018, h * 0.3, 6);
  trunk.translate(0, h * 0.15, 0);
  const masses = [];
  for (let i = 0; i < 9; i++) {
    const t = i / 8, y = h * (0.26 + t * 0.62), w = h * 0.11 * Math.sin(Math.PI * (0.12 + t * 0.82));
    const a = r() * 6.28;
    masses.push(blob(w * (0.8 + r() * 0.3), Math.cos(a) * w * 0.25, y, Math.sin(a) * w * 0.25, seed * 5 + i, 1.25, 2));
  }
  return [{ geom: trunk, material: "bark" }, { geom: paint(merge(masses), pal, h * 0.2, h, seed), material: "foliage" }];
};

/** Low shrub clump of `n` rounded masses within radius `r`. */
export const shrub = (r: number, seed: number, pal: Palette, n = 5): SubMesh[] => {
  const q = rng(seed);
  const parts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + q(), d = i === 0 ? 0 : r * 0.5;
    const rr = r * (i === 0 ? 0.62 : 0.42 + q() * 0.2);
    return blob(rr, Math.cos(a) * d, rr * 0.75, Math.sin(a) * d, seed + i, 0.85, 2);
  });
  return [{ geom: paint(merge(parts), pal, 0, r * 1.4, seed), material: "foliage" }];
};

/** Clipped hedge: a rounded box with a leafy, slightly uneven surface. Origin at the base centre. */
export const hedge = (len: number, h: number, d: number, seed: number, pal: Palette): SubMesh[] => {
  const box = new BoxGeometry(len, h, d, Math.ceil(len * 6), Math.ceil(h * 6), Math.ceil(d * 6));
  box.deleteAttribute("normal");
  box.deleteAttribute("uv");
  const g = mergeVertices(box);
  const p = g.attributes.position;
  const half = new Vector3(len / 2, h / 2, d / 2), r = Math.min(h, d) * 0.16;
  const v = new Vector3(), q = new Vector3(), n = new Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    q.set(Math.max(-half.x + r, Math.min(half.x - r, v.x)), Math.max(-half.y + r, Math.min(half.y - r, v.y)), Math.max(-half.z + r, Math.min(half.z - r, v.z)));
    n.subVectors(v, q);
    if (n.lengthSq() < 1e-9) continue;
    n.normalize();
    const k = r + 0.05 * noise3(v.x * 3 + seed, v.y * 3, v.z * 3) + 0.035 * noise3(v.x * 9, v.y * 9 + seed, v.z * 9);
    v.copy(q).addScaledVector(n, k);
    p.setXYZ(i, v.x, v.y + h / 2, v.z);
  }
  return [{ geom: paint(g, pal, 0, h, seed), material: "foliage" }];
};
