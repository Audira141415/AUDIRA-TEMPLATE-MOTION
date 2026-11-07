// The mosaic "cartoon": an original rising sun-bird over a gilded sun, on a lapis field, framed by a
// terracotta key border. Each tessera samples this signed-distance picture at its centre and orients
// itself along the nearest contour (andamento), like a real mosaicist laying rows around a shape.
import * as THREE from "three";
import { MOSAIC_PALETTE as P } from "./palette";
import { mulberry32, tileDelay } from "../core/motion";

export const PANEL = { w: 6, h: 9, pitch: 0.09 };
export const SUN = { u: 0, v: 1.25, r: 1.75 };

export type Tile = { x: number; z: number; color: THREE.Color; gold: boolean; rot: number; tilt: [number, number]; size: number; delay: number; seed: number };

const capsule = (u: number, v: number, ax: number, ay: number, bx: number, by: number, ra: number, rb: number) => {
  const px = u - ax;
  const py = v - ay;
  const dx = bx - ax;
  const dy = by - ay;
  const h = Math.min(1, Math.max(0, (px * dx + py * dy) / (dx * dx + dy * dy)));
  return { d: Math.hypot(px - dx * h, py - dy * h) - (ra + (rb - ra) * h), h };
};

const ellipse = (u: number, v: number, cx: number, cy: number, rx: number, ry: number) => (Math.hypot((u - cx) / rx, (v - cy) / ry) - 1) * Math.min(rx, ry);

/** Signed distance to the bird (negative inside) + which part was hit. */
export const birdSdf = (u: number, v: number) => {
  const body = ellipse(u, v, 0, 0.2, 0.44, 1.0);
  const head = Math.hypot(u, v - 1.42) - 0.33;
  // beak: small upward wedge
  const beak = Math.max(Math.abs(u) * 2.4 + (v - 2.05), -(v - 1.66));
  const side = u < 0 ? -1 : 1;
  const wing = capsule(Math.abs(u), v, 0.3, 0.55, 2.35, 2.55, 0.55, 0.18);
  // tail fan
  const tail = Math.max(Math.abs(u) - (0.12 + (-0.5 - v) * 0.42), Math.max(v - -0.45, -2.2 - v));
  let d = Math.min(body, head, beak, wing.d, tail);
  let part = "body";
  if (d === head) part = "head";
  else if (d === beak) part = "beak";
  else if (d === wing.d) part = "wing";
  else if (d === tail) part = "tail";
  d = Math.min(d, 9);
  return { d, part, h: wing.h, side };
};

const c = (hex: string, k = 1) => new THREE.Color(hex).multiplyScalar(k);

export const sample = (u: number, v: number, rnd: () => number): { color: THREE.Color; gold: boolean; rot: number } => {
  const W = PANEL.w / 2;
  const H = PANEL.h / 2;
  const edge = Math.min(W - Math.abs(u), H - Math.abs(v));
  const jitter = 0.9 + rnd() * 0.18;

  // border: terracotta frame with a cream stepped key
  if (edge < 0.1) return { color: c(P.terracottaDark, jitter), gold: false, rot: 0 };
  if (edge < 0.28) {
    const along = Math.abs(u) > W - 0.3 ? v : u;
    const key = Math.floor((along + 10) / 0.27) % 2 === 0;
    const inner = edge > 0.19;
    return { color: key !== inner ? c(P.cream, jitter) : c(P.terracotta, jitter), gold: false, rot: 0 };
  }
  if (edge < 0.37) return { color: c(P.gold, jitter), gold: true, rot: 0 };

  const b = birdSdf(u, v);
  const eps = 0.02;
  const gx = birdSdf(u + eps, v).d - birdSdf(u - eps, v).d;
  const gy = birdSdf(u, v + eps).d - birdSdf(u, v - eps).d;
  const contourRot = Math.atan2(gy, gx);

  if (Math.abs(b.d) < 0.075) return { color: c(P.umber, jitter), gold: false, rot: contourRot };
  if (b.d < 0) {
    // eye
    if (Math.hypot(Math.abs(u) - 0.13, v - 1.47) < 0.06) return { color: c(P.umber), gold: false, rot: contourRot };
    if (b.part === "beak") return { color: c(P.gold, jitter), gold: true, rot: contourRot };
    if (b.part === "head") return { color: c(P.terracottaDark, jitter * 1.1), gold: false, rot: contourRot };
    if (b.part === "body") {
      const chest = Math.abs(u) < 0.22 && v > -0.3 && v < 0.8;
      return { color: chest ? c(P.ochre, jitter) : c(P.terracotta, jitter), gold: false, rot: contourRot };
    }
    if (b.part === "tail") {
      const band = Math.floor((-v) / 0.32) % 2 === 0;
      return { color: band ? c(P.ochre, jitter) : c(P.terracottaDark, jitter), gold: false, rot: contourRot };
    }
    // wing feather bands along the wing (shoulder -> tip)
    const bands = [P.terracottaDark, P.terracotta, P.ochre, P.cream, P.gold];
    const idx = Math.min(bands.length - 1, Math.floor(b.h * bands.length * 1.05));
    const isGold = bands[idx] === P.gold;
    return { color: c(bands[idx], jitter), gold: isGold, rot: contourRot };
  }

  // gilded sun + rays behind the bird
  const du = u - SUN.u;
  const dv = v - SUN.v;
  const r = Math.hypot(du, dv);
  const ang = Math.atan2(dv, du);
  const ringRot = ang + Math.PI / 2;
  if (r < SUN.r) return { color: c(r > SUN.r - 0.14 ? P.ochre : P.gold, jitter), gold: r <= SUN.r - 0.14, rot: ringRot };
  const ray = Math.floor(((ang + Math.PI) / (Math.PI * 2)) * 24) % 2 === 0;
  if (r < SUN.r + 0.95 - (ray ? 0 : 0.45)) return { color: c(ray ? P.goldPale : P.ochre, jitter), gold: ray, rot: ang };

  // lapis field laid in rings around the sun (opus vermiculatum)
  const ring = Math.floor(r / 0.18) % 3;
  const field = ring === 0 ? P.lapisDeep : ring === 1 ? P.lapis : P.lapisDeep;
  const star = rnd() < 0.012;
  return { color: star ? c(P.bone) : c(field, jitter), gold: false, rot: ringRot };
};

/** Lay every tessera: grid with tiny jitter; picture v axis = world -z (top of image is far). */
export const layTiles = () => {
  const rnd = mulberry32(6001);
  const tiles: Tile[] = [];
  const cols = Math.round(PANEL.w / PANEL.pitch);
  const rows = Math.round(PANEL.h / PANEL.pitch);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = -PANEL.w / 2 + (i + 0.5) * PANEL.pitch + (rnd() - 0.5) * 0.012;
      const z = -PANEL.h / 2 + (j + 0.5) * PANEL.pitch + (rnd() - 0.5) * 0.012;
      const s = sample(x, -z, rnd);
      tiles.push({
        x,
        z,
        color: s.color,
        gold: s.gold,
        rot: -s.rot + (rnd() - 0.5) * 0.12,
        tilt: [(rnd() - 0.5) * 0.09, (rnd() - 0.5) * 0.09],
        size: 0.9 + rnd() * 0.07,
        delay: tileDelay(z, rnd()),
        seed: rnd(),
      });
    }
  }
  return tiles;
};
