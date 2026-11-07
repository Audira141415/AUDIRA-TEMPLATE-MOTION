import * as THREE from "three";
import { ARCADE_PALETTE as P } from "./palette";
import { rng } from "../core/motion";

export const canvasTex = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, nearest = false) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  if (nearest) {
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.generateMipmaps = false;
  } else t.anisotropy = 8;
  return t;
};

// CRT tube: barrel-distorted raster with RGB convergence error (chromatic fringing), aperture-grille
// scanlines, phosphor glow, vignette and a warm-up "line to raster" power-on.
const CRT_VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const CRT_FRAG = /* glsl */ `
uniform sampler2D uTex;
uniform float uPower;
uniform float uLines;
uniform float uTime;
uniform float uBoost;
varying vec2 vUv;
vec2 barrel(vec2 uv){ vec2 c = uv * 2.0 - 1.0; c *= 1.0 + 0.09 * dot(c, c); return c * 0.5 + 0.5; }
void main(){
  vec2 uv = barrel(vUv);
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
  float ca = 0.0035;
  vec3 col;
  col.r = texture2D(uTex, uv + vec2(ca, 0.0)).r;
  col.g = texture2D(uTex, uv).g;
  col.b = texture2D(uTex, uv - vec2(ca, 0.0)).b;
  // horizontal phosphor bleed (cheap bloom)
  vec3 bleed = texture2D(uTex, uv + vec2(0.006, 0.0)).rgb + texture2D(uTex, uv - vec2(0.006, 0.0)).rgb;
  col += bleed * 0.18;
  float scan = 0.62 + 0.38 * pow(abs(sin(uv.y * uLines * 3.14159)), 0.7);
  float grille = 0.88 + 0.12 * sin(gl_FragCoord.x * 2.094);
  col *= scan * grille;
  vec2 c = vUv * 2.0 - 1.0;
  col *= 1.0 - 0.45 * dot(c * vec2(0.9, 0.8), c * vec2(0.9, 0.8));
  // rolling refresh band
  col *= 1.0 + 0.06 * smoothstep(0.0, 0.06, abs(fract(uv.y * 0.6 - uTime * 0.35) - 0.5) - 0.44);
  // power-on: vertical collapse to a bright line, then open
  float open = clamp(uPower * 1.15, 0.0, 1.0);
  float band = smoothstep(0.5 * open + 0.004, 0.5 * open - 0.004, abs(vUv.y - 0.5));
  col = mix(vec3(0.0), col, band);
  col += vec3(0.8, 0.95, 1.0) * (1.0 - smoothstep(0.0, 0.25, uPower)) * smoothstep(0.012, 0.0, abs(vUv.y - 0.5)) * step(0.02, uPower);
  gl_FragColor = vec4(col * uBoost, 1.0);
  #include <colorspace_fragment>
}`;

export const makeCrtMaterial = (tex: THREE.Texture) =>
  new THREE.ShaderMaterial({
    vertexShader: CRT_VERT,
    fragmentShader: CRT_FRAG,
    uniforms: { uTex: { value: tex }, uPower: { value: 1 }, uLines: { value: 128 }, uTime: { value: 0 }, uBoost: { value: 1.25 } },
    toneMapped: false,
  });

/** Soft radial glow sprite for fake bloom halos (additive). */
export const makeGlowTexture = () =>
  canvasTex(256, 256, (ctx) => {
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(255,255,255,0.45)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
  });

/** Original cosmic arcade carpet: neon squiggles, rings and stars on deep indigo. */
export const makeCarpetTexture = () =>
  canvasTex(1024, 1024, (ctx) => {
    const r = rng(66);
    ctx.fillStyle = P.carpet;
    ctx.fillRect(0, 0, 1024, 1024);
    const cols = [P.magenta, P.cyan, P.yellow, P.orange, P.phosphorGreen];
    for (let i = 0; i < 70; i++) {
      ctx.strokeStyle = cols[i % cols.length];
      ctx.lineWidth = 6;
      ctx.globalAlpha = 0.8;
      const x = r() * 1024, y = r() * 1024;
      const kind = r();
      ctx.beginPath();
      if (kind < 0.4) {
        ctx.moveTo(x, y);
        for (let k = 1; k < 6; k++) ctx.lineTo(x + k * 14, y + (k % 2 ? 12 : -12));
      } else if (kind < 0.7) {
        ctx.arc(x, y, 10 + r() * 14, 0, Math.PI * 2);
      } else {
        for (let k = 0; k < 10; k++) {
          const a = (k / 10) * Math.PI * 2;
          const rad = k % 2 ? 6 : 16;
          if (k === 0) ctx.moveTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
          else ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
        }
        ctx.closePath();
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  });

/** Cabinet side art: diagonal speed stripes + planet (original). */
export const makeSideArt = () =>
  canvasTex(512, 1024, (ctx) => {
    ctx.fillStyle = P.cabinet;
    ctx.fillRect(0, 0, 512, 1024);
    const stripes = [P.yellow, P.orange, P.magenta];
    stripes.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(0, 620 + i * 60);
      ctx.lineTo(512, 300 + i * 60);
      ctx.lineTo(512, 340 + i * 60);
      ctx.lineTo(0, 660 + i * 60);
      ctx.fill();
    });
    ctx.fillStyle = P.cyan;
    ctx.beginPath();
    ctx.arc(330, 190, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = P.white;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.ellipse(330, 190, 140, 34, -0.3, 0, Math.PI * 2);
    ctx.stroke();
  });

/** Marquee: back-lit title panel. */
export const makeMarquee = () =>
  canvasTex(1024, 256, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "#2A0F5C");
    g.addColorStop(1, "#0D0626");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1024, 256);
    ctx.font = "italic 900 132px 'Arial Black', Impact, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 16;
    ctx.strokeStyle = P.magenta;
    ctx.strokeText("ORBIT ROVER", 512, 132);
    ctx.fillStyle = P.yellow;
    ctx.fillText("ORBIT ROVER", 512, 132);
    ctx.fillStyle = P.cyan;
    ctx.font = "700 30px 'Courier New', monospace";
    ctx.fillText("1 OR 2 PLAYERS  •  25¢", 512, 225);
  });
