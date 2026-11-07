import * as THREE from "three";
import { mulberry32 } from "../core/motion";
import { WAYANG_PALETTE as P } from "./palette";

// All wayang figures here are ORIGINAL designs: ornamental silhouettes, not copies of any
// specific traditional character. Perforations (tatahan) are punched with destination-out.

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};
const toTex = (c: HTMLCanvasElement, repeat?: [number, number]) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  return t;
};

type Ctx = CanvasRenderingContext2D;

const punch = (g: Ctx, x: number, y: number, r: number) => {
  g.save();
  g.globalCompositeOperation = "destination-out";
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
  g.restore();
};
const punchTear = (g: Ctx, x: number, y: number, r: number, a: number) => {
  g.save();
  g.globalCompositeOperation = "destination-out";
  g.translate(x, y);
  g.rotate(a);
  g.beginPath();
  g.moveTo(0, -r * 2);
  g.quadraticCurveTo(r * 1.2, 0, 0, r);
  g.quadraticCurveTo(-r * 1.2, 0, 0, -r * 2);
  g.fill();
  g.restore();
};

/** Punch a dotted row along a polyline. */
const punchRow = (g: Ctx, pts: [number, number][], step: number, r: number) => {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const d = Math.hypot(x1 - x0, y1 - y0);
    for (let s = 0; s < d; s += step) punch(g, x0 + ((x1 - x0) * s) / d, y0 + ((y1 - y0) * s) / d, r);
  }
};

const fillStroke = (g: Ctx, fill: string | CanvasGradient, stroke = P.pradaGold, w = 4) => {
  g.fillStyle = fill;
  g.fill();
  g.strokeStyle = stroke;
  g.lineWidth = w;
  g.stroke();
};

