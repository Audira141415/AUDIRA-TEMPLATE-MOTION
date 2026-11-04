// Material system. Every construction material is a MeshStandardMaterial extended with three
// state channels, all driven from the timeline:
//   wet    — fresh concrete reads darker and glossier, then cures;
//   coat   — a finish coat exists only below a rising front (fragments above are discarded);
//   finish — a shared world-space sweep turns raw surfaces into their finish material behind
//            a travelling front (a change of surface, never a crossfade).

import { Color, MeshPhysicalMaterial, MeshStandardMaterial, Vector3, type Material } from "three";
import { texture } from "./textures.ts";

export type Look = {
  color: string;
  roughness: number;
  metalness?: number;
  tex?: "concrete" | "wood" | "gravel";
  /** Metres per texture tile (metric UVs); 1 for instanced pieces (unit UVs). */
  tile?: number;
  vertexColors?: boolean;
  env?: number;
  /** Foliage: leaf-clump shading (noise-perturbed normals and tone) instead of smooth blobs. */
  leaf?: boolean;
  /** Light fitting: emissive colour, switched on through `lamps`. */
  emissive?: string;
};

export type Sweep = { front: { value: number }; dir: { value: Vector3 }; soft: { value: number } };
export const makeSweep = (dir: [number, number, number], soft: number): Sweep => ({
  front: { value: -1e5 },
  dir: { value: new Vector3(...dir).normalize() },
  soft: { value: soft },
});

export type BuildUniforms = {
  uWet: { value: number };
  uCoat: { value: number };
  uFinColor: { value: Color };
  uFinRough: { value: number };
  uFinOn: { value: number };
  uFront: { value: number };
  uDir: { value: Vector3 };
  uSoft: { value: number };
};

const VERT_HEAD = /* glsl */ `
varying vec3 vBfWorld;
#ifdef BF_IALPHA
attribute float aAlpha;
varying float vBfAlpha;
#endif
#ifdef BF_FADE
varying float vBfFade;
#endif
`;
const VERT_BODY = /* glsl */ `
#include <project_vertex>
{
  vec4 bfp = vec4(transformed, 1.0);
  #ifdef USE_INSTANCING
  bfp = instanceMatrix * bfp;
  #endif
  vBfWorld = (modelMatrix * bfp).xyz;
}
#ifdef BF_IALPHA
vBfAlpha = aAlpha;
#endif
#ifdef BF_FADE
vBfFade = position.y + 0.5;
#endif
`;
const FRAG_HEAD = /* glsl */ `
uniform float uWet; uniform float uCoat; uniform vec3 uFinColor; uniform float uFinRough; uniform float uFinOn;
uniform float uFront; uniform vec3 uDir; uniform float uSoft;
varying vec3 vBfWorld;
#ifdef BF_IALPHA
varying float vBfAlpha;
#endif
#ifdef BF_FADE
varying float vBfFade;
#endif
#ifdef BF_LEAF
float bfh(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float bfn(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(bfh(i), bfh(i + vec3(1.0, 0.0, 0.0)), f.x), mix(bfh(i + vec3(0.0, 1.0, 0.0)), bfh(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
             mix(mix(bfh(i + vec3(0.0, 0.0, 1.0)), bfh(i + vec3(1.0, 0.0, 1.0)), f.x), mix(bfh(i + vec3(0.0, 1.0, 1.0)), bfh(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
}
#endif
`;
const FRAG_CLIP = /* glsl */ `
#include <clipping_planes_fragment>
if (vBfWorld.y > uCoat) discard;
`;
const FRAG_COLOR = /* glsl */ `
#include <map_fragment>
float bfFin = uFinOn * (1.0 - smoothstep(uFront - uSoft, uFront + uSoft, dot(vBfWorld, uDir)));
diffuseColor.rgb = mix(diffuseColor.rgb, uFinColor, bfFin);
diffuseColor.rgb *= mix(1.0, 0.62, uWet);
// the freshest band of a coat, just under its front, is still damp
diffuseColor.rgb *= 1.0 - 0.12 * (1.0 - smoothstep(0.0, 0.45, uCoat - vBfWorld.y));
#ifdef BF_IALPHA
diffuseColor.a *= vBfAlpha;
#endif
#ifdef BF_FADE
// crane cable dissolves upward: the crane itself stays out of the story
diffuseColor.a *= 1.0 - smoothstep(0.004, 0.045, vBfFade);
#endif
#ifdef BF_LEAF
diffuseColor.rgb *= 0.78 + 0.42 * bfn(vBfWorld * 4.5) * (0.6 + 0.4 * bfn(vBfWorld * 13.0));
#endif
`;
const FRAG_NORMAL = /* glsl */ `
#include <normal_fragment_maps>
#ifdef BF_LEAF
{
  vec3 q = vBfWorld * 6.5;
  vec3 g = vec3(bfn(q), bfn(q + 17.3), bfn(q + 41.9)) - 0.5;
  normal = normalize(normal + (viewMatrix * vec4(g, 0.0)).xyz * 1.3);
}
#endif
`;
const FRAG_ROUGH = /* glsl */ `
#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, uFinRough, bfFin);
roughnessFactor = mix(roughnessFactor, 0.2, uWet);
`;

