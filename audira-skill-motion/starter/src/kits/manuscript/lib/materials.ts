import * as THREE from "three";
import { mulberry32 } from "../core/motion";
import { MANUSCRIPT_PALETTE as P } from "./palette";

// All script in this kit is PSEUDO-SCRIPT: invented minims and loops for the codex,
// invented rounded glyphs for the lontar. Nothing here is readable text in any language.

type Ctx = CanvasRenderingContext2D;
const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};
const toTex = (c: HTMLCanvasElement, srgb = true) => {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

const parchment = (g: Ctx, w: number, h: number, seed: number) => {
  const rnd = mulberry32(seed);
  const grd = g.createRadialGradient(w / 2, h / 2, w * 0.1, w / 2, h / 2, w * 0.85);
  grd.addColorStop(0, "#F0E0BC");
  grd.addColorStop(1, P.parchmentEdge);
  g.fillStyle = grd;
  g.fillRect(0, 0, w, h);
  for (let i = 0; i < 40; i++) {
    const x = rnd() * w;
    const y = rnd() * h;
    const r = 10 + rnd() * 60;
    const s = g.createRadialGradient(x, y, 0, x, y, r);
    s.addColorStop(0, `rgba(150,110,60,${0.04 + rnd() * 0.06})`);
    s.addColorStop(1, "rgba(150,110,60,0)");
    g.fillStyle = s;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  for (let i = 0; i < 2500; i++) {
    g.fillStyle = `rgba(90,60,30,${rnd() * 0.08})`;
    g.fillRect(rnd() * w, rnd() * h, 1, 1);
  }
};

/** One line of invented book-hand: minims, ascenders, word gaps. */
export const drawPseudoLine = (g: Ctx, x0: number, y: number, width: number, size: number, seed: number, color: string) => {
  const rnd = mulberry32(seed);
  g.strokeStyle = color;
  g.fillStyle = color;
  g.lineCap = "round";
  let x = x0;
  while (x < x0 + width - size) {
    const word = 2 + Math.floor(rnd() * 6);
    for (let k = 0; k < word && x < x0 + width - size * 0.6; k++) {
      g.lineWidth = size * 0.16;
      const tall = rnd() < 0.18 ? size * 0.6 : 0;
      const desc = rnd() < 0.1 ? size * 0.45 : 0;
      g.beginPath();
      g.moveTo(x, y - size * 0.5 - tall);
      g.lineTo(x, y + desc);
      g.stroke();
      // diamond feet/heads typical of a broad nib
      g.beginPath();
      g.moveTo(x - size * 0.1, y);
      g.lineTo(x, y + size * 0.1);
      g.lineTo(x + size * 0.14, y - size * 0.02);
      g.fill();
      if (rnd() < 0.35) {
        g.beginPath();
        g.moveTo(x, y - size * 0.5);
        g.lineTo(x + size * 0.32, y - size * 0.42);
        g.stroke();
      }
      x += size * (0.3 + rnd() * 0.12);
    }
    x += size * 0.55;
  }
};

/** Left page: border vines, the illuminated initial box, finished text and a red rubric. */
export const makeLeftPageTexture = () => {
  const W = 620;
  const H = 860;
  const c = canvas(W, H);
  const g = c.getContext("2d")!;
  parchment(g, W, H, 11);
  // border vine (outer + bottom margins)
  g.lineWidth = 4;
  for (const [color, off] of [
    [P.lapis, 0],
    [P.rubricRed, 9],
  ] as [string, number][]) {
    g.strokeStyle = color;
    g.beginPath();
    for (let y = 40; y < H - 40; y += 4) g.lineTo(34 + off + Math.sin(y * 0.05 + off) * 8, y);
    g.stroke();
  }
  const rnd = mulberry32(3);
  for (let y = 60; y < H - 60; y += 46) {
    g.fillStyle = P.verdigris;
    g.beginPath();
    g.ellipse(46 + rnd() * 6, y, 12, 6, 0.6, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = P.goldLeaf;
    g.beginPath();
    g.arc(36, y + 22, 5, 0, Math.PI * 2);
    g.fill();
  }
  // illuminated initial box (the gold ornament itself is a raised 3D plate)
  g.fillStyle = P.lapis;
  g.fillRect(80, 60, 210, 210);
  g.strokeStyle = P.rubricRed;
  g.lineWidth = 10;
  g.strokeRect(80, 60, 210, 210);
  g.fillStyle = "rgba(255,255,255,0.75)";
  for (let i = 0; i < 40; i++) g.fillRect(92 + (i % 8) * 25, 72 + Math.floor(i / 8) * 40, 3, 3);
  // text block
  for (let i = 0; i < 15; i++) {
    const y = 300 + i * 34;
    drawPseudoLine(g, 90, y, 480, 22, 100 + i, i === 5 ? P.rubricRed : P.ironGallInk);
  }
  for (let i = 0; i < 6; i++) drawPseudoLine(g, 315, 92 + i * 32, 270, 22, 300 + i, P.ironGallInk);
  return toTex(c);
};

/** Right page: border, drypoint ruling, nothing written yet (ink lines are separate strips). */
export const makeRightPageTexture = () => {
  const W = 620;
  const H = 860;
  const c = canvas(W, H);
  const g = c.getContext("2d")!;
  parchment(g, W, H, 12);
  g.strokeStyle = "rgba(120,90,50,0.25)";
  g.lineWidth = 1;
  for (let i = 0; i < 12; i++) {
    const y = H / 2 - (0.3 - i * 0.052) * (H / 0.86);
    g.beginPath();
    g.moveTo(60, y);
    g.lineTo(560, y);
    g.stroke();
  }
  g.lineWidth = 4;
  g.strokeStyle = P.lapis;
  g.beginPath();
  for (let y = 40; y < H - 40; y += 4) g.lineTo(W - 34 + Math.sin(y * 0.05) * 8, y);
  g.stroke();
  g.strokeStyle = P.rubricRed;
  g.beginPath();
  for (let y = 40; y < H - 40; y += 4) g.lineTo(W - 44 + Math.sin(y * 0.05 + 2) * 8, y);
  g.stroke();
  return toTex(c);
};

/** One long ink line (transparent background) revealed by texture repeat as the quill writes. */
export const makeInkLineTexture = (seed: number, rubric: boolean) => {
  const c = canvas(1024, 64);
  const g = c.getContext("2d")!;
  drawPseudoLine(g, 8, 44, 1000, 40, seed, rubric ? P.rubricRed : P.ironGallInk);
  const t = toTex(c);
  t.wrapS = THREE.ClampToEdgeWrapping;
  return t;
};

/** Gold-leaf ornament (white = gold) used as alpha for the raised initial plate: an abstract knot, not a letter. */
export const makeInitialAlpha = () => {
  const c = canvas(256, 256);
  const g = c.getContext("2d")!;
  g.strokeStyle = "#fff";
  g.fillStyle = "#fff";
  g.lineCap = "round";
  g.lineWidth = 16;
  g.beginPath();
  g.arc(128, 128, 78, 0, Math.PI * 2);
  g.stroke();
  g.lineWidth = 10;
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2 + Math.PI / 4;
    g.beginPath();
    g.moveTo(128, 128);
    g.bezierCurveTo(128 + Math.cos(a) * 90, 128 + Math.sin(a) * 20, 128 + Math.cos(a + 0.8) * 70, 128 + Math.sin(a + 0.8) * 90, 128 + Math.cos(a + 1.2) * 40, 128 + Math.sin(a + 1.2) * 50);
    g.stroke();
    g.beginPath();
    g.arc(128 + Math.cos(a) * 100, 128 + Math.sin(a) * 100, 12, 0, Math.PI * 2);
    g.fill();
  }
  g.beginPath();
  g.arc(128, 128, 20, 0, Math.PI * 2);
  g.fill();
  return toTex(c, false);
};

/** Lontar palm leaf: fibre streaks, two string holes, incised rounded pseudo-glyphs blackened with soot. */
export const makeLontarTexture = (seed: number) => {
  const W = 1024;
  const H = 96;
  const c = canvas(W, H);
  const g = c.getContext("2d")!;
  const rnd = mulberry32(seed);
  g.fillStyle = P.lontar;
  g.fillRect(0, 0, W, H);
  for (let i = 0; i < 160; i++) {
    g.strokeStyle = `rgba(150,110,50,${0.12 + rnd() * 0.2})`;
    g.lineWidth = 1;
    const y = rnd() * H;
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(W, y + (rnd() - 0.5) * 3);
    g.stroke();
  }
  // incised glyph rows: loops and hooks, invented
  g.strokeStyle = P.lontarInk;
  g.lineWidth = 2.2;
  for (let row = 0; row < 4; row++) {
    const y = 18 + row * 20;
    let x = 40;
    while (x < W - 40) {
      if (Math.abs(x - W / 2) < 30) {
        x += 60;
        continue;
      }
      const r = 4 + rnd() * 3;
      g.beginPath();
      g.arc(x, y, r, Math.PI * (0.2 + rnd() * 0.4), Math.PI * (1.6 + rnd() * 0.6));
      if (rnd() < 0.5) g.lineTo(x + r * 1.6, y - r * 1.2);
      if (rnd() < 0.3) {
        g.moveTo(x - r, y + r + 2);
        g.quadraticCurveTo(x, y + r + 6, x + r, y + r + 2);
      }
      g.stroke();
      x += r * 2.6 + rnd() * 4 + (rnd() < 0.12 ? 12 : 0);
    }
  }
  // string hole at centre
  g.fillStyle = "#2A1A0E";
  g.beginPath();
  g.arc(W / 2, H / 2, 6, 0, Math.PI * 2);
  g.fill();
  // darker leaf edges
  const e = g.createLinearGradient(0, 0, W, 0);
  e.addColorStop(0, "rgba(90,60,20,0.35)");
  e.addColorStop(0.06, "rgba(90,60,20,0)");
  e.addColorStop(0.94, "rgba(90,60,20,0)");
  e.addColorStop(1, "rgba(90,60,20,0.35)");
  g.fillStyle = e;
  g.fillRect(0, 0, W, H);
  return toTex(c);
};

export const makeWoodTexture = (seed: number, base = P.deskWalnut) => {
  const c = canvas(512, 512);
  const g = c.getContext("2d")!;
  g.fillStyle = base;
  g.fillRect(0, 0, 512, 512);
  const rnd = mulberry32(seed);
  for (let i = 0; i < 90; i++) {
    g.strokeStyle = `rgba(${100 + rnd() * 40},${60 + rnd() * 25},${30},${0.15 + rnd() * 0.2})`;
    g.lineWidth = 1 + rnd() * 3;
    const y = rnd() * 512;
    g.beginPath();
    g.moveTo(0, y);
    g.bezierCurveTo(170, y + (rnd() - 0.5) * 30, 340, y + (rnd() - 0.5) * 30, 512, y + (rnd() - 0.5) * 10);
    g.stroke();
  }
  const t = toTex(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
};

export const makeFeatherTexture = () => {
  const c = canvas(128, 512);
  const g = c.getContext("2d")!;
  g.strokeStyle = "#F4EEE2";
  g.lineWidth = 2;
  for (let y = 40; y < 470; y += 4) {
    const w = 44 * Math.sin(Math.PI * ((y - 40) / 430)) ** 0.7;
    g.strokeStyle = y % 12 ? "#EFE7D8" : "#D8CDB8";
    g.beginPath();
    g.moveTo(64, y);
    g.quadraticCurveTo(64 - w * 0.6, y - 8, 64 - w, y - 18);
    g.moveTo(64, y);
    g.quadraticCurveTo(64 + w * 0.6, y - 8, 64 + w, y - 18);
    g.stroke();
  }
  g.strokeStyle = "#CDBF9E";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(64, 20);
  g.lineTo(64, 500);
  g.stroke();
  return toTex(c);
};

export const makeGlowTexture = () => {
  const c = canvas(128, 128);
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.3, "rgba(255,255,255,0.35)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return toTex(c);
};
