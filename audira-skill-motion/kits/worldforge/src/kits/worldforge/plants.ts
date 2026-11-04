// Procedural plants for close-ups: curved, cupped leaves assembled into rosettes (lettuce,
// herbs) and a seedling (stem, two cotyledons, first true leaves). Leaves are bent strips
// with a pointed-oval outline, so silhouettes and light read correctly at macro distance.

import { BufferGeometry, CatmullRomCurve3, PlaneGeometry, TubeGeometry, Vector3 } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { mulberry32 } from "./noise.ts";

export type LeafSpec = {
  length: number;
  width: number;
  /** Start angle above horizontal (radians) and how much it bends down along its length. */
  rise: number;
  droop: number;
  /** Cupping across the blade and edge ruffle amplitude (fractions of width). */
  cup: number;
  ruffle: number;
};

/** One leaf pointing along +z from the origin. */
export const leafGeometry = (s: LeafSpec, seed = 1, segU = 8, segV = 18) => {
  const g = new PlaneGeometry(1, 1, segU, segV);
  const p = g.attributes.position;
  const rnd = mulberry32(seed);
  const ph = rnd() * 6;
  // integrate the midrib: angle falls from `rise` by `droop` along the length
  const rib: [number, number][] = [[0, 0]];
  for (let k = 1; k <= segV; k++) {
    const v = (k - 0.5) / segV;
    const a = s.rise - s.droop * v * v;
    const dl = s.length / segV;
    const [z, y] = rib[k - 1];
    rib.push([z + Math.cos(a) * dl, y + Math.sin(a) * dl]);
  }
  for (let i = 0; i < p.count; i++) {
    const u = p.getX(i); // -0.5..0.5
    const v = p.getY(i) + 0.5; // 0..1
    const k = Math.round(v * segV);
    const w = s.width * Math.sin(Math.PI * Math.pow(v, 0.75)) * (1 - 0.2 * v);
    const [z, y] = rib[k];
    const x = u * w;
    const edge = Math.abs(u * 2);
    const yy = y + s.cup * w * edge * edge + s.ruffle * w * edge * edge * Math.sin(v * 13 + ph + u * 2);
    p.setXYZ(i, x, yy, z);
  }
  g.computeVertexNormals();
  return g;
};

const rotY = (g: BufferGeometry, a: number) => g.rotateY(a);

export type RosetteSpec = { leaves: number; leaf: LeafSpec; inner: number };

/** Leaves on a golden-angle spiral; inner leaves are shorter and more upright. */
export const rosetteGeometry = (r: RosetteSpec, seed = 7) => {
  const rnd = mulberry32(seed);
  const parts: BufferGeometry[] = [];
  for (let i = 0; i < r.leaves; i++) {
    const t = i / (r.leaves - 1); // 0 outer → 1 inner
    const L = { ...r.leaf };
    L.length *= 1 - t * (1 - r.inner) + (rnd() - 0.5) * 0.12;
    L.width *= 1 - t * 0.4;
    L.rise = r.leaf.rise + t * 0.75;
    L.droop = r.leaf.droop * (1 - t * 0.7);
    const g = leafGeometry(L, seed * 31 + i);
    rotY(g, i * 2.39996 + rnd() * 0.2);
    g.translate(0, t * 0.02, 0);
    parts.push(g);
  }
  const m = mergeGeometries(parts, false)!;
  m.computeBoundingSphere();
  return m;
};

/** A seedling about 6 cm tall: curved stem, two cotyledons, two small true leaves. */
export const seedlingGeometry = () => {
  const stem = new TubeGeometry(
    new CatmullRomCurve3([new Vector3(0, -0.01, 0), new Vector3(0.003, 0.016, 0.001), new Vector3(0.002, 0.032, -0.002), new Vector3(0, 0.042, 0)]),
    16,
    0.0028,
    8,
  );
  const parts: BufferGeometry[] = [stem];
  for (const side of [0, Math.PI]) {
    const c = leafGeometry({ length: 0.024, width: 0.02, rise: 0.4, droop: 0.55, cup: 0.3, ruffle: 0 }, 3);
    c.rotateY(side + Math.PI / 2);
    c.translate(0, 0.04, 0);
    parts.push(c);
  }
  for (const side of [0.3, Math.PI + 0.3]) {
    const l = leafGeometry({ length: 0.026, width: 0.017, rise: 1.05, droop: 0.9, cup: 0.35, ruffle: 0.05 }, 5);
    l.rotateY(side);
    l.translate(0, 0.043, 0);
    parts.push(l);
  }
  const strip = (g: BufferGeometry) => {
    for (const k of Object.keys(g.attributes)) if (k !== "position" && k !== "normal" && k !== "uv") g.deleteAttribute(k);
    return g.index ? g.toNonIndexed() : g;
  };
  return mergeGeometries(parts.map(strip), false)!;
};

export const PLANT_KINDS = {
  lettuce: { leaves: 13, inner: 0.45, leaf: { length: 0.17, width: 0.12, rise: 0.25, droop: 0.9, cup: 0.3, ruffle: 0.12 } },
  romaine: { leaves: 10, inner: 0.6, leaf: { length: 0.24, width: 0.08, rise: 0.85, droop: 0.6, cup: 0.25, ruffle: 0.05 } },
  herb: { leaves: 16, inner: 0.5, leaf: { length: 0.11, width: 0.035, rise: 0.7, droop: 0.9, cup: 0.15, ruffle: 0.02 } },
} satisfies Record<string, RosetteSpec>;
