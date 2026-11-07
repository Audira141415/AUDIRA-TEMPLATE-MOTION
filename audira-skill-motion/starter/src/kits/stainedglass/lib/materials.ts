import * as THREE from "three";
import { STAINED_PALETTE } from "./palette";
import { mulberry32 } from "../core/motion";

/** Lead came: dark, soft metal with a dull sheen. */
export const makeLeadMaterial = () => new THREE.MeshStandardMaterial({ color: STAINED_PALETTE.lead, roughness: 0.45, metalness: 0.7 });

/** Coursed ashlar or flagstone texture painted on a canvas (deterministic). */
export const makeStoneTexture = (seed: number, cols: number, rows: number, flag = false) => {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  const rnd = mulberry32(seed);
  g.fillStyle = STAINED_PALETTE.mortar;
  g.fillRect(0, 0, 512, 512);
  const bh = 512 / rows;
  for (let r = 0; r < rows; r++) {
    const off = flag ? rnd() * 0.5 : r % 2 ? 0.5 : 0;
    const bw = 512 / cols;
    for (let k = -1; k <= cols; k++) {
      const x = (k + off) * bw;
      const tone = 0.78 + rnd() * 0.3;
      const base = new THREE.Color(STAINED_PALETTE.stone).multiplyScalar(tone);
      g.fillStyle = `#${base.getHexString()}`;
      g.fillRect(x + 3, r * bh + 3, bw - 6, bh - 6);
      // weathering speckle
      for (let s = 0; s < 70; s++) {
        g.fillStyle = `rgba(${rnd() < 0.5 ? "0,0,0" : "255,240,220"},${0.04 + rnd() * 0.08})`;
        g.fillRect(x + 3 + rnd() * (bw - 8), r * bh + 3 + rnd() * (bh - 8), 2 + rnd() * 5, 2 + rnd() * 5);
      }
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
};

/** Soft-edged beam texture for additive light shafts. */
export const makeShaftTexture = () => {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 256;
  const g = c.getContext("2d")!;
  const img = g.createImageData(64, 256);
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 64; x++) {
      const u = x / 63 - 0.5;
      const v = y / 255;
      const a = Math.exp(-(u * u) / 0.05) * Math.pow(Math.sin(v * Math.PI), 0.7) * (0.55 + 0.45 * v);
      const i = (y * 64 + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = a * 255;
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

/** Radial glow sprite (sun flare through the rose). */
export const makeGlowTexture = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  r.addColorStop(0, "rgba(255,255,255,1)");
  r.addColorStop(0.2, "rgba(255,230,180,0.55)");
  r.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};
