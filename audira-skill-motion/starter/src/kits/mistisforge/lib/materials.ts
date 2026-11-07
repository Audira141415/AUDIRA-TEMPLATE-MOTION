import * as THREE from "three";
import { mulberry32 } from "../core/motion";
import { MISTIS_PALETTE } from "./palette";

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};

const finish = (c: HTMLCanvasElement, repeat?: [number, number]) => {
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  if (repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat[0], repeat[1]);
  }
  return tex;
};

/** Soft cloudy fog puff (white, alpha only) for billboard sprites. */
export const makeFogTexture = (seed: number) => {
  const c = canvas(256, 256);
  const g = c.getContext("2d")!;
  const rnd = mulberry32(seed);
  for (let i = 0; i < 26; i++) {
    const x = 50 + rnd() * 156;
    const y = 70 + rnd() * 116;
    const r = 30 + rnd() * 60;
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, "rgba(255,255,255,0.22)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
  }
  return finish(c);
};

/** Radial glow for lantern halos and the moon. */
export const makeGlowTexture = () => {
  const c = canvas(128, 128);
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(255,255,255,0.45)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return finish(c);
};

/** Packed earth with a trodden lighter footpath down the middle (u = across). */
export const makeEarthTexture = (seed: number) => {
  const c = canvas(512, 512);
  const g = c.getContext("2d")!;
  g.fillStyle = MISTIS_PALETTE.earth;
  g.fillRect(0, 0, 512, 512);
  const rnd = mulberry32(seed);
  for (let i = 0; i < 4000; i++) {
    const v = 20 + rnd() * 40;
    g.fillStyle = `rgba(${v + 20},${v + 12},${v},${0.25 + rnd() * 0.3})`;
    g.fillRect(rnd() * 512, rnd() * 512, 1 + rnd() * 3, 1 + rnd() * 3);
  }
  return finish(c, [6, 9]);
};

export const makePathTexture = (seed: number) => {
  const c = canvas(256, 1024);
  const g = c.getContext("2d")!;
  const grd = g.createLinearGradient(0, 0, 256, 0);
  grd.addColorStop(0, "rgba(74,65,54,0)");
  grd.addColorStop(0.25, "rgba(84,73,60,0.9)");
  grd.addColorStop(0.75, "rgba(84,73,60,0.9)");
  grd.addColorStop(1, "rgba(74,65,54,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 1024);
  const rnd = mulberry32(seed);
  for (let i = 0; i < 1800; i++) {
    const v = 60 + rnd() * 50;
    g.fillStyle = `rgba(${v},${v - 8},${v - 18},${0.25 * rnd()})`;
    g.beginPath();
    g.arc(40 + rnd() * 176, rnd() * 1024, 0.6 + rnd() * 2.4, 0, Math.PI * 2);
    g.fill();
  }
  return finish(c);
};

/** Woven bamboo wall (gedek) chevron weave. */
export const makeGedekTexture = () => {
  const c = canvas(256, 256);
  const g = c.getContext("2d")!;
  g.fillStyle = "#5E4C35";
  g.fillRect(0, 0, 256, 256);
  const s = 16;
  for (let y = 0; y < 256; y += s) {
    for (let x = 0; x < 256; x += s) {
      const flip = ((x + y) / s) % 2 === 0;
      g.fillStyle = flip ? "#8A7350" : "#6E5A3E";
      g.save();
      g.translate(x + s / 2, y + s / 2);
      g.rotate(flip ? Math.PI / 4 : -Math.PI / 4);
      g.fillRect(-s * 0.7, -s * 0.22, s * 1.4, s * 0.44);
      g.restore();
    }
  }
  return finish(c, [3, 2]);
};

export const makeThatchTexture = (seed: number) => {
  const c = canvas(256, 256);
  const g = c.getContext("2d")!;
  g.fillStyle = MISTIS_PALETTE.thatch;
  g.fillRect(0, 0, 256, 256);
  const rnd = mulberry32(seed);
  for (let i = 0; i < 900; i++) {
    const x = rnd() * 256;
    const v = 40 + rnd() * 40;
    g.strokeStyle = `rgba(${v + 20},${v + 10},${v - 5},0.6)`;
    g.lineWidth = 1 + rnd();
    g.beginPath();
    g.moveTo(x, rnd() * 256);
    g.lineTo(x + (rnd() - 0.5) * 6, rnd() * 256);
    g.stroke();
  }
  return finish(c, [2, 2]);
};

/** Bamboo culm with darker node bands (v along the stalk). */
export const makeBambooTexture = () => {
  const c = canvas(64, 512);
  const g = c.getContext("2d")!;
  const grd = g.createLinearGradient(0, 0, 64, 0);
  grd.addColorStop(0, "#3A4429");
  grd.addColorStop(0.5, "#6E7A4C");
  grd.addColorStop(1, "#3A4429");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 512);
  for (let y = 0; y < 512; y += 64) {
    g.fillStyle = "#2A301E";
    g.fillRect(0, y, 64, 5);
    g.fillStyle = "rgba(200,200,150,0.18)";
    g.fillRect(0, y + 5, 64, 2);
  }
  return finish(c, [1, 6]);
};