/** A slender noble figure in profile, facing right. 512x1024. */
const drawKesatria = (g: Ctx) => {
  // kain (lower garment), flaring with a curling front tail
  g.beginPath();
  g.moveTo(215, 520);
  g.lineTo(305, 520);
  g.quadraticCurveTo(330, 700, 345, 870);
  g.quadraticCurveTo(400, 880, 410, 930);
  g.quadraticCurveTo(360, 910, 330, 905);
  g.lineTo(175, 905);
  g.quadraticCurveTo(185, 700, 215, 520);
  const kain = g.createLinearGradient(0, 520, 0, 905);
  kain.addColorStop(0, P.leatherRed);
  kain.addColorStop(1, "#7A1F14");
  fillStroke(g, kain);
  // gold border band on kain
  g.fillStyle = P.pradaGold;
  g.fillRect(180, 860, 160, 22);
  // legs & feet
  g.fillStyle = P.faceBlack;
  g.fillRect(222, 900, 18, 85);
  g.fillRect(282, 900, 18, 85);
  g.beginPath();
  g.ellipse(250, 990, 34, 10, 0, 0, Math.PI * 2);
  g.ellipse(312, 990, 34, 10, 0, 0, Math.PI * 2);
  g.fill();
  // torso
  g.beginPath();
  g.moveTo(228, 285);
  g.lineTo(292, 285);
  g.lineTo(306, 525);
  g.lineTo(214, 525);
  g.closePath();
  const torso = g.createLinearGradient(214, 0, 306, 0);
  torso.addColorStop(0, "#B9852F");
  torso.addColorStop(0.5, P.pradaGold);
  torso.addColorStop(1, "#9C6A22");
  fillStroke(g, torso, "#6A4414", 3);
  // sash
  g.fillStyle = P.leatherBlue;
  g.fillRect(212, 470, 96, 26);
  // long arms (one front, one back)
  g.strokeStyle = P.faceBlack;
  g.lineCap = "round";
  g.lineWidth = 15;
  g.beginPath();
  g.moveTo(292, 300);
  g.quadraticCurveTo(345, 450, 360, 640);
  g.stroke();
  g.beginPath();
  g.moveTo(230, 300);
  g.quadraticCurveTo(170, 450, 186, 640);
  g.stroke();
  g.fillStyle = P.pradaGold;
  for (const [x, y] of [
    [340, 430],
    [182, 430],
  ])
    g.fillRect(x - 10, y, 20, 12);
  // neck + head in profile (black face, long fine nose pointing right)
  g.beginPath();
  g.moveTo(240, 290);
  g.lineTo(240, 230);
  g.quadraticCurveTo(250, 160, 290, 150);
  g.lineTo(345, 196);
  g.lineTo(300, 206);
  g.quadraticCurveTo(298, 236, 270, 250);
  g.lineTo(272, 290);
  g.closePath();
  fillStroke(g, P.faceBlack, P.pradaGold, 3);
  // eye: a fine almond slit
  g.strokeStyle = P.pradaGold;
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(272, 182);
  g.quadraticCurveTo(286, 176, 300, 184);
  g.stroke();
  // crown (makutha-like ornamental tiara with a back curl)
  g.beginPath();
  g.moveTo(244, 168);
  g.quadraticCurveTo(240, 80, 280, 40);
  g.quadraticCurveTo(300, 90, 296, 150);
  g.closePath();
  fillStroke(g, P.pradaGold, "#6A4414", 3);
  g.beginPath();
  g.moveTo(246, 150);
  g.bezierCurveTo(170, 140, 150, 60, 210, 70);
  g.bezierCurveTo(240, 80, 220, 120, 200, 110);
  g.lineWidth = 12;
  g.strokeStyle = P.leatherRed;
  g.stroke();

  // tatahan: perforations
  for (let y = 60; y < 150; y += 14) punch(g, 270 + Math.sin(y) * 4, y, 3.2);
  for (let y = 305; y < 460; y += 18) for (let x = 232; x < 292; x += 16) punch(g, x + ((y / 18) % 2) * 8, y, 3.0);
  for (let row = 0; row < 7; row++) {
    const y = 560 + row * 42;
    const x0 = 200 - row * 2;
    const x1 = 310 + row * 3;
    for (let x = x0; x < x1; x += 22) punchTear(g, x + (row % 2) * 11, y, 4.5, row % 2 ? 0.4 : -0.4);
  }
  punchRow(g, [[190, 845], [335, 845]], 12, 2.6);
};

