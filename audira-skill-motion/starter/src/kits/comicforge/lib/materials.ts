import * as THREE from "three";
import { COMIC_PALETTE } from "./palette";

// Cel-shaded halftone material: three hard tone bands driven by one key-light direction.
// The middle band is printed as screen-space Ben-Day dots of the shade colour, the dark band
// is solid shade, and a hard toon highlight sits on top. Instancing-aware.
const HALFTONE_VERT = /* glsl */ `
varying vec3 vN;
varying vec3 vW;
void main(){
  #ifdef USE_INSTANCING
    mat4 m = modelMatrix * instanceMatrix;
  #else
    mat4 m = modelMatrix;
  #endif
  vec4 wp = m * vec4(position, 1.0);
  vW = wp.xyz;
  vN = normalize(mat3(m) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const HALFTONE_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uShade;
uniform vec3 uLight;
uniform float uDot;
uniform float uSpec;
varying vec3 vN;
varying vec3 vW;
float dots(float cov){
  vec2 p = gl_FragCoord.xy / uDot;
  p = mat2(0.7071, -0.7071, 0.7071, 0.7071) * p;
  vec2 g = fract(p) - 0.5;
  float r = sqrt(cov) * 0.62;
  return 1.0 - smoothstep(r - 0.07, r + 0.07, length(g));
}
void main(){
  vec3 n = normalize(vN);
  if (!gl_FrontFacing) n = -n;
  float ndl = dot(n, normalize(uLight));
  float lit = smoothstep(0.28, 0.32, ndl);
  float mid = smoothstep(-0.22, -0.18, ndl);
  vec3 col = mix(uShade, uColor, lit);
  float d = dots(0.42);
  vec3 midCol = mix(uColor, uShade, d);
  col = lit > 0.5 ? uColor : (mid > 0.5 ? midCol : mix(uShade, uShade * 0.72, dots(0.35)));
  vec3 v = normalize(cameraPosition - vW);
  vec3 h = normalize(normalize(uLight) + v);
  float sp = step(0.965, dot(n, h)) * uSpec;
  col = mix(col, vec3(1.0), sp);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

export const KEY_LIGHT = new THREE.Vector3(0.55, 0.75, 0.45).normalize();

export const makeHalftoneMaterial = (color: string, shade: string, dotPx: number, spec = 0) =>
  new THREE.ShaderMaterial({
    vertexShader: HALFTONE_VERT,
    fragmentShader: HALFTONE_FRAG,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uShade: { value: new THREE.Color(shade) },
      uLight: { value: KEY_LIGHT.clone() },
      uDot: { value: dotPx },
      uSpec: { value: spec },
    },
    side: THREE.DoubleSide,
  });

// Inverted-hull ink outline: back faces pushed out along the normal, flat black.
const OUTLINE_VERT = /* glsl */ `
uniform float uThick;
void main(){
  vec3 p = position + normal * uThick;
  #ifdef USE_INSTANCING
    vec4 wp = modelMatrix * instanceMatrix * vec4(p, 1.0);
  #else
    vec4 wp = modelMatrix * vec4(p, 1.0);
  #endif
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

export const makeOutlineMaterial = (thick: number) =>
  new THREE.ShaderMaterial({
    vertexShader: OUTLINE_VERT,
    fragmentShader: `uniform vec3 uInk; void main(){ gl_FragColor = vec4(uInk, 1.0); 
#include <colorspace_fragment>
}`,
    uniforms: { uThick: { value: thick }, uInk: { value: new THREE.Color(COMIC_PALETTE.ink) } },
    side: THREE.BackSide,
  });

/** Canvas helper: comic lettering on a transparent texture. */
export const makeCanvasTexture = (w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  draw(ctx);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
};

/** Ben-Day dot field (used on sky, page panels). */
export const drawDotField = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bg: string,
  dot: string,
  cell: number,
  cov: (u: number, v: number) => number,
) => {
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = dot;
  for (let j = 0; j < h / cell + 1; j++) {
    for (let i = 0; i < w / cell + 1; i++) {
      const px = x + i * cell + (j % 2 ? cell / 2 : 0);
      const py = y + j * cell;
      if (px > x + w || py > y + h) continue;
      const r = (cell * 0.5) * Math.sqrt(Math.max(0, Math.min(1, cov((px - x) / w, (py - y) / h))));
      if (r < 0.4) continue;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};
