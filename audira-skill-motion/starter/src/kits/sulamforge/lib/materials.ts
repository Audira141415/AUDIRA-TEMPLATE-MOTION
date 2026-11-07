import * as THREE from "three";
import { mulberry32 } from "../core/motion";
import { SULAM_PALETTE as P } from "./palette";
import { ThreadGroup } from "./pattern";

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};
const toTex = (c: HTMLCanvasElement, repeat: [number, number] = [1, 1], srgb = true) => {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 8;
  return t;
};

/** Plain-weave linen: alternating over/under thread bumps (also used as bump map). */
export const makeLinenTextures = () => {
  const c = canvas(256, 256);
  const g = c.getContext("2d")!;
  const rnd = mulberry32(14);
  g.fillStyle = P.linen;
  g.fillRect(0, 0, 256, 256);
  const s = 8;
  for (let y = 0; y < 256; y += s) {
    for (let x = 0; x < 256; x += s) {
      const over = ((x + y) / s) % 2 === 0;
      const v = 220 + rnd() * 25;
      g.fillStyle = over ? `rgb(${v},${v - 10},${v - 30})` : `rgb(${v - 30},${v - 40},${v - 58})`;
      if (over) g.fillRect(x + 1, y + 2, s - 2, s - 4);
      else g.fillRect(x + 2, y + 1, s - 4, s - 2);
    }
  }
  // slub irregularities
  for (let i = 0; i < 30; i++) {
    g.fillStyle = "rgba(180,165,135,0.35)";
    g.fillRect(0, rnd() * 256, 256, 1 + rnd() * 2);
  }
  return { map: toTex(c, [14, 14]), bump: toTex(c, [14, 14], false) };
};

/**
 * Songket cloth: plum/maroon tenun with gold supplementary-weft motifs
 * (pucuk rebung triangles + diamond lattice). Returns colour map plus metalness/roughness masks
 * so only the gold floats behave like metal and catch the light.
 */
export const makeSongketTextures = () => {
  const W = 512;
  const color = canvas(W, W);
  const mask = canvas(W, W);
  const g = color.getContext("2d")!;
  const m = mask.getContext("2d")!;
  g.fillStyle = P.songketPlum;
  g.fillRect(0, 0, W, W);
  m.fillStyle = "#000";
  m.fillRect(0, 0, W, W);
  // base weave lines
  for (let y = 0; y < W; y += 3) {
    g.fillStyle = y % 6 ? "rgba(110,20,48,0.5)" : "rgba(40,6,18,0.4)";
    g.fillRect(0, y, W, 1);
  }
  const gold = (x: number, y: number, w: number, h: number) => {
    // floats: short horizontal gold dashes so it reads as woven, not printed
    for (let yy = y; yy < y + h; yy += 3) {
      g.fillStyle = (yy / 3) % 2 ? P.gold : P.goldDeep;
      g.fillRect(x, yy, w, 2);
      m.fillStyle = "#fff";
      m.fillRect(x, yy, w, 2);
    }
  };
  // pucuk rebung (bamboo-shoot triangles) border bands top and bottom
  const tri = (x0: number, base: number, h: number, up: boolean) => {
    for (let k = 0; k < h; k += 3) {
      const half = ((h - k) / h) * 14;
      gold(x0 - half, up ? base - k : base + k, half * 2, 2);
    }
  };
  for (let x = 16; x < W; x += 32) {
    tri(x, 60, 48, true);
    tri(x, W - 60, 48, false);
  }
  gold(0, 66, W, 6);
  gold(0, W - 72, W, 6);
  // diamond lattice in the body
  for (let y = 110; y < W - 110; y += 48) {
    for (let x = ((y / 48) % 2) * 24; x < W; x += 48) {
      for (let k = -12; k <= 12; k += 3) {
        const half = 12 - Math.abs(k);
        gold(x - half, y + k, half * 2 + 1, 2);
      }
    }
  }
  const mapT = toTex(color, [2, 2]);
  const metal = toTex(mask, [2, 2], false);
  return { map: mapT, metalness: metal };
};

export const makeSpoolTexture = (color: string, seed: number) => {
  const c = canvas(64, 256);
  const g = c.getContext("2d")!;
  g.fillStyle = color;
  g.fillRect(0, 0, 64, 256);
  const rnd = mulberry32(seed);
  for (let y = 0; y < 256; y += 2) {
    g.fillStyle = `rgba(255,255,255,${0.05 + rnd() * 0.12})`;
    g.fillRect(0, y, 64, 1);
  }
  return toTex(c, [1, 1]);
};

/** Silk floss: soft sheen, satin highlight. */
export const silkMaterial = (color: string) =>
  new THREE.MeshPhysicalMaterial({ color, roughness: 0.42, metalness: 0, sheen: 1, sheenRoughness: 0.35, sheenColor: new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.5), clearcoat: 0.25, clearcoatRoughness: 0.4 });

export const goldThreadMaterial = () => new THREE.MeshStandardMaterial({ color: P.gold, metalness: 1, roughness: 0.22, envMapIntensity: 1.6 });

export const THREAD_COLORS: Record<ThreadGroup, string> = {
  crimson: P.threadCrimson,
  vermilion: P.threadVermilion,
  blush: P.threadBlush,
  leaf: P.threadLeaf,
  moss: P.threadMoss,
  gold: P.gold,
};
