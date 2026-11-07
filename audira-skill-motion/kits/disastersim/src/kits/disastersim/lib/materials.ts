// DISASTERSIM materials — procedural CanvasTextures for the cut face of the earth block and the 3D labels.
import * as THREE from "three";
import { DISASTER_PALETTE as P } from "./palette";
import { BLOCK, prng } from "../core/motion";

/** Extrude front-face UVs are shape coordinates (x, y); this maps the whole block onto 0..1. */
const fitBlock = (tex: THREE.Texture) => {
  const w = BLOCK.x1 - BLOCK.x0;
  const h = 1.2 - BLOCK.bottom;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.repeat.set(1 / w, 1 / h);
  tex.offset.set(-BLOCK.x0 / w, -BLOCK.bottom / h);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
};

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
};

/** Y (world) -> canvas row for a block texture of height H. */
const rowOf = (y: number, H: number) => ((1.2 - y) / (1.2 - BLOCK.bottom)) * H;

/** Continental crust: wavy sediment bands over granite, seeded grain. */
export const makeCrustTexture = () => {
  const [c, g] = canvas(1024, 720);
  const W = c.width;
  const H = c.height;
  const bands: [number, string][] = [
    [1.2, "#D8BC8A"],
    [0.1, P.sediment],
    [-0.35, "#B69468"],
    [-0.75, "#A88A6C"],
    [-1.2, P.granite],
    [-2.1, "#857669"],
    [-3.0, "#6F6158"],
  ];
  bands.forEach(([y, col], i) => {
    g.fillStyle = col;
    g.beginPath();
    g.moveTo(0, H);
    for (let x = 0; x <= W; x += 8) {
      const wy = y + 0.06 * Math.sin(x * 0.012 + i * 1.7) + 0.03 * Math.sin(x * 0.041 + i);
      g.lineTo(x, rowOf(wy, H));
    }
    g.lineTo(W, H);
    g.closePath();
    g.fill();
  });
  const r = prng(48);
  for (let i = 0; i < 9000; i++) {
    g.fillStyle = r() > 0.5 ? "rgba(255,255,255,0.07)" : "rgba(40,25,10,0.09)";
    g.fillRect(r() * W, r() * H, 1 + r() * 2, 1 + r() * 2);
  }
  return fitBlock(new THREE.CanvasTexture(c));
};

/** Oceanic plate: dark basalt with pillow-lava speckle and a thin sediment veneer on top. */
export const makeBasaltTexture = () => {
  const [c, g] = canvas(1024, 720);
  g.fillStyle = P.basalt;
  g.fillRect(0, 0, c.width, c.height);
  const r = prng(77);
  for (let i = 0; i < 2600; i++) {
    const x = r() * c.width;
    const y = r() * c.height;
    g.fillStyle = r() > 0.5 ? "rgba(120,135,150,0.16)" : "rgba(10,14,18,0.25)";
    g.beginPath();
    g.ellipse(x, y, 3 + r() * 7, 2 + r() * 4, 0, 0, Math.PI * 2);
    g.fill();
  }
  return fitBlock(new THREE.CanvasTexture(c));
};

/** Mantle: hot convection swirl, brighter near the top. */
export const makeMantleTexture = () => {
  const [c, g] = canvas(1024, 720);
  const grd = g.createLinearGradient(0, rowOf(-1.4, c.height), 0, c.height);
  grd.addColorStop(0, P.mantleHot);
  grd.addColorStop(1, P.mantleDeep);
  g.fillStyle = grd;
  g.fillRect(0, 0, c.width, c.height);
  const r = prng(9);
  for (let i = 0; i < 70; i++) {
    g.strokeStyle = `rgba(255,${180 + Math.floor(r() * 60)},90,${0.08 + r() * 0.12})`;
    g.lineWidth = 2 + r() * 6;
    const cx = r() * c.width;
    const cy = rowOf(-2.2 - r() * 2.2, c.height);
    g.beginPath();
    g.ellipse(cx, cy, 30 + r() * 90, 10 + r() * 30, r() * 0.6, 0, Math.PI * (1 + r()));
    g.stroke();
  }
  return fitBlock(new THREE.CanvasTexture(c));
};

/** Text label for a sprite; returns the texture and its aspect ratio. */
export const makeLabel = (text: string, accent: string) => {
  const [c, g] = canvas(512, 96);
  g.fillStyle = "rgba(8,16,22,0.82)";
  g.beginPath();
  g.roundRect(4, 8, 504, 80, 14);
  g.fill();
  g.fillStyle = accent;
  g.fillRect(4, 8, 10, 80);
  g.fillStyle = "#EAF4F8";
  g.font = "bold 40px Arial, sans-serif";
  g.textBaseline = "middle";
  g.fillText(text, 32, 50);
  const width = Math.min(504, g.measureText(text).width + 60);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return { tex, aspect: 512 / 96, used: width / 512 };
};

/** Soft radial glow. */
export const makeGlow = () => {
  const [c, g] = canvas(128, 128);
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.3, "rgba(255,255,255,0.4)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
};