export type MakeOpts = { finish?: { material: string; sweep: string }; pieces?: boolean; fade?: boolean };

export const createLibrary = (looks: Record<string, Look>, sweeps: Record<string, Sweep>) => {
  /** Every light-fitting material made, so the film can switch them on together. */
  const lamps: MeshStandardMaterial[] = [];
  const glass = () =>
    new MeshPhysicalMaterial({
      color: new Color("#a9c3cb"),
      metalness: 0.05,
      roughness: 0.035,
      transparent: true,
      opacity: 0.42,
      envMapIntensity: 2.2,
      ior: 1.5,
      specularIntensity: 1,
      depthWrite: false,
    });

  const make = (id: string, o: MakeOpts = {}): Material => {
    if (id === "glass") return glass();
    const look = looks[id];
    if (!look) throw new Error(`BUILDFORGE: unknown material "${id}"`);
    const m = new MeshStandardMaterial({
      color: new Color(look.color),
      roughness: look.roughness,
      metalness: look.metalness ?? 0,
      map: look.tex ? texture(look.tex, look.tile ?? 1) : null,
      vertexColors: look.vertexColors ?? false,
      envMapIntensity: look.env ?? 1,
    });
    if (look.emissive) {
      m.emissive = new Color(look.emissive);
      m.emissiveIntensity = 0;
      lamps.push(m);
    }
    const fin = o.finish ? looks[o.finish.material] : undefined;
    const sw = o.finish ? sweeps[o.finish.sweep] : undefined;
    if (o.finish && (!fin || !sw)) throw new Error(`BUILDFORGE: bad finish ${JSON.stringify(o.finish)}`);
    const u: BuildUniforms = {
      uWet: { value: 0 },
      uCoat: { value: 1e5 },
      uFinColor: { value: new Color(fin?.color ?? "#ffffff") },
      uFinRough: { value: fin?.roughness ?? 1 },
      uFinOn: { value: fin ? 1 : 0 },
      uFront: sw?.front ?? { value: -1e5 },
      uDir: sw?.dir ?? { value: new Vector3(0, 1, 0) },
      uSoft: sw?.soft ?? { value: 1 },
    };
    m.defines = {};
    if (o.pieces) m.defines.BF_IALPHA = "";
    if (o.fade) m.defines.BF_FADE = "";
    if (look.leaf) m.defines.BF_LEAF = "";
    m.onBeforeCompile = (s) => {
      Object.assign(s.uniforms, u);
      s.vertexShader = s.vertexShader.replace("#include <common>", `#include <common>\n${VERT_HEAD}`).replace("#include <project_vertex>", VERT_BODY);
      s.fragmentShader = s.fragmentShader
        .replace("#include <common>", `#include <common>\n${FRAG_HEAD}`)
        .replace("#include <clipping_planes_fragment>", FRAG_CLIP)
        .replace("#include <map_fragment>", FRAG_COLOR)
        .replace("#include <normal_fragment_maps>", FRAG_NORMAL)
        .replace("#include <roughnessmap_fragment>", FRAG_ROUGH);
    };
    m.customProgramCacheKey = () => `bf-${Object.keys(m.defines ?? {}).join("-")}`;
    m.userData.bf = u;
    return m;
  };
  const setLamps = (on: number) => lamps.forEach((m) => (m.emissiveIntensity = on * 6));
  return { make, looks, sweeps, setLamps };
};

export type Library = ReturnType<typeof createLibrary>;