/** A bulky ogre-like figure facing LEFT (original design). 512x1024. */
const drawRaksasa = (g: Ctx) => {
  g.save();
  g.translate(512, 0);
  g.scale(-1, 1);
  // flowing hair mass
  g.beginPath();
  g.moveTo(210, 140);
  g.bezierCurveTo(90, 160, 80, 360, 140, 470);
  g.bezierCurveTo(170, 420, 190, 330, 230, 300);
  g.closePath();
  fillStroke(g, "#1B1712", P.pradaGold, 3);
  // kain
  g.beginPath();
  g.moveTo(180, 540);
  g.lineTo(350, 540);
  g.quadraticCurveTo(380, 720, 390, 900);
  g.lineTo(150, 900);
  g.quadraticCurveTo(160, 720, 180, 540);
  const kain = g.createLinearGradient(0, 540, 0, 900);
  kain.addColorStop(0, P.leatherGreen);
  kain.addColorStop(1, "#173B30");
  fillStroke(g, kain);
  g.fillStyle = P.pradaGold;
  g.fillRect(156, 850, 228, 24);
  // legs
  g.fillStyle = "#7A2216";
  g.fillRect(200, 895, 26, 90);
  g.fillRect(300, 895, 26, 90);
  g.beginPath();
  g.ellipse(232, 990, 40, 12, 0, 0, Math.PI * 2);
  g.ellipse(330, 990, 40, 12, 0, 0, Math.PI * 2);
  g.fill();
  // wide torso
  g.beginPath();
  g.moveTo(200, 300);
  g.lineTo(330, 300);
  g.lineTo(355, 545);
  g.lineTo(178, 545);
  g.closePath();
  const torso = g.createLinearGradient(178, 0, 355, 0);
  torso.addColorStop(0, "#8E2A18");
  torso.addColorStop(0.5, P.leatherRed);
  torso.addColorStop(1, "#6E1E12");
  fillStroke(g, torso);
  g.fillStyle = P.pradaGold;
  g.fillRect(176, 488, 182, 28);
  // arms, thick
  g.strokeStyle = "#7A2216";
  g.lineCap = "round";
  g.lineWidth = 22;
  g.beginPath();
  g.moveTo(325, 320);
  g.quadraticCurveTo(400, 460, 395, 650);
  g.stroke();
  g.beginPath();
  g.moveTo(205, 320);
  g.quadraticCurveTo(130, 470, 150, 650);
  g.stroke();
  // big head: round eye, open mouth, bulbous nose
  g.beginPath();
  g.moveTo(215, 300);
  g.quadraticCurveTo(205, 160, 280, 130);
  g.quadraticCurveTo(340, 140, 360, 200);
  g.quadraticCurveTo(390, 215, 372, 240);
  g.lineTo(345, 248);
  g.quadraticCurveTo(350, 270, 320, 278);
  g.lineTo(312, 300);
  g.closePath();
  fillStroke(g, P.leatherRed, P.pradaGold, 3);
  g.fillStyle = "#F4E6C8";
  g.beginPath();
  g.arc(318, 192, 14, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = P.faceBlack;
  g.beginPath();
  g.arc(322, 192, 6, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#F4E6C8";
  g.fillRect(330, 250, 14, 10);
  // spiked crown
  g.beginPath();
  g.moveTo(232, 160);
  for (let i = 0; i <= 5; i++) g.lineTo(240 + i * 20, i % 2 ? 70 : 120);
  g.lineTo(345, 165);
  g.closePath();
  fillStroke(g, P.pradaGold, "#6A4414", 3);
  g.restore();

  // perforations (mirrored coordinates already baked by drawing order; punch in screen space)
  for (let y = 330; y < 480; y += 20) for (let x = 170; x < 300; x += 18) punch(g, x + ((y / 20) % 2) * 9, y, 3.2);
  for (let row = 0; row < 7; row++) {
    const y = 580 + row * 40;
    for (let x = 140; x < 350; x += 24) punchTear(g, x + (row % 2) * 12, y, 4.8, row % 2 ? -0.5 : 0.5);
  }
  for (let i = 0; i < 6; i++) punch(g, 512 - (245 + i * 20), 120 + (i % 2) * 10, 3);
};

/** Gunungan (kayon): mountain / tree-of-life leaf. 512x1024. */
const drawGunungan = (g: Ctx) => {
  const rnd = mulberry32(47);
  g.beginPath();
  g.moveTo(110, 960);
  g.bezierCurveTo(50, 520, 190, 150, 256, 30);
  g.bezierCurveTo(322, 150, 462, 520, 402, 960);
  g.closePath();
  const grd = g.createLinearGradient(0, 30, 0, 960);
  grd.addColorStop(0, "#C8402A");
  grd.addColorStop(0.45, P.pradaGold);
  grd.addColorStop(1, P.leatherGreen);
  fillStroke(g, grd, "#5A3410", 6);
  // inner border ring
  g.save();
  g.beginPath();
  g.moveTo(140, 930);
  g.bezierCurveTo(90, 520, 210, 190, 256, 90);
  g.bezierCurveTo(302, 190, 422, 520, 372, 930);
  g.strokeStyle = P.pradaGold;
  g.lineWidth = 10;
  g.stroke();
  g.restore();

  // tree of life: trunk + recursive curling branches
  g.strokeStyle = "#3B220C";
  g.lineCap = "round";
  const branch = (x: number, y: number, a: number, len: number, w: number, depth: number) => {
    if (depth === 0 || len < 14) return;
    const x2 = x + Math.cos(a) * len;
    const y2 = y + Math.sin(a) * len;
    const cx = x + Math.cos(a + 0.5) * len * 0.5;
    const cy = y + Math.sin(a + 0.5) * len * 0.5;
    g.lineWidth = w;
    g.beginPath();
    g.moveTo(x, y);
    g.quadraticCurveTo(cx, cy, x2, y2);
    g.stroke();
    const spread = 0.55 + rnd() * 0.25;
    branch(x2, y2, a - spread, len * 0.72, w * 0.7, depth - 1);
    branch(x2, y2, a + spread, len * 0.72, w * 0.7, depth - 1);
    if (depth <= 2) {
      g.fillStyle = depth === 1 ? "#E6C36A" : "#2F6E5A";
      g.beginPath();
      g.arc(x2, y2, 5 + rnd() * 3, 0, Math.PI * 2);
      g.fill();
    }
  };
  g.lineWidth = 16;
  g.beginPath();
  g.moveTo(256, 800);
  g.lineTo(256, 300);
  g.stroke();
  for (let i = 0; i < 6; i++) {
    const y = 760 - i * 85;
    const len = 95 - i * 9;
    branch(256, y, -Math.PI / 2 - 0.9, len, 9, 5);
    branch(256, y, -Math.PI / 2 + 0.9, len, 9, 5);
  }
  branch(256, 300, -Math.PI / 2, 60, 8, 4);

  // gate (regol) at the base
  g.fillStyle = "#5A3410";
  g.fillRect(196, 820, 120, 130);
  g.fillStyle = P.pradaGold;
  g.fillRect(206, 840, 100, 110);
  g.fillStyle = P.leatherRed;
  g.beginPath();
  g.moveTo(186, 828);
  g.lineTo(256, 776);
  g.lineTo(326, 828);
  g.closePath();
  g.fill();

  // tatahan: dense perforations everywhere except the gate
  for (let i = 0; i < 520; i++) {
    const y = 90 + rnd() * 700;
    const halfW = Math.min(170, (y - 40) * 0.28);
    const x = 256 + (rnd() * 2 - 1) * halfW;
    if (Math.abs(x - 256) < 10) continue;
    if (rnd() < 0.55) punch(g, x, y, 2.2 + rnd() * 2.0);
    else punchTear(g, x, y, 3 + rnd() * 1.5, rnd() * 6.28);
  }
  for (let y = 120; y < 920; y += 16) {
    const halfW = Math.min(160, (y - 60) * 0.3);
    punch(g, 256 - halfW - 4, y, 2.4);
    punch(g, 256 + halfW + 4, y, 2.4);
  }
  for (let y = 852; y < 940; y += 18) for (let x = 216; x < 300; x += 18) punch(g, x + 6, y, 3);
};

export type PuppetKind = "kesatria" | "raksasa" | "gunungan";

const DRAW: Record<PuppetKind, (g: Ctx) => void> = { kesatria: drawKesatria, raksasa: drawRaksasa, gunungan: drawGunungan };

/** Colour leather texture + matching soft black shadow texture for one puppet. */
export const makePuppetTextures = (kind: PuppetKind) => {
  const color = canvas(512, 1024);
  DRAW[kind](color.getContext("2d")!);
  const shadow = canvas(512, 1024);
  const sg = shadow.getContext("2d")!;
  sg.filter = "brightness(0) blur(2.5px)";
  sg.drawImage(color, 0, 0);
  const shadowTex = new THREE.CanvasTexture(shadow);
  return { color: toTex(color), shadow: shadowTex };
};

/** Kawung batik: four-petal ovals on soga brown, indigo seeds. */
export const makeKawungTexture = (base = P.sogaBrown, petal = P.sogaCream, seed = P.batikIndigo) => {
  const c = canvas(256, 256);
  const g = c.getContext("2d")!;
  g.fillStyle = base;
  g.fillRect(0, 0, 256, 256);
  const s = 64;
  for (let y = 0; y <= 256; y += s) {
    for (let x = 0; x <= 256; x += s) {
      for (let k = 0; k < 4; k++) {
        const a = Math.PI / 4 + (k * Math.PI) / 2;
        g.save();
        g.translate(x + Math.cos(a) * 16, y + Math.sin(a) * 16);
        g.rotate(a);
        g.fillStyle = petal;
        g.beginPath();
        g.ellipse(0, 0, 15, 9, 0, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = seed;
        g.beginPath();
        g.ellipse(2, 0, 5, 2.5, 0, 0, Math.PI * 2);
        g.fill();
        g.restore();
      }
      g.fillStyle = seed;
      g.beginPath();
      g.arc(x, y, 4, 0, Math.PI * 2);
      g.fill();
    }
  }
  // crackle (malam wax veins)
  g.strokeStyle = "rgba(20,24,60,0.25)";
  g.lineWidth = 1;
  const rnd = mulberry32(5);
  for (let i = 0; i < 40; i++) {
    g.beginPath();
    let x = rnd() * 256;
    let y = rnd() * 256;
    g.moveTo(x, y);
    for (let k = 0; k < 4; k++) {
      x += (rnd() - 0.5) * 40;
      y += (rnd() - 0.5) * 40;
      g.lineTo(x, y);
    }
    g.stroke();
  }
  return toTex(c, [1, 1]);
};

/** Parang-like diagonal batik band for the screen border (original simplification). */
export const makeParangTexture = () => {
  const c = canvas(256, 64);
  const g = c.getContext("2d")!;
  g.fillStyle = P.batikIndigo;
  g.fillRect(0, 0, 256, 64);
  for (let x = -64; x < 320; x += 32) {
    g.fillStyle = P.sogaBrown;
    g.beginPath();
    g.moveTo(x, 64);
    g.lineTo(x + 20, 64);
    g.lineTo(x + 52, 0);
    g.lineTo(x + 32, 0);
    g.closePath();
    g.fill();
    g.strokeStyle = P.sogaCream;
    g.lineWidth = 2;
    g.beginPath();
    g.arc(x + 26, 32, 6, 0, Math.PI * 2);
    g.stroke();
  }
  return toTex(c, [8, 1]);
};

/** Glowing kelir as seen from the shadow side: hot centre under the lamp. */
export const makeKelirGlowTexture = (hot: boolean) => {
  const c = canvas(512, 256);
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(256, 40, 10, 256, 110, 330);
  grd.addColorStop(0, hot ? "#FFD27E" : "#FFF6E2");
  grd.addColorStop(0.5, hot ? "#E8892E" : "#F3E7CC");
  grd.addColorStop(1, hot ? "#4A1A08" : "#CDBB98");
  g.fillStyle = grd;
  g.fillRect(0, 0, 512, 256);
  // cloth weave
  g.globalAlpha = 0.06;
  g.fillStyle = "#000";
  for (let y = 0; y < 256; y += 3) g.fillRect(0, y, 512, 1);
  for (let x = 0; x < 512; x += 3) g.fillRect(x, 0, 1, 256);
  return toTex(c);
};

export const makeGlowTexture = () => {
  const c = canvas(128, 128);
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.3, "rgba(255,255,255,0.4)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return toTex(c);
};

export const makeWoodTexture = (seed: number) => {
  const c = canvas(128, 512);
  const g = c.getContext("2d")!;
  g.fillStyle = P.carvedWood;
  g.fillRect(0, 0, 128, 512);
  const rnd = mulberry32(seed);
  for (let i = 0; i < 60; i++) {
    g.strokeStyle = `rgba(${90 + rnd() * 40},${55 + rnd() * 20},${30},0.35)`;
    g.lineWidth = 1 + rnd() * 2;
    const x = rnd() * 128;
    g.beginPath();
    g.moveTo(x, 0);
    g.bezierCurveTo(x + 8, 170, x - 8, 340, x + 4, 512);
    g.stroke();
  }
  return toTex(c);
};
