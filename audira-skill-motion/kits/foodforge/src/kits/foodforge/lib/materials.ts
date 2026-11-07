import * as THREE from "three";
import { mulberry32 } from "../core/motion";
import { FOODFORGE_PALETTE as P } from "./palette";

// Procedural textures and materials for the food-commercial look. Canvas-only, seeded.

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};

/** Oiled walnut planks: long grain lines, darker seams, slight plank-to-plank tone shift. */
export const makeWalnutTexture = () => {
  const c = canvas(1024, 1024);
  const g = c.getContext("2d")!;
  const rnd = mulberry32(4501);
  const planks = 5;
  const ph = 1024 / planks;
  for (let p = 0; p < planks; p++) {
    const tone = 0.85 + rnd() * 0.3;
    const base = new THREE.Color(P.walnutMid).multiplyScalar(tone);
    g.fillStyle = `#${base.getHexString()}`;
    g.fillRect(0, p * ph, 1024, ph);
    for (let i = 0; i < 70; i++) {
      const y0 = p * ph + rnd() * ph;
      const a = 0.08 + rnd() * 0.22;
      g.strokeStyle = rnd() > 0.5 ? `rgba(20,10,4,${a})` : `rgba(120,70,36,${a * 0.6})`;
      g.lineWidth = 0.6 + rnd() * 2.2;
      g.beginPath();
      const amp = 2 + rnd() * 6;
      const freq = 0.004 + rnd() * 0.01;
      const ph0 = rnd() * 10;
      for (let x = 0; x <= 1024; x += 16) {
        const y = y0 + Math.sin(x * freq + ph0) * amp;
        if (x === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
    }
    // knot
    if (rnd() > 0.4) {
      const kx = rnd() * 1024;
      const ky = p * ph + ph * (0.3 + rnd() * 0.4);
      for (let r = 26; r > 2; r -= 4) {
        g.strokeStyle = `rgba(18,8,3,${0.25})`;
        g.beginPath();
        g.ellipse(kx, ky, r * 2.2, r * 0.7, 0, 0, Math.PI * 2);
        g.stroke();
      }
    }
    g.fillStyle = "rgba(8,4,2,0.85)";
    g.fillRect(0, p * ph, 1024, 3);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
};

/** Soft radial puff with fbm-ish breakup — used for steam wisps (additive). */
export const makeSteamTexture = (seed: number) => {
  const c = canvas(256, 256);
  const g = c.getContext("2d")!;
  const rnd = mulberry32(seed);
  for (let i = 0; i < 26; i++) {
    const x = 128 + (rnd() - 0.5) * 90;
    const y = 128 + (rnd() - 0.5) * 140;
    const r = 30 + rnd() * 60;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(255,255,255,${0.12 + rnd() * 0.12})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

/** Hexagon-ish bokeh disc for out-of-focus background practicals. */
export const makeBokehTexture = () => {
  const c = canvas(128, 128);
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 62);
  grad.addColorStop(0, "rgba(255,255,255,0.55)");
  grad.addColorStop(0.75, "rgba(255,255,255,0.75)");
  grad.addColorStop(0.92, "rgba(255,255,255,0.95)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.beginPath();
  g.arc(64, 64, 62, 0, Math.PI * 2);
  g.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

/** Cut face of the egg: white with a jammy yolk gradient. */
export const makeEggFaceTexture = () => {
  const c = canvas(256, 256);
  const g = c.getContext("2d")!;
  g.fillStyle = P.eggWhite;
  g.fillRect(0, 0, 256, 256);
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 72);
  grad.addColorStop(0, "#FFB52E");
  grad.addColorStop(0.55, P.yolk);
  grad.addColorStop(0.85, "#E8861A");
  grad.addColorStop(1, "rgba(247,241,230,0)");
  g.fillStyle = grad;
  g.beginPath();
  g.arc(128, 128, 76, 0, Math.PI * 2);
  g.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

/** Chashu cross-section: fat/meat spiral rings with a caramelised edge. */
export const makeChashuTexture = () => {
  const c = canvas(256, 256);
  const g = c.getContext("2d")!;
  g.fillStyle = P.chashuEdge;
  g.fillRect(0, 0, 256, 256);
  for (let r = 118; r > 4; r -= 14) {
    g.fillStyle = (r / 14) % 2 < 1 ? P.chashu : "#F3D9C4";
    g.beginPath();
    g.ellipse(128 + (118 - r) * 0.12, 128, r, r * 0.96, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.strokeStyle = P.chashuEdge;
  g.lineWidth = 10;
  g.beginPath();
  g.arc(128, 128, 122, 0, Math.PI * 2);
  g.stroke();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

export const glossy = (color: string, rough = 0.25, clearcoat = 0.6) =>
  new THREE.MeshPhysicalMaterial({ color, roughness: rough, metalness: 0, clearcoat, clearcoatRoughness: 0.12 });
