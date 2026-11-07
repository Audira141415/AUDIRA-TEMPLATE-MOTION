import * as THREE from "three";
import { DREAM_PALETTE } from "./palette";
import { mulberry32 } from "../core/motion";

/** Pastel gradient sky dome (also baked into the environment map so water and tile reflect it). */
export const makeSkyMaterial = () =>
  new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uZenith: { value: new THREE.Color(DREAM_PALETTE.skyZenith) },
      uMid: { value: new THREE.Color(DREAM_PALETTE.skyMid) },
      uHorizon: { value: new THREE.Color(DREAM_PALETTE.skyHorizon) },
    },
    vertexShader: /* glsl */ `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uZenith; uniform vec3 uMid; uniform vec3 uHorizon; varying vec3 vDir;
      void main(){
        float h = clamp(vDir.y, -1.0, 1.0);
        vec3 c = h > 0.18 ? mix(uMid, uZenith, smoothstep(0.18, 0.85, h)) : mix(uHorizon, uMid, smoothstep(-0.05, 0.18, h));
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  });

export const makeEnvironment = (gl: THREE.WebGLRenderer) => {
  const s = new THREE.Scene();
  s.add(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), makeSkyMaterial()));
  const pmrem = new THREE.PMREMGenerator(gl);
  const env = pmrem.fromScene(s, 0).texture;
  pmrem.dispose();
  return env;
};

/** Glossy white pool tile with soft grey grout. */
export const makeTileTexture = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const rnd = mulberry32(6401);
  g.fillStyle = DREAM_PALETTE.grout;
  g.fillRect(0, 0, 256, 256);
  const n = 8;
  const w = 256 / n;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const k = 0.96 + rnd() * 0.04;
      const base = new THREE.Color(DREAM_PALETTE.tile).multiplyScalar(k);
      g.fillStyle = `#${base.getHexString()}`;
      g.fillRect(i * w + 1.5, j * w + 1.5, w - 3, w - 3);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
};

/** Gentle ripple normal map (sum of sines), scrolled over time. */
export const makeRippleNormal = () => {
  const N = 256;
  const c = document.createElement("canvas");
  c.width = c.height = N;
  const g = c.getContext("2d")!;
  const img = g.createImageData(N, N);
  const h = (x: number, y: number) =>
    Math.sin((x / N) * Math.PI * 2 * 3 + Math.sin((y / N) * Math.PI * 2 * 2) * 1.5) * 0.5 + Math.sin((y / N) * Math.PI * 2 * 5 + (x / N) * Math.PI * 2 * 2) * 0.35;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const dx = h(x + 1, y) - h(x - 1, y);
      const dy = h(x, y + 1) - h(x, y - 1);
      const nx = -dx * 2;
      const ny = -dy * 2;
      const l = Math.hypot(nx, ny, 1);
      const i = (y * N + x) * 4;
      img.data[i] = ((nx / l) * 0.5 + 0.5) * 255;
      img.data[i + 1] = ((ny / l) * 0.5 + 0.5) * 255;
      img.data[i + 2] = ((1 / l) * 0.5 + 0.5) * 255;
      img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
};

/** Soft radial glow sprite. */
export const makeGlowTexture = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, "rgba(255,255,255,1)");
  r.addColorStop(0.35, "rgba(255,240,230,0.45)");
  r.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};
