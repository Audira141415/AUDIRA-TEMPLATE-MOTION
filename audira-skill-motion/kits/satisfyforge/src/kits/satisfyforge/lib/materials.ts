import * as THREE from "three";
import { mulberry32 } from "../core/motion";

// Shapes and procedural maps for the satisfying-loop studio.

/** Fine sand grain bump map (seeded). */
export const makeSandGrain = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const img = g.createImageData(256, 256);
  const rnd = mulberry32(5011);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 110 + rnd() * 120;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
};

export const sandMaterial = (color: string, grain: THREE.Texture) =>
  new THREE.MeshStandardMaterial({ color, roughness: 1, metalness: 0, bumpMap: grain, bumpScale: 0.6 });

export const candyMaterial = (color: string) =>
  new THREE.MeshPhysicalMaterial({ color, roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.25 });

// ---- 2D outlines (centred, ~unit size) ----
export const heartShape = (s = 1) => {
  const sh = new THREE.Shape();
  sh.moveTo(0, -0.5 * s);
  sh.bezierCurveTo(0.12 * s, -0.36 * s, 0.55 * s, -0.12 * s, 0.55 * s, 0.16 * s);
  sh.bezierCurveTo(0.55 * s, 0.4 * s, 0.36 * s, 0.52 * s, 0.24 * s, 0.52 * s);
  sh.bezierCurveTo(0.1 * s, 0.52 * s, 0.02 * s, 0.42 * s, 0, 0.34 * s);
  sh.bezierCurveTo(-0.02 * s, 0.42 * s, -0.1 * s, 0.52 * s, -0.24 * s, 0.52 * s);
  sh.bezierCurveTo(-0.36 * s, 0.52 * s, -0.55 * s, 0.4 * s, -0.55 * s, 0.16 * s);
  sh.bezierCurveTo(-0.55 * s, -0.12 * s, -0.12 * s, -0.36 * s, 0, -0.5 * s);
  return sh;
};

export const starShape = (r = 0.2, inner = 0.45, cx = 0, cy = 0, rot = 0) => {
  const sh = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = rot + Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * inner;
    const x = cx + Math.cos(a) * rr;
    const y = cy + Math.sin(a) * rr;
    if (i === 0) sh.moveTo(x, y);
    else sh.lineTo(x, y);
  }
  sh.closePath();
  return sh;
};

export const circleShape = (r = 0.18, cx = 0, cy = 0) => {
  const sh = new THREE.Shape();
  sh.absarc(cx, cy, r, 0, Math.PI * 2, false);
  return sh;
};

export const squareShape = (h = 0.16, cx = 0, cy = 0) => {
  const sh = new THREE.Shape();
  sh.moveTo(cx - h, cy - h);
  sh.lineTo(cx + h, cy - h);
  sh.lineTo(cx + h, cy + h);
  sh.lineTo(cx - h, cy + h);
  sh.closePath();
  return sh;
};

export const triangleShape = (r = 0.2, cx = 0, cy = 0) => {
  const sh = new THREE.Shape();
  for (let i = 0; i < 3; i++) {
    const a = Math.PI / 2 + (i * Math.PI * 2) / 3;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r - r * 0.18;
    if (i === 0) sh.moveTo(x, y);
    else sh.lineTo(x, y);
  }
  sh.closePath();
  return sh;
};
