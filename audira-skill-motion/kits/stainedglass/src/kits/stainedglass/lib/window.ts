// Window layout for STAINEDGLASS: a pointed lancet filled with diamond quarries that picture an original
// scene (sky, a fruiting tree, hills, a river) under a rose window with a golden sun at its heart.
import * as THREE from "three";
import { STAINED_PALETTE as P } from "./palette";
import { mulberry32 } from "../core/motion";

export const HALF_W = 1.5; // lancet half width
export const SILL_Y = -3; // bottom of the glass
export const SPRING_Y = 2; // where the arch springs
export const ARCH_R = 3; // equilateral arch radius
export const ROSE: { x: number; y: number; r: number } = { x: 0, y: 2.75, r: 1.22 };
export const DIAMOND = { a: 0.17, b: 0.24 }; // half width / half height of a quarry

export const insideLancet = (x: number, y: number, m = 0) => {
  if (Math.abs(x) > HALF_W - m || y < SILL_Y + m) return false;
  if (y <= SPRING_Y) return true;
  const dl = Math.hypot(x - HALF_W, y - SPRING_Y);
  const dr = Math.hypot(x + HALF_W, y - SPRING_Y);
  return dl <= ARCH_R - m && dr <= ARCH_R - m;
};

export const lancetShape = (pad = 0) => {
  const s = new THREE.Shape();
  const w = HALF_W + pad;
  const r = ARCH_R + pad;
  s.moveTo(-w, SILL_Y - pad);
  s.lineTo(w, SILL_Y - pad);
  s.lineTo(w, SPRING_Y);
  // right arc: centre (-HALF_W, SPRING_Y) from angle 0 to apex
  const apexA = Math.acos(HALF_W / ARCH_R);
  s.absarc(-HALF_W, SPRING_Y, r, 0, apexA, false);
  // left arc: centre (+HALF_W, SPRING_Y) from apex to PI
  s.absarc(HALF_W, SPRING_Y, r, Math.PI - apexA, Math.PI, false);
  s.lineTo(-w, SILL_Y - pad);
  return s;
};

export type Pane = { x: number; y: number; color: THREE.Color; delay: number; seed: number };
export type RoseSeg = { r0: number; r1: number; a0: number; a1: number; color: THREE.Color; delay: number; seed: number };

const col = (hex: string, k = 1) => new THREE.Color(hex).multiplyScalar(k);

/** Colour of the picture at a point: the "cartoon" the glazier works from. */
const picture = (x: number, y: number, i: number, j: number, rnd: () => number) => {
  const alt = (i + j) % 2 === 0;
  if (Math.abs(x) > 1.2 || y < SILL_Y + 0.3) return alt ? col(P.ruby) : col(P.amber);
  if (y < -2.25 + 0.08 * Math.sin(x * 4)) return alt ? col(P.sapphire) : col(P.azure, 0.9);
  if (Math.abs(x) < 0.15 && y < 0.15 && y > -1.6) return col(P.umber, 0.9 + rnd() * 0.2);
  if (x * x + (y - 0.6) * (y - 0.6) * 1.35 < 0.92 * 0.92) {
    const r = rnd();
    return r < 0.14 ? col(P.sunGold) : r < 0.2 ? col(P.ruby) : r < 0.7 ? col(P.emeraldLight, 1.1) : col(P.emerald);
  }
  if (y < -1.3 + 0.35 * Math.cos(x * 1.6)) return alt ? col(P.emerald, 0.6) : col(P.emerald, 0.75);
  const k = Math.min(1, Math.max(0, (y + 1.0) / 4.5));
  const c = new THREE.Color(P.azure).lerp(new THREE.Color(P.skyPale), k);
  if (rnd() < 0.06) c.set(P.violet);
  return c.multiplyScalar(0.92 + rnd() * 0.16);
};

