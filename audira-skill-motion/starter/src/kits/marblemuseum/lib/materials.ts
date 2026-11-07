import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MARBLE_PALETTE } from "./palette";
import { mulberry32 } from "../core/motion";

// World-space marble veining (no UVs, so no seams on sculpted or instanced geometry).
const MARBLE_GLSL = /* glsl */ `
  varying vec3 vMPos;
  float mHash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float mNoise(vec3 x){
    vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(mHash(i + vec3(0,0,0)), mHash(i + vec3(1,0,0)), f.x), mix(mHash(i + vec3(0,1,0)), mHash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(mHash(i + vec3(0,0,1)), mHash(i + vec3(1,0,1)), f.x), mix(mHash(i + vec3(0,1,1)), mHash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float mFbm(vec3 p){ float a = 0.5; float s = 0.0; for (int k = 0; k < 5; k++){ s += a * mNoise(p); p *= 2.03; a *= 0.5; } return s; }
  vec3 marbleTint(vec3 base, vec3 p, float scale, float strength){
    p *= scale;
    float n = mFbm(p * 1.6);
    float v1 = abs(sin((p.x * 1.1 + p.y * 2.1 + p.z * 0.6) * 2.4 + n * 7.0));
    float v2 = abs(sin((p.x * -1.7 + p.y * 0.9 + p.z * 1.3) * 5.0 + mFbm(p * 3.1) * 9.0));
    float vein = (1.0 - smoothstep(0.0, 0.06, v1)) * 0.75 + (1.0 - smoothstep(0.0, 0.035, v2)) * 0.35;
    float cloud = 0.93 + 0.07 * mFbm(p * 0.8 + 3.0);
    vec3 veinCol = mix(vec3(0.42, 0.45, 0.49), vec3(0.55, 0.48, 0.40), mNoise(p * 0.5));
    return mix(base * cloud, veinCol, clamp(vein * strength, 0.0, 0.8));
  }
`;

/**
 * Statuary marble: physical material + world-space procedural veins, a faint warm subsurface lift
 * (emissive) and sheen so grazing light glows on the stone.
 */
export const makeMarbleMaterial = (opts: { color?: string; scale?: number; strength?: number; roughness?: number } = {}) => {
  const mat = new THREE.MeshPhysicalMaterial({
    color: opts.color ?? MARBLE_PALETTE.marbleWarm,
    roughness: opts.roughness ?? 0.3,
    metalness: 0,
    clearcoat: 0.25,
    clearcoatRoughness: 0.35,
    sheen: 0.15,
    sheenColor: new THREE.Color("#FFF1DE"),
    sheenRoughness: 0.6,
    emissive: new THREE.Color("#3A2A1C"),
    emissiveIntensity: 0.04,
  });
  const scale = (opts.scale ?? 2.6).toFixed(3);
  const strength = (opts.strength ?? 0.95).toFixed(3);
  mat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vMPos;")
      .replace(
        "#include <worldpos_vertex>",
        "#include <worldpos_vertex>\n vec4 mP = vec4(transformed, 1.0);\n #ifdef USE_INSTANCING\n mP = instanceMatrix * mP;\n #endif\n vMPos = (modelMatrix * mP).xyz;",
      );
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", `#include <common>\n${MARBLE_GLSL}`)
      .replace("#include <color_fragment>", `#include <color_fragment>\n diffuseColor.rgb = marbleTint(diffuseColor.rgb, vMPos, ${scale}, ${strength});`);
  };
  mat.customProgramCacheKey = () => `marble-${scale}-${strength}`;
  return mat;
};

export const makeGiltMaterial = () => new THREE.MeshStandardMaterial({ color: MARBLE_PALETTE.gilt, roughness: 0.28, metalness: 1, envMapIntensity: 1.1 });

/** Original painting for the gilded frame: dusk landscape in loose oil strokes. */
export const makePaintingTexture = () => {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 320;
  const g = c.getContext("2d")!;
  const rnd = mulberry32(6101);
  const sky = g.createLinearGradient(0, 0, 0, 320);
  sky.addColorStop(0, "#2D3A4A");
  sky.addColorStop(0.45, "#B9875A");
  sky.addColorStop(0.62, "#5E4A35");
  sky.addColorStop(1, "#1E1A14");
  g.fillStyle = sky;
  g.fillRect(0, 0, 256, 320);
  for (let i = 0; i < 900; i++) {
    const y = rnd() * 320;
    const warm = y < 190;
    g.fillStyle = warm ? `rgba(${200 + rnd() * 50},${140 + rnd() * 60},${80 + rnd() * 40},0.10)` : `rgba(${30 + rnd() * 40},${40 + rnd() * 30},${20 + rnd() * 20},0.18)`;
    g.fillRect(rnd() * 256, y, 6 + rnd() * 18, 2 + rnd() * 3);
  }
  // distant hills + a small temple silhouette (original)
  g.fillStyle = "rgba(25,22,18,0.85)";
  g.beginPath();
  g.moveTo(0, 220);
  for (let x = 0; x <= 256; x += 16) g.lineTo(x, 205 + Math.sin(x * 0.03) * 14 + rnd() * 6);
  g.lineTo(256, 320);
  g.lineTo(0, 320);
  g.fill();
  g.fillRect(150, 180, 40, 6);
  for (let k = 0; k < 5; k++) g.fillRect(152 + k * 8, 186, 3, 20);
  g.beginPath();
  g.moveTo(148, 180);
  g.lineTo(170, 168);
  g.lineTo(192, 180);
  g.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

/** Polished gallery floor: large two-tone stone slabs. */
export const makeFloorTexture = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  const rnd = mulberry32(6102);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const light = (i + j) % 2 === 0;
      g.fillStyle = light ? MARBLE_PALETTE.floorLight : MARBLE_PALETTE.floorDark;
      g.fillRect(i * 128, j * 128, 128, 128);
      for (let s = 0; s < 120; s++) {
        g.strokeStyle = light ? `rgba(120,110,100,${0.05 + rnd() * 0.08})` : `rgba(200,190,170,${0.03 + rnd() * 0.05})`;
        g.beginPath();
        const x = i * 128 + rnd() * 128;
        const y = j * 128 + rnd() * 128;
        g.moveTo(x, y);
        g.lineTo(x + (rnd() - 0.5) * 50, y + (rnd() - 0.5) * 50);
        g.stroke();
      }
      g.strokeStyle = "rgba(0,0,0,0.35)";
      g.strokeRect(i * 128, j * 128, 128, 128);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
};

export const makeEnvironment = (gl: THREE.WebGLRenderer) => {
  const pmrem = new THREE.PMREMGenerator(gl);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  return env;
};

/** Soft light-shaft texture (skylight beam). */
export const makeBeamTexture = () => {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 256;
  const g = c.getContext("2d")!;
  const img = g.createImageData(64, 256);
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 64; x++) {
      const u = x / 63 - 0.5;
      const v = y / 255;
      const a = Math.exp(-(u * u) / 0.06) * (1 - 0.7 * v) * Math.min(1, (1 - v) * 5);
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
