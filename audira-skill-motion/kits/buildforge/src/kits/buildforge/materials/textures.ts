// Procedural, seamless surface textures drawn once on canvas from fixed seeds. They are
// near-white so the material colour sets the tone and the map only adds life.

import { CanvasTexture, RepeatWrapping, SRGBColorSpace, type Texture } from "three";
import { rng } from "../geometry/noise.ts";

const canvas = (w: number, h: number) => {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  return { cv, g: cv.getContext("2d")! };
};

const finish = (cv: HTMLCanvasElement) => {
  const t = new CanvasTexture(cv);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

/** Dabs drawn with wrap-around so the tile is seamless. */
const dabs = (g: CanvasRenderingContext2D, w: number, h: number, n: number, r: () => number, rad: [number, number], alpha: number) => {
  for (let i = 0; i < n; i++) {
    const x = r() * w, y = r() * h, rr = rad[0] + r() * (rad[1] - rad[0]);
    g.fillStyle = r() < 0.5 ? `rgba(0,0,0,${r() * alpha})` : `rgba(255,255,255,${r() * alpha})`;
    for (const dx of [-w, 0, w])
      for (const dy of [-h, 0, h]) {
        g.beginPath();
        g.arc(x + dx, y + dy, rr, 0, Math.PI * 2);
        g.fill();
      }
  }
};

const grain = (g: CanvasRenderingContext2D, w: number, h: number, r: () => number, amp: number) => {
  const img = g.getImageData(0, 0, w, h);
  for (let i = 0; i < img.data.length; i += 4) {
    const d = (r() - 0.5) * amp;
    img.data[i] += d;
    img.data[i + 1] += d;
    img.data[i + 2] += d;
  }
  g.putImageData(img, 0, 0);
};

export const concreteTexture = () => {
  const { cv, g } = canvas(512, 512);
  const r = rng(11);
  g.fillStyle = "#f2f2f2";
  g.fillRect(0, 0, 512, 512);
  dabs(g, 512, 512, 900, r, [10, 70], 0.035);
  dabs(g, 512, 512, 2600, r, [1, 3], 0.12);
  grain(g, 512, 512, r, 10);
  return finish(cv);
};

export const woodTexture = () => {
  const { cv, g } = canvas(256, 512);
  const r = rng(23);
  const img = g.createImageData(256, 512);
  const phase = Array.from({ length: 6 }, () => r() * 6.28);
  for (let x = 0; x < 256; x++) {
    // grain runs along v (the board's length)
    for (let y = 0; y < 512; y++) {
      const wob = Math.sin((y / 512) * 6.283 * 2 + phase[0]) * 3 + Math.sin((y / 512) * 6.283 * 5 + phase[1]) * 1.2;
      const xx = x + wob;
      const ring = 0.5 + 0.5 * Math.sin((xx / 256) * 6.283 * 9 + Math.sin((xx / 256) * 6.283 * 2 + phase[2]) * 2.2);
      const fine = 0.5 + 0.5 * Math.sin((xx / 256) * 6.283 * 41 + phase[3]);
      const v = 0.8 + ring * 0.13 + fine * 0.05 + (r() - 0.5) * 0.04;
      const i = (y * 256 + x) * 4;
      img.data[i] = 255 * Math.min(1, v * 1.02);
      img.data[i + 1] = 255 * Math.min(1, v * 0.97);
      img.data[i + 2] = 255 * Math.min(1, v * 0.9);
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  return finish(cv);
};

export const gravelTexture = () => {
  const { cv, g } = canvas(256, 256);
  const r = rng(37);
  g.fillStyle = "#d8d8d8";
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 1400; i++) {
    const x = r() * 256, y = r() * 256, rr = 1.5 + r() * 4.5, v = 150 + r() * 105;
    g.fillStyle = `rgb(${v},${v * 0.98},${v * 0.94})`;
    for (const dx of [-256, 0, 256])
      for (const dy of [-256, 0, 256]) {
        g.beginPath();
        g.ellipse(x + dx, y + dy, rr, rr * (0.6 + r() * 0.4), r() * 3, 0, Math.PI * 2);
        g.fill();
      }
  }
  return finish(cv);
};

const cache = new Map<string, Texture>();
export const texture = (id: "concrete" | "wood" | "gravel", tile: number) => {
  const key = `${id}@${tile}`;
  let t = cache.get(key);
  if (!t) {
    const base = cache.get(id) ?? (id === "concrete" ? concreteTexture() : id === "wood" ? woodTexture() : gravelTexture());
    cache.set(id, base);
    t = base.clone();
    t.repeat.set(1 / tile, 1 / tile);
    t.needsUpdate = true;
    cache.set(key, t);
  }
  return t;
};
