import * as THREE from "three";
import { RISO_PALETTE as P } from "./palette";
import { rng } from "../core/motion";

// Riso ink: an unlit shader that outputs mix(white, ink, coverage) and is MULTIPLIED onto whatever is
// already in the framebuffer (CustomBlending: src * dst). Overlapping layers therefore overprint like
// real soy ink. Coverage = solid or 45°-ish halftone screen, broken up by paper-tooth grain and dropouts.
const VERT = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  #ifdef USE_INSTANCING
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
  #else
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  #endif
}`;

const FRAG = /* glsl */ `
uniform vec3 uInk;
uniform float uDensity;
uniform float uDot;
uniform float uAngle;
uniform float uGrain;
uniform float uSeed;
uniform float uOpacity;
varying vec2 vUv;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21) + uSeed); p += dot(p, p + 45.32); return fract(p.x * p.y); }
void main(){
  vec2 px = gl_FragCoord.xy;
  float cov = 1.0;
  if (uDensity < 0.97) {
    float c = cos(uAngle), s = sin(uAngle);
    vec2 q = mat2(c, -s, s, c) * px / uDot;
    float d = length(fract(q) - 0.5);
    float r = sqrt(uDensity) * 0.66;
    cov = 1.0 - smoothstep(r - 0.09, r + 0.09, d);
  }
  // paper tooth: coarse blotches + fine speckle dropouts where ink did not transfer
  float g1 = hash(floor(px / uGrain));
  float g2 = hash(floor(px / (uGrain * 0.5)) + 7.0);
  cov *= 0.80 + 0.20 * g1;
  cov *= g2 < 0.07 ? 0.25 : 1.0;
  cov *= uOpacity;
  gl_FragColor = vec4(mix(vec3(1.0), uInk, cov), 1.0);
  #include <colorspace_fragment>
}`;

export const makeRisoInk = (color: string, density: number, dotPx: number, seed: number, angle = 0.26) =>
  new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uInk: { value: new THREE.Color(color) },
      uDensity: { value: density },
      uDot: { value: dotPx },
      uAngle: { value: angle },
      uGrain: { value: Math.max(1, dotPx * 0.35) },
      uSeed: { value: seed },
      uOpacity: { value: 1 },
    },
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.DstColorFactor,
    blendDst: THREE.ZeroFactor,
  });

const canvasTex = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
};

/** Uncoated cream stock with fibres and mottling (seeded). */
export const makePaperTexture = (seed: number) =>
  canvasTex(1024, 1024, (ctx) => {
    const r = rng(seed);
    ctx.fillStyle = P.paper;
    ctx.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 9000; i++) {
      const v = r();
      ctx.fillStyle = v > 0.5 ? "rgba(255,255,255,0.35)" : "rgba(150,130,100,0.10)";
      ctx.fillRect(r() * 1024, r() * 1024, 1 + r() * 2, 1 + r() * 2);
    }
    ctx.strokeStyle = "rgba(140,120,90,0.12)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 260; i++) {
      const x = r() * 1024, y = r() * 1024, a = r() * Math.PI;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + Math.cos(a) * 10, y + Math.sin(a) * 10 + 4, x + Math.cos(a) * 22, y + Math.sin(a) * 22);
      ctx.stroke();
    }
  });

/** Self-healing cutting mat with a 1 cm grid. */
export const makeMatTexture = () =>
  canvasTex(1024, 1024, (ctx) => {
    ctx.fillStyle = P.mat;
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.strokeStyle = P.matLine;
    for (let i = 0; i <= 64; i++) {
      ctx.lineWidth = i % 8 === 0 ? 3 : 1;
      ctx.beginPath();
      ctx.moveTo(i * 16, 0);
      ctx.lineTo(i * 16, 1024);
      ctx.moveTo(0, i * 16);
      ctx.lineTo(1024, i * 16);
      ctx.stroke();
    }
  });
