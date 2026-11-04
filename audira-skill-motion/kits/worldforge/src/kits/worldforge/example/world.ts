// WORLDFORGE starter — a second, non-Mars world built only from src/worldforge/ modules, to
// test that the toolkit is world-agnostic: an ancient hilltop citadel above a dry valley,
// Earth sky, afternoon sun. Pure TS (no three.js), like mars/field.ts + mars/terrain.ts.

import { clamp01, fbm, lerp, ridged, smooth } from "../noise.ts";
import { bakeAO, bakeSun, expAxis, gridNormals, inside, lookup, makeGrid, makeWorldHeight, type Grid } from "../heightfield.ts";

type V3 = [number, number, number];
const norm = (v: V3): V3 => {
  const l = Math.hypot(...v);
  return [v[0] / l, v[1] / l, v[2] / l];
};

/** Afternoon sun from the south-east, 25° high. */
export const STARTER_SUN: V3 = norm([0.62, 0.47, 0.62]);
/** The citadel plateau. */
export const PLATEAU = { x: 0, z: -20, r: 95, h: 24 };

export const height = (x: number, z: number) => {
  let h = 16 * fbm(x / 650, z / 650, 5) + 3 * fbm(x / 90, z / 90, 4) + 0.35 * fbm(x / 14, z / 14, 3);
  // a mountain ring on the horizon
  const R = Math.hypot(x, z);
  if (R > 1500) h += smooth(1800, 4200, R) * 520 * Math.pow(ridged(x / 1400 + 3, z / 1400, 6), 1.4);
  // a dry river valley winding across the foreground
  const vz = 170 + 60 * Math.sin(x / 230);
  const dv = (z - vz) / 55;
  h -= 13 * Math.exp(-dv * dv);
  // the plateau the citadel stands on (stepped edge)
  const p = Math.hypot(x - PLATEAU.x, z - PLATEAU.z);
  const k = 1 - smooth(PLATEAU.r * 0.75, PLATEAU.r * 1.35, p);
  h = lerp(h, PLATEAU.h + 0.25 * fbm(x / 20, z / 20, 2), k);
  return h;
};

const lin = (hex: number) =>
  [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255].map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
const GRASS = lin(0x7a7a44), DRY = lin(0xa8925a), ROCK = lin(0x8b8479), SAND = lin(0xc4aa7c), PAVE = lin(0xb9a98d);

const albedo = (x: number, z: number, h: number, ny: number, out: number[]) => {
  const v = 0.5 + 0.5 * fbm(x / 140, z / 140, 3);
  for (let c = 0; c < 3; c++) out[c] = lerp(GRASS[c], DRY[c], v);
  const slope = 1 - ny;
  const mix = (col: number[], t: number) => {
    for (let c = 0; c < 3; c++) out[c] += (col[c] - out[c]) * clamp01(t);
  };
  const vz = 170 + 60 * Math.sin(x / 230);
  mix(SAND, Math.exp(-(((z - vz) / 30) ** 2)) * 0.9);
  mix(ROCK, smooth(0.18, 0.45, slope));
  mix(PAVE, (1 - smooth(PLATEAU.r * 0.55, PLATEAU.r * 0.8, Math.hypot(x - PLATEAU.x, z - PLATEAU.z))) * 0.8);
  mix(lin(0xdad6cf), smooth(260, 420, h) * 0.85); // snow on the high peaks
  return out;
};

export type Part = { grid: Grid; normals: Float32Array; color: Float32Array; shade: Float32Array };
let cache: { near: Part; far: Part; heightAt: (x: number, z: number) => number } | null = null;

/** Same recipe as mars/terrain.ts: two graded grids, baked sun + AO, vertex albedo. */
export const getStarterTerrain = () => {
  if (cache) return cache;
  const near = makeGrid(expAxis(-520, 520, 1.2, 0.006), expAxis(-520, 520, 1.2, 0.006), height);
  const fa = expAxis(-9000, 9000, 14, 0.009);
  const far = makeGrid(fa, fa, height);
  const world = makeWorldHeight(near, far);
  let maxH = -1e9;
  for (const v of far.h) maxH = Math.max(maxH, v);
  const opts = { sun: STARTER_SUN, maxH: maxH + 2, maxDist: 3500, soft: 0.02 };
  const part = (g: Grid, aoR: number): Part => {
    const sun = bakeSun(g, world, opts), ao = bakeAO(g, world, aoR, 0.8), normals = gridNormals(g);
    const n = g.ax.n * g.az.n;
    const color = new Float32Array(n * 3), shade = new Float32Array(n * 2), c = [0, 0, 0];
    for (let j = 0; j < g.az.n; j++)
      for (let i = 0; i < g.ax.n; i++) {
        const k = j * g.ax.n + i;
        albedo(g.ax.coord[i], g.az.coord[j], g.h[k], normals[k * 3 + 1], c);
        color.set(c, k * 3);
        shade[k * 2] = sun[k];
        shade[k * 2 + 1] = ao[k];
      }
    return { grid: g, normals, color, shade };
  };
  const nearP = part(near, 40), farP = part(far, 500);
  for (let j = 0; j < far.az.n; j++)
    for (let i = 0; i < far.ax.n; i++) if (inside(near, far.ax.coord[i], far.az.coord[j], 0.5)) far.h[j * far.ax.n + i] -= 3;
  cache = { near: nearP, far: farP, heightAt: (x, z) => (inside(near, x, z) ? lookup(near, x, z) : lookup(far, x, z) + 3) };
  return cache;
};
