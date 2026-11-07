import * as THREE from "three";
import { mulberry32 } from "../core/motion";
import { GACHAREVEAL_PALETTE as P } from "./palette";

// Card art, card back, foil and glow textures — all drawn on canvas, original content only.
// Creature: "Nebulin", an original round star-spirit hatchling with crystal horns.

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
};
const toTex = (c: HTMLCanvasElement) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

const roundRect = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
};

const star5 = (g: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
  }
  g.closePath();
};

export const makeCardFront = () => {
  const W = 600;
  const H = 850;
  const [c, g] = canvas(W, H);
  // gold frame
  const frame = g.createLinearGradient(0, 0, W, H);
  frame.addColorStop(0, "#FFE7A3");
  frame.addColorStop(0.5, "#C48A1E");
  frame.addColorStop(1, "#FFE08A");
  g.fillStyle = frame;
  roundRect(g, 0, 0, W, H, 36);
  g.fill();
  // art window background
  const bg = g.createLinearGradient(0, 40, 0, 600);
  bg.addColorStop(0, "#2B1466");
  bg.addColorStop(0.55, "#4E2AA8");
  bg.addColorStop(1, "#1A7FA8");
  g.fillStyle = bg;
  roundRect(g, 30, 30, W - 60, 560, 22);
  g.fill();
  g.save();
  roundRect(g, 30, 30, W - 60, 560, 22);
  g.clip();
  // god rays
  g.translate(W / 2, 330);
  for (let i = 0; i < 18; i++) {
    g.rotate((Math.PI * 2) / 18);
    g.fillStyle = i % 2 ? "rgba(255,230,160,0.10)" : "rgba(160,220,255,0.07)";
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(-40, -520);
    g.lineTo(40, -520);
    g.fill();
  }
  g.setTransform(1, 0, 0, 1, 0, 0);
  // little stars
  const rnd = mulberry32(6501);
  for (let i = 0; i < 60; i++) {
    g.fillStyle = `rgba(255,255,255,${0.3 + rnd() * 0.7})`;
    g.beginPath();
    g.arc(40 + rnd() * (W - 80), 40 + rnd() * 540, 0.8 + rnd() * 2.2, 0, Math.PI * 2);
    g.fill();
  }
  // creature halo
  const halo = g.createRadialGradient(W / 2, 340, 10, W / 2, 340, 230);
  halo.addColorStop(0, "rgba(255,240,200,0.85)");
  halo.addColorStop(0.4, "rgba(255,200,120,0.25)");
  halo.addColorStop(1, "rgba(255,200,120,0)");
  g.fillStyle = halo;
  g.fillRect(0, 0, W, 600);
  const cx = W / 2;
  const cy = 360;
  // wings
  for (const s of [-1, 1]) {
    const wing = g.createLinearGradient(cx, cy, cx + s * 200, cy - 120);
    wing.addColorStop(0, "#9FE9FF");
    wing.addColorStop(1, "rgba(220,170,255,0.6)");
    g.fillStyle = wing;
    g.beginPath();
    g.moveTo(cx + s * 60, cy - 10);
    g.bezierCurveTo(cx + s * 170, cy - 170, cx + s * 230, cy - 60, cx + s * 205, cy + 10);
    g.bezierCurveTo(cx + s * 180, cy - 10, cx + s * 170, cy + 40, cx + s * 140, cy + 30);
    g.bezierCurveTo(cx + s * 120, cy + 10, cx + s * 100, cy + 50, cx + s * 70, cy + 40);
    g.closePath();
    g.fill();
  }
  // tail flame
  const tail = g.createLinearGradient(cx, cy + 60, cx + 150, cy + 150);
  tail.addColorStop(0, "#FFB347");
  tail.addColorStop(1, "rgba(255,90,150,0)");
  g.fillStyle = tail;
  g.beginPath();
  g.moveTo(cx + 60, cy + 70);
  g.bezierCurveTo(cx + 150, cy + 90, cx + 170, cy + 160, cx + 210, cy + 120);
  g.bezierCurveTo(cx + 170, cy + 190, cx + 90, cy + 140, cx + 40, cy + 110);
  g.fill();
  // body
  const body = g.createRadialGradient(cx - 30, cy - 40, 10, cx, cy, 120);
  body.addColorStop(0, "#FFF6E0");
  body.addColorStop(0.5, "#FFC98F");
  body.addColorStop(1, "#E07A9E");
  g.fillStyle = body;
  g.beginPath();
  g.ellipse(cx, cy, 112, 104, 0, 0, Math.PI * 2);
  g.fill();
  // belly star
  g.fillStyle = "rgba(255,255,255,0.55)";
  star5(g, cx, cy + 50, 26);
  g.fill();
  // crystal horns
  for (const s of [-1, 1]) {
    const horn = g.createLinearGradient(cx + s * 50, cy - 140, cx + s * 40, cy - 80);
    horn.addColorStop(0, "#E9FFFF");
    horn.addColorStop(1, "#38C6E8");
    g.fillStyle = horn;
    g.beginPath();
    g.moveTo(cx + s * 30, cy - 88);
    g.lineTo(cx + s * 62, cy - 165);
    g.lineTo(cx + s * 70, cy - 82);
    g.closePath();
    g.fill();
  }
  // eyes
  for (const s of [-1, 1]) {
    g.fillStyle = "#1E1240";
    g.beginPath();
    g.ellipse(cx + s * 40, cy - 12, 22, 28, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#6FE7FF";
    g.beginPath();
    g.ellipse(cx + s * 40, cy - 4, 14, 16, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#FFFFFF";
    g.beginPath();
    g.arc(cx + s * 40 - 7, cy - 22, 8, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.arc(cx + s * 40 + 7, cy, 3.5, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "rgba(255,110,150,0.55)";
    g.beginPath();
    g.ellipse(cx + s * 72, cy + 22, 16, 9, 0, 0, Math.PI * 2);
    g.fill();
  }
  // smile
  g.strokeStyle = "#5A2340";
  g.lineWidth = 5;
  g.lineCap = "round";
  g.beginPath();
  g.arc(cx, cy + 18, 14, 0.15 * Math.PI, 0.85 * Math.PI);
  g.stroke();
  g.restore();
  // name plate
  g.fillStyle = "rgba(20,18,56,0.92)";
  roundRect(g, 30, 610, W - 60, 210, 22);
  g.fill();
  g.fillStyle = "#FFE7A3";
  g.font = "bold 64px Georgia, serif";
  g.textAlign = "center";
  g.fillText("NEBULIN", W / 2, 690);
  g.fillStyle = "#FFC23D";
  for (let i = 0; i < 5; i++) {
    star5(g, W / 2 - 120 + i * 60, 740, 22);
    g.fill();
  }
  g.fillStyle = "#BFD6FF";
  g.font = "bold 24px 'Trebuchet MS', sans-serif";
  g.fillText("ROH BINTANG  •  LEGENDARIS", W / 2, 795);
  return toTex(c);
};

export const makeCardBack = () => {
  const W = 600;
  const H = 850;
  const [c, g] = canvas(W, H);
  g.fillStyle = "#C48A1E";
  roundRect(g, 0, 0, W, H, 36);
  g.fill();
  const bg = g.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, 520);
  bg.addColorStop(0, "#2A2470");
  bg.addColorStop(1, P.cardNavy);
  g.fillStyle = bg;
  roundRect(g, 24, 24, W - 48, H - 48, 24);
  g.fill();
  g.strokeStyle = "#E9B84A";
  g.lineWidth = 4;
  for (let r = 60; r <= 240; r += 45) {
    g.beginPath();
    g.arc(W / 2, H / 2, r, 0, Math.PI * 2);
    g.stroke();
  }
  g.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    g.beginPath();
    g.moveTo(W / 2 + Math.cos(a) * 60, H / 2 + Math.sin(a) * 60);
    g.lineTo(W / 2 + Math.cos(a) * 260, H / 2 + Math.sin(a) * 260);
    g.stroke();
  }
  g.fillStyle = "#FFC23D";
  star5(g, W / 2, H / 2, 46);
  g.fill();
  return toTex(c);
};

/** Diagonal rainbow foil bands (additive overlay, scrolled via texture offset). */
export const makeFoilTexture = () => {
  const [c, g] = canvas(512, 512);
  const grad = g.createLinearGradient(0, 0, 512, 512);
  const hues = [0, 50, 120, 190, 260, 320, 360];
  hues.forEach((h, i) => grad.addColorStop(i / (hues.length - 1), `hsla(${h},100%,65%,1)`));
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 512);
  // fine diffraction lines
  g.globalCompositeOperation = "multiply";
  for (let y = 0; y < 512; y += 6) {
    g.fillStyle = y % 12 ? "rgba(255,255,255,1)" : "rgba(120,120,120,1)";
    g.fillRect(0, y, 512, 3);
  }
  const t = toTex(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
};

export const makeGlowTexture = () => {
  const [c, g] = canvas(128, 128);
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.5)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return toTex(c);
};

/** Vertical beam falloff (bright centre line, soft edges, fades at top). */
export const makeBeamTexture = () => {
  const [c, g] = canvas(64, 256);
  const h = g.createLinearGradient(0, 0, 64, 0);
  h.addColorStop(0, "rgba(255,255,255,0)");
  h.addColorStop(0.5, "rgba(255,255,255,1)");
  h.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = h;
  g.fillRect(0, 0, 64, 256);
  g.globalCompositeOperation = "destination-in";
  const v = g.createLinearGradient(0, 0, 0, 256);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(0.7, "rgba(0,0,0,0.8)");
  v.addColorStop(1, "rgba(0,0,0,1)");
  g.fillStyle = v;
  g.fillRect(0, 0, 64, 256);
  return toTex(c);
};
