// Ground and prop shading for WORLDFORGE worlds (three.js material patches).
//
// Terrain: MeshStandardMaterial + vertex albedo, with
//   · baked sun visibility on the direct light and baked AO on the ambient (aShade attribute),
//   · two rotated scales of a seeded, tileable detail texture for grain and bump close to the
//     camera (mipmapped + anisotropic, so it never shimmers),
// Props on the ground (rocks, berms) get the same baked sun term per instance, so a boulder in
// a crater's shadow is in shadow too. White architecture gets a red-dust skirt near the ground.

import {
  Color,
  DataTexture,
  LinearMipmapLinearFilter,
  LinearFilter,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  RepeatWrapping,
  RGBAFormat,
  UnsignedByteType,
  type WebGLProgramParametersWithUniforms,
} from "three";
import { hash2, mulberry32 } from "./noise.ts";

// ── Tileable detail texture ─────────────────────────────────────────────────
// R: height (pebbles + periodic noise), G: crack/sand pattern, B: albedo variation.

const periodicNoise = (x: number, y: number, period: number, seed: number) => {
  const xi = Math.floor(x), yi = Math.floor(y);
  const fx = x - xi, fy = y - yi;
  const h = (i: number, j: number) => hash2(((i % period) + period) % period, ((j % period) + period) % period, seed);
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1);
  return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * 2 - 1;
};

let detailTex: DataTexture | null = null;

export const getDetailTexture = (size = 512) => {
  if (detailTex) return detailTex;
  const H = new Float32Array(size * size);
  const A = new Float32Array(size * size);
  const Gc = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let h = 0, a = 0, amp = 1;
      for (let o = 0; o < 5; o++) {
        const p = 4 << o;
        const s = size / p;
        h += amp * periodicNoise(x / s, y / s, p, 11 + o);
        a += amp * periodicNoise(x / s + 0.5, y / s + 0.5, p, 51 + o);
        amp *= 0.55;
      }
      H[y * size + x] = h * 0.35;
      A[y * size + x] = a * 0.3;
      Gc[y * size + x] = Math.abs(periodicNoise(x / (size / 16), y / (size / 16), 16, 91));
    }
  }
  // pebbles: little domes, each with its own albedo, wrapped across the tile edges
  const rnd = mulberry32(0x9eb1e5);
  for (let n = 0; n < 1400; n++) {
    const cx = rnd() * size, cy = rnd() * size;
    const r = 1.2 + Math.pow(rnd(), 2.2) * 7;
    const tone = (rnd() - 0.55) * 0.8;
    const R = Math.ceil(r);
    for (let dy = -R; dy <= R; dy++) {
      for (let dx = -R; dx <= R; dx++) {
        const d = Math.hypot(dx, dy) / r;
        if (d >= 1) continue;
        const px = (((Math.floor(cx) + dx) % size) + size) % size;
        const py = (((Math.floor(cy) + dy) % size) + size) % size;
        const k = py * size + px;
        const dome = Math.sqrt(1 - d * d);
        H[k] = Math.max(H[k], 0.25 + dome * 0.75 * Math.min(1, r / 4));
        A[k] += tone * dome;
      }
    }
  }
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    data[i * 4] = Math.max(0, Math.min(255, Math.round((H[i] * 0.5 + 0.5) * 255)));
    data[i * 4 + 1] = Math.round(Gc[i] * 255);
    data[i * 4 + 2] = Math.max(0, Math.min(255, Math.round((A[i] * 0.5 + 0.5) * 255)));
    data[i * 4 + 3] = 255;
  }
  const t = new DataTexture(data, size, size, RGBAFormat, UnsignedByteType);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.magFilter = LinearFilter;
  t.minFilter = LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = 8;
  t.needsUpdate = true;
  detailTex = t;
  return t;
};

// ── Shader snippets ─────────────────────────────────────────────────────────

const PERTURB = /* glsl */ `
vec3 wfPerturb(vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDir) {
  vec3 sx = normalize(dFdx(surf_pos)); vec3 sy = normalize(dFdy(surf_pos));
  vec3 r1 = cross(sy, surf_norm); vec3 r2 = cross(surf_norm, sx);
  float det = dot(sx, r1) * faceDir;
  vec3 g = sign(det) * (dHdxy.x * r1 + dHdxy.y * r2);
  return normalize(abs(det) * surf_norm - g);
}`;

const DETAIL = /* glsl */ `
uniform sampler2D tDetail;
uniform float uBump;
uniform float uGrain;
varying vec3 vWPos;
const mat2 WF_ROT = mat2(0.8, -0.6, 0.6, 0.8);
`;

export type TerrainUniforms = { tDetail: { value: DataTexture }; uBump: { value: number }; uGrain: { value: number } };

