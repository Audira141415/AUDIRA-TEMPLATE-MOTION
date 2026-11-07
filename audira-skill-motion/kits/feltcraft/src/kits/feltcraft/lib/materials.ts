import * as THREE from "three";
import { mulberry32 } from "../core/motion";

// Felt, wool and yarn surfaces. Felt = matte fibres + cloth sheen (no clay gloss). Fuzz = a few
// alpha-tested shells around a mesh whose density thins outward (shell technique).

let feltTexCache: THREE.CanvasTexture | null = null;
/** Matted fibre texture: hundreds of short curved strokes, grey-scale (multiplied by colour). */
export const feltFibreTexture = () => {
  if (feltTexCache) return feltTexCache;
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#d8d8d8";
  g.fillRect(0, 0, 512, 512);
  const rnd = mulberry32(5501);
  for (let i = 0; i < 5200; i++) {
    const x = rnd() * 512;
    const y = rnd() * 512;
    const a = rnd() * Math.PI * 2;
    const l = 4 + rnd() * 14;
    const v = Math.floor(170 + rnd() * 85);
    g.strokeStyle = `rgba(${v},${v},${v},${0.35 + rnd() * 0.4})`;
    g.lineWidth = 0.6 + rnd() * 1.1;
    g.beginPath();
    g.moveTo(x, y);
    g.quadraticCurveTo(x + Math.cos(a + 0.6) * l * 0.5, y + Math.sin(a + 0.6) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l);
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  feltTexCache = tex;
  return tex;
};

let fuzzTexCache: THREE.CanvasTexture | null = null;
/** Alpha speckle for fuzz shells (white = fibre). */
export const fuzzAlphaTexture = () => {
  if (fuzzTexCache) return fuzzTexCache;
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const img = g.createImageData(256, 256);
  const rnd = mulberry32(5517);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.pow(rnd(), 2.2) * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  tex.magFilter = THREE.NearestFilter;
  fuzzTexCache = tex;
  return tex;
};

export const feltMaterial = (color: string, repeat = 2) => {
  const map = feltFibreTexture().clone();
  map.repeat.set(repeat, repeat);
  map.needsUpdate = true;
  return new THREE.MeshPhysicalMaterial({
    color,
    map,
    roughness: 1,
    metalness: 0,
    sheen: 1,
    sheenRoughness: 0.75,
    sheenColor: new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.45),
    bumpMap: map,
    bumpScale: 1.2,
  });
};

/** One fuzz shell: alpha-tested fibre speckle; higher shells keep fewer fibres. */
export const fuzzShellMaterial = (color: string, level: number) =>
  new THREE.MeshStandardMaterial({
    color: new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.12 + level * 0.06),
    alphaMap: fuzzAlphaTexture(),
    alphaTest: 0.35 + level * 0.13,
    transparent: false,
    roughness: 1,
    side: THREE.DoubleSide,
  });

export const yarnMaterial = (color: string) =>
  new THREE.MeshPhysicalMaterial({ color, roughness: 0.95, sheen: 1, sheenRoughness: 0.6, sheenColor: new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.5) });

export const beadMaterial = () => new THREE.MeshPhysicalMaterial({ color: "#14100E", roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.03 });