/** Drooping bamboo leaf spray (alpha cut-out). */
export const makeLeafTexture = (seed: number) => {
  const c = canvas(128, 128);
  const g = c.getContext("2d")!;
  const rnd = mulberry32(seed);
  for (let i = 0; i < 9; i++) {
    g.save();
    g.translate(64, 30);
    g.rotate(-1.2 + (i / 8) * 2.4 + (rnd() - 0.5) * 0.2);
    g.fillStyle = i % 2 ? "#2E3B25" : "#3C4B2E";
    g.beginPath();
    g.moveTo(0, 0);
    g.quadraticCurveTo(9, 40, 0, 92);
    g.quadraticCurveTo(-9, 40, 0, 0);
    g.fill();
    g.restore();
  }
  return finish(c);
};

/** Pale, suggestive figure: long hair, soft gown, no face detail. */
export const makePresenceTexture = () => {
  const c = canvas(256, 512);
  const g = c.getContext("2d")!;
  g.filter = "blur(6px)";
  // gown
  const gown = g.createLinearGradient(0, 120, 0, 512);
  gown.addColorStop(0, "rgba(240,246,250,0.95)");
  gown.addColorStop(1, "rgba(240,246,250,0)");
  g.fillStyle = gown;
  g.beginPath();
  g.moveTo(104, 110);
  g.quadraticCurveTo(128, 100, 152, 110);
  g.quadraticCurveTo(190, 300, 200, 500);
  g.lineTo(56, 500);
  g.quadraticCurveTo(66, 300, 104, 110);
  g.fill();
  // head
  g.fillStyle = "rgba(236,242,246,0.95)";
  g.beginPath();
  g.ellipse(128, 76, 26, 32, 0, 0, Math.PI * 2);
  g.fill();
  // long dark hair falling over the face and shoulders
  g.fillStyle = "rgba(14,16,22,0.92)";
  g.beginPath();
  g.moveTo(98, 60);
  g.quadraticCurveTo(128, 30, 158, 60);
  g.quadraticCurveTo(166, 200, 150, 290);
  g.lineTo(134, 300);
  g.quadraticCurveTo(128, 160, 124, 300);
  g.lineTo(106, 290);
  g.quadraticCurveTo(90, 200, 98, 60);
  g.fill();
  return finish(c);
};

/** Distant treeline silhouette (coconut palms + canopy) with alpha. */
export const makeTreelineTexture = (seed: number) => {
  const c = canvas(1024, 256);
  const g = c.getContext("2d")!;
  const rnd = mulberry32(seed);
  g.fillStyle = "#ffffff";
  g.beginPath();
  g.moveTo(0, 256);
  for (let x = 0; x <= 1024; x += 16) g.lineTo(x, 150 + Math.sin(x * 0.02 + seed) * 18 + rnd() * 18);
  g.lineTo(1024, 256);
  g.fill();
  for (let i = 0; i < 9; i++) {
    const x = rnd() * 1024;
    const top = 30 + rnd() * 60;
    g.strokeStyle = "#ffffff";
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(x, 200);
    g.quadraticCurveTo(x + 14, 120, x + 6, top);
    g.stroke();
    for (let k = 0; k < 7; k++) {
      const a = (k / 7) * Math.PI * 2;
      g.beginPath();
      g.moveTo(x + 6, top);
      g.quadraticCurveTo(x + 6 + Math.cos(a) * 30, top - 14, x + 6 + Math.cos(a) * 52, top + 22 + Math.abs(Math.sin(a)) * 10);
      g.lineWidth = 4;
      g.stroke();
    }
  }
  return finish(c);
};

export const mattePBR = (color: string, map?: THREE.Texture, roughness = 0.95) =>
  new THREE.MeshStandardMaterial({ color, map: map ?? null, roughness, metalness: 0 });