/** Ground material: vertex albedo × detail, baked sun/AO, close-range bump. */
export const makeTerrainMaterial = () => {
  const m = new MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0, envMapIntensity: 1 });
  const uniforms: TerrainUniforms = { tDetail: { value: getDetailTexture() }, uBump: { value: 0.9 }, uGrain: { value: 1 } };
  m.onBeforeCompile = (sh: WebGLProgramParametersWithUniforms) => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nattribute vec2 aShade;\nvarying vec2 vShade;\nvarying vec3 vWPos;")
      .replace("#include <fog_vertex>", "#include <fog_vertex>\nvShade = aShade;\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec2 vShade;\n" + DETAIL + PERTURB)
      .replace(
        "#include <color_fragment>",
        /* glsl */ `#include <color_fragment>
        float wfDist = length(vWPos - cameraPosition);
        float wfNear = 1.0 - smoothstep(30.0, 240.0, wfDist);
        vec2 wfUA = vWPos.xz / 9.0;
        vec2 wfUB = WF_ROT * vWPos.xz / 2.7;
        vec2 wfUC = WF_ROT * WF_ROT * vWPos.xz / 41.0;
        vec4 wfA = texture2D(tDetail, wfUA);
        vec4 wfB = texture2D(tDetail, wfUB);
        vec4 wfC = texture2D(tDetail, wfUC);
        float wfAlb = wfA.b * 0.45 + wfB.b * 0.35 + wfC.b * 0.2;
        diffuseColor.rgb *= 1.0 + (wfAlb - 0.5) * uGrain * (0.55 + 0.35 * wfNear);
        diffuseColor.rgb *= 1.0 - wfB.g * 0.06 * wfNear;`,
      )
      .replace(
        "#include <normal_fragment_maps>",
        /* glsl */ `#include <normal_fragment_maps>
        {
          vec2 dxA = dFdx(wfUA), dyA = dFdy(wfUA), dxB = dFdx(wfUB), dyB = dFdy(wfUB);
          float h0 = wfA.r * 0.55 + wfB.r * 0.45;
          float hx = texture2D(tDetail, wfUA + dxA).r * 0.55 + texture2D(tDetail, wfUB + dxB).r * 0.45;
          float hy = texture2D(tDetail, wfUA + dyA).r * 0.55 + texture2D(tDetail, wfUB + dyB).r * 0.45;
          normal = wfPerturb(-vViewPosition, normal, vec2(hx - h0, hy - h0) * uBump * wfNear, faceDirection);
        }`,
      )
      .replace(
        "#include <lights_fragment_end>",
        /* glsl */ `#include <lights_fragment_end>
        reflectedLight.directDiffuse *= vShade.x;
        reflectedLight.directSpecular *= vShade.x;
        reflectedLight.indirectDiffuse *= vShade.y;`,
      );
  };
  m.customProgramCacheKey = () => "wf-terrain";
  return { material: m, uniforms };
};

/**
 * Rock material: per-instance baked sun (aSun) and a dust coat on upward faces.
 * Instance colour (instanceColor) tints the albedo.
 */
export const makeRockMaterial = () => {
  const m = new MeshStandardMaterial({ color: "#ffffff", roughness: 0.9, metalness: 0, flatShading: false, envMapIntensity: 1 });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uDust = { value: new Color("#c8784a") };
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float aSun;\nvarying float vSun;\nvarying float vUp;")
      .replace(
        "#include <fog_vertex>",
        "#include <fog_vertex>\nvSun = aSun;\nvUp = normalize((modelMatrix * instanceMatrix * vec4(objectNormal, 0.0)).xyz).y;",
      );
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform vec3 uDust;\nvarying float vSun;\nvarying float vUp;")
      .replace("#include <color_fragment>", "#include <color_fragment>\ndiffuseColor.rgb = mix(diffuseColor.rgb, uDust, smoothstep(0.55, 0.92, vUp) * 0.55);")
      .replace(
        "#include <lights_fragment_end>",
        "#include <lights_fragment_end>\nreflectedLight.directDiffuse *= vSun;\nreflectedLight.directSpecular *= vSun;",
      );
  };
  m.customProgramCacheKey = () => "wf-rock";
  return m;
};

/** Adds a red-dust skirt (rising from world height `ground`) to any standard/physical material. */
export const dustSkirt = <M extends MeshStandardMaterial | MeshPhysicalMaterial>(m: M, ground: number, height = 1.7, amount = 0.6) => {
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uSkirt = { value: new Color("#b8643a") };
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWPosD;")
      .replace("#include <fog_vertex>", "#include <fog_vertex>\nvWPosD = (modelMatrix * vec4(transformed, 1.0)).xyz;\n#ifdef USE_INSTANCING\nvWPosD = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;\n#endif");
    sh.fragmentShader = sh.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>\nuniform vec3 uSkirt;\nvarying vec3 vWPosD;\nfloat wfH(vec2 p){ p = fract(p * vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.x + p.y) * p.x); }`,
      )
      .replace(
        "#include <color_fragment>",
        /* glsl */ `#include <color_fragment>
        {
          vec2 q = vWPosD.xz * 1.7 + vWPosD.y * 0.6;
          vec2 i = floor(q); vec2 f = fract(q); f = f * f * (3.0 - 2.0 * f);
          float n = mix(mix(wfH(i), wfH(i + vec2(1, 0)), f.x), mix(wfH(i + vec2(0, 1)), wfH(i + vec2(1, 1)), f.x), f.y);
          float dust = 1.0 - smoothstep(${ground.toFixed(3)}, ${(ground + height).toFixed(3)} + n * 0.5, vWPosD.y);
          diffuseColor.rgb = mix(diffuseColor.rgb, uSkirt, dust * ${amount.toFixed(3)} * (0.65 + 0.35 * n));
        }`,
      );
  };
  m.customProgramCacheKey = () => `wf-skirt-${ground.toFixed(2)}-${height}-${amount}`;
  return m;
};
