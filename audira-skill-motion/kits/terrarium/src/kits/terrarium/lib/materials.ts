// TERRARIUM materials — refractive glass, wood, cork, foreground leaf and window bokeh (procedural only).
import * as THREE from "three";
import { TERRA_PALETTE as P } from "./palette";
import { prng } from "../core/motion";

/** Thin blown-glass jar: physical transmission gives real refraction of everything inside. */
export const makeGlassMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: "#F4FBF8",
    transmission: 1,
    thickness: 0.12,
    ior: 1.5,
    roughness: 0.03,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    attenuationColor: new THREE.Color("#D8F2E4"),
    attenuationDistance: 3,
    specularIntensity: 1,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1,
  });

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
};

export const makeWoodTexture = () => {
  const [c, g] = canvas(1024, 512);
  g.fillStyle = P.wood;
  g.fillRect(0, 0, 1024, 512);
  const r = prng(303);
  for (let i = 0; i < 160; i++) {
    const y = r() * 512;
    g.strokeStyle = r() > 0.5 ? "rgba(40,24,12,0.25)" : "rgba(160,110,70,0.18)";
    g.lineWidth = 1 + r() * 3;
    g.beginPath();
    g.moveTo(0, y);
    for (let x = 0; x <= 1024; x += 32) g.lineTo(x, y + Math.sin(x * 0.01 + i) * 6 + Math.sin(x * 0.037 + i * 2) * 2);
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
};

export const makeCorkTexture = () => {
  const [c, g] = canvas(256, 256);
  g.fillStyle = P.cork;
  g.fillRect(0, 0, 256, 256);
  const r = prng(404);
  for (let i = 0; i < 2500; i++) {
    g.fillStyle = r() > 0.5 ? "rgba(70,45,20,0.35)" : "rgba(230,190,140,0.25)";
    g.fillRect(r() * 256, r() * 256, 1 + r() * 3, 1 + r() * 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

/** Out-of-focus fern silhouette for the foreground layer. */
export const makeLeafTexture = () => {
  const [c, g] = canvas(512, 512);
  g.clearRect(0, 0, 512, 512);
  g.filter = "blur(10px)";
  g.fillStyle = "rgba(28,52,24,0.95)";
  g.translate(60, 470);
  g.rotate(-0.75);
  g.fillRect(0, -5, 480, 10);
  for (let i = 0; i < 16; i++) {
    const x = 30 + i * 27;
    const L = 120 - i * 6;
    for (const s of [1, -1]) {
      g.beginPath();
      g.ellipse(x + 12, s * L * 0.45, 13, L * 0.5, s * 0.5, 0, Math.PI * 2);
      g.fill();
    }
  }
  return new THREE.CanvasTexture(c);
};

/** Soft round bokeh disc (window lights / fairy lights behind the jar). */
export const makeBokehTexture = () => {
  const [c, g] = canvas(128, 128);
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 62);
  grd.addColorStop(0, "rgba(255,255,255,0.9)");
  grd.addColorStop(0.75, "rgba(255,255,255,0.65)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.beginPath();
  g.arc(64, 64, 62, 0, Math.PI * 2);
  g.fill();
  return new THREE.CanvasTexture(c);
};

/** Speckled granular texture (gravel, soil, charcoal bands seen through the glass). */
export const makeSpeckleTexture = (base: string, dots: string[], seed: number, repeat = 4) => {
  const [c, g] = canvas(256, 256);
  g.fillStyle = base;
  g.fillRect(0, 0, 256, 256);
  const r = prng(seed);
  for (let i = 0; i < 1800; i++) {
    g.fillStyle = dots[Math.floor(r() * dots.length)];
    g.beginPath();
    g.ellipse(r() * 256, r() * 256, 1 + r() * 4, 1 + r() * 3, r() * 3, 0, Math.PI * 2);
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, 1);
  return tex;
};
