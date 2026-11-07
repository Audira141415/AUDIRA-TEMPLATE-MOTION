// SCALEFORGE materials — procedural planet, star, facade and label textures (CanvasTexture only).
import * as THREE from "three";
import { SCALE_PALETTE as P } from "./palette";
import { prng } from "../core/motion";

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
};
const srgb = (t: THREE.Texture) => {
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

/** Seeded value noise on a wrapped equirectangular grid. */
const noise2 = (seed: number, gw: number, gh: number) => {
  const r = prng(seed);
  const g = Array.from({ length: gw * gh }, () => r());
  const at = (x: number, y: number) => g[(((y % gh) + gh) % gh) * gw + (((x % gw) + gw) % gw)];
  return (u: number, v: number) => {
    const x = u * gw;
    const y = v * gh;
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const fx = x - x0;
    const fy = y - y0;
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    const a = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * sx;
    const b = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * sx;
    return a + (b - a) * sy;
  };
};

/** Fictional blue planet: fbm continents, ice caps, cloud layer separately. */
export const makeEarthTextures = () => {
  const W = 1024;
  const H = 512;
  const [c, g] = canvas(W, H);
  const [cc, cg] = canvas(W, H);
  const n1 = noise2(11, 8, 4);
  const n2 = noise2(12, 16, 8);
  const n3 = noise2(13, 32, 16);
  const nc = noise2(21, 24, 12);
  const img = g.createImageData(W, H);
  const cimg = cg.createImageData(W, H);
  const ocean = new THREE.Color(P.ocean);
  const deep = new THREE.Color("#0E3A70");
  const land = new THREE.Color(P.land);
  const desert = new THREE.Color(P.desert);
  const ice = new THREE.Color("#F2F6FA");
  const col = new THREE.Color();
  for (let y = 0; y < H; y++) {
    const v = y / H;
    const lat = Math.abs(v - 0.5) * 2;
    for (let x = 0; x < W; x++) {
      const u = x / W;
      const h = n1(u, v) * 0.55 + n2(u, v) * 0.3 + n3(u, v) * 0.15;
      if (lat > 0.86) col.copy(ice);
      else if (h > 0.56) col.copy(land).lerp(desert, clamp01((0.35 - Math.abs(lat - 0.35)) * 2.2 * n2(u + 0.3, v)));
      else col.copy(deep).lerp(ocean, clamp01((h - 0.3) / 0.26));
      const i = (y * W + x) * 4;
      img.data[i] = col.r * 255;
      img.data[i + 1] = col.g * 255;
      img.data[i + 2] = col.b * 255;
      img.data[i + 3] = 255;
      const cl = nc(u * 1.0 + 0.1 * Math.sin(v * 9), v) * 0.7 + n3(u + 0.5, v) * 0.3;
      const a = clamp01((cl - 0.55) * 3.2);
      cimg.data[i] = cimg.data[i + 1] = cimg.data[i + 2] = 255;
      cimg.data[i + 3] = a * 235;
    }
  }
  g.putImageData(img, 0, 0);
  cg.putImageData(cimg, 0, 0);
  return { surface: srgb(new THREE.CanvasTexture(c)), clouds: srgb(new THREE.CanvasTexture(cc)) };
};
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Sun photosphere: granulation cells + sunspots. */
export const makeSunTexture = () => {
  const [c, g] = canvas(1024, 512);
  g.fillStyle = "#FFB43A";
  g.fillRect(0, 0, 1024, 512);
  const r = prng(99);
  for (let i = 0; i < 9000; i++) {
    const v = r();
    g.fillStyle = v > 0.5 ? `rgba(255,236,150,${0.12 + r() * 0.2})` : `rgba(220,90,10,${0.1 + r() * 0.18})`;
    g.beginPath();
    g.arc(r() * 1024, r() * 512, 2 + r() * 6, 0, Math.PI * 2);
    g.fill();
  }
  for (let i = 0; i < 7; i++) {
    g.fillStyle = "rgba(90,30,5,0.6)";
    g.beginPath();
    g.ellipse(200 + r() * 600, 200 + r() * 120, 6 + r() * 10, 4 + r() * 6, 0, 0, Math.PI * 2);
    g.fill();
  }
  return srgb(new THREE.CanvasTexture(c));
};

/** Glass curtain-wall facade with a few lit windows. */
export const makeFacadeTexture = () => {
  const [c, g] = canvas(256, 1024);
  g.fillStyle = "#5E7286";
  g.fillRect(0, 0, 256, 1024);
  const r = prng(31);
  for (let y = 0; y < 1024; y += 12) {
    for (let x = 0; x < 256; x += 16) {
      const lit = r() > 0.82;
      g.fillStyle = lit ? "rgba(255,230,170,0.9)" : `rgba(${150 + r() * 40},${175 + r() * 40},${200 + r() * 40},0.85)`;
      g.fillRect(x + 2, y + 2, 12, 8);
    }
  }
  return srgb(new THREE.CanvasTexture(c));
};

/** Radial glow for corona / halos. */
export const makeGlow = () => {
  const [c, g] = canvas(256, 256);
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.35, "rgba(255,255,255,0.35)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
};

/** Measuring label: big exponent + name/size line. Light or dark ink. */
export const makeMeasureLabel = (exp: string, line: string, dark: boolean) => {
  const [c, g] = canvas(640, 200);
  g.fillStyle = dark ? "rgba(8,12,20,0.78)" : "rgba(255,255,255,0.86)";
  g.beginPath();
  g.roundRect(4, 4, 632, 192, 18);
  g.fill();
  g.fillStyle = P.accent;
  g.fillRect(4, 4, 12, 192);
  g.fillStyle = dark ? P.inkLight : P.ink;
  g.font = "bold 84px Arial, sans-serif";
  g.textBaseline = "alphabetic";
  g.fillText(exp, 40, 104);
  g.font = "bold 40px Arial, sans-serif";
  g.fillStyle = P.accent;
  g.fillText(line, 40, 166);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};