export const buildPanes = () => {
  const rnd = mulberry32(5801);
  const panes: Pane[] = [];
  const { a, b } = DIAMOND;
  for (let j = 0; j < 40; j++) {
    const y = SILL_Y + b * j;
    for (let i = -6; i <= 6; i++) {
      const x = 2 * a * i + (j % 2 ? a : 0);
      if (!insideLancet(x, y, -0.12)) continue;
      if (Math.hypot(x - ROSE.x, y - ROSE.y) < ROSE.r + 0.1) continue;
      const color = picture(x, y, i, j, rnd);
      // top of window first, sweeping down to the sill
      const delay = 1.7 + ((4.4 - y) / 7.4) * 5.4 + rnd() * 0.5;
      panes.push({ x, y, color, delay, seed: rnd() });
    }
  }
  const rose: RoseSeg[] = [];
  const rings: [number, number, number, string[]][] = [
    [0.0, 0.3, 1, [P.sunGold]],
    [0.33, 0.68, 8, [P.ruby, P.amber]],
    [0.71, 0.98, 16, [P.sapphire, P.emerald]],
    [1.01, 1.2, 32, [P.sunGold, P.rubyDeep]],
  ];
  rings.forEach(([r0, r1, n, cols], ring) => {
    for (let k = 0; k < n; k++) {
      const a0 = (k / n) * Math.PI * 2 + Math.PI / 2;
      rose.push({ r0, r1, a0, a1: a0 + (Math.PI * 2) / n, color: col(cols[k % cols.length]), delay: 0.15 + ring * 0.45 + (k / n) * 0.35, seed: rnd() });
    }
  });
  return { panes, rose };
};

/** Seedy hand-blown glass: streaks, bubbles and thickness variation, multiplied over each pane colour. */
export const makeGlassTexture = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const rnd = mulberry32(5802);
  const grad = g.createLinearGradient(0, 0, 128, 128);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(0.5, "#d9d9d9");
  grad.addColorStop(1, "#f2f2f2");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 26; i++) {
    g.strokeStyle = `rgba(255,255,255,${0.15 + rnd() * 0.25})`;
    g.lineWidth = 1 + rnd() * 3;
    g.beginPath();
    const y = rnd() * 128;
    g.moveTo(0, y);
    g.bezierCurveTo(40, y + (rnd() - 0.5) * 30, 90, y + (rnd() - 0.5) * 30, 128, y + (rnd() - 0.5) * 20);
    g.stroke();
  }
  for (let i = 0; i < 40; i++) {
    g.fillStyle = `rgba(255,255,255,${0.3 + rnd() * 0.5})`;
    g.beginPath();
    g.arc(rnd() * 128, rnd() * 128, 0.6 + rnd() * 1.8, 0, Math.PI * 2);
    g.fill();
  }
  // darker edge (glass thickens at the came)
  const edge = g.createRadialGradient(64, 64, 30, 64, 64, 90);
  edge.addColorStop(0, "rgba(0,0,0,0)");
  edge.addColorStop(1, "rgba(0,0,0,0.35)");
  g.fillStyle = edge;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

/** The window image projected on the floor: same panes, blurred, flipped (sun shines down into the nave). */
export const makeFloorPoolTexture = (panes: Pane[], rose: RoseSeg[]) => {
  const W = 256;
  const H = 512;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, W, H);
  const minY = SILL_Y - 0.2;
  const maxY = ROSE.y + ROSE.r + 0.6;
  const toPx = (x: number, y: number): [number, number] => [((x + 1.8) / 3.6) * W, ((y - minY) / (maxY - minY)) * H];
  g.filter = "blur(5px)";
  const { a, b } = DIAMOND;
  for (const p of panes) {
    g.fillStyle = `#${p.color.getHexString()}`;
    g.beginPath();
    const pts: [number, number][] = [[p.x, p.y + b], [p.x + a, p.y], [p.x, p.y - b], [p.x - a, p.y]];
    pts.forEach(([x, y], i) => {
      const [px, py] = toPx(x, y);
      if (i === 0) g.moveTo(px, py);
      else g.lineTo(px, py);
    });
    g.closePath();
    g.fill();
  }
  for (const s of rose) {
    g.fillStyle = `#${s.color.getHexString()}`;
    g.beginPath();
    const [cx, cy] = toPx(ROSE.x, ROSE.y);
    const sx = W / 3.6;
    const sy = H / (maxY - minY);
    for (let k = 0; k <= 8; k++) {
      const ang = s.a0 + ((s.a1 - s.a0) * k) / 8;
      g.lineTo(cx + Math.cos(ang) * s.r1 * sx, cy + Math.sin(ang) * s.r1 * sy);
    }
    for (let k = 8; k >= 0; k--) {
      const ang = s.a0 + ((s.a1 - s.a0) * k) / 8;
      g.lineTo(cx + Math.cos(ang) * s.r0 * sx, cy + Math.sin(ang) * s.r0 * sy);
    }
    g.closePath();
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};
