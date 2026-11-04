// The ground as a construction surface. Natural relief (contours, distant hills) → site
// grading → excavation advancing behind a digging front → backfill → lawn spreading out from
// the building. One height/colour field, evaluated on a grid that is fine on the site and has
// grid lines on every cut edge so excavation walls are crisp.

import { BufferAttribute, BufferGeometry, Color, Mesh, MeshStandardMaterial } from "three";
import { fbm2 } from "../geometry/noise.ts";
import { clamp, smoothstep } from "../motion/easing.ts";

export type Area = { x0: number; x1: number; z0: number; z1: number };

export type SiteSpec = {
  /** Area levelled before construction. */
  site: Area;
  /** Excavation and its depth. */
  pit: Area;
  depth: number;
  /** Footprint that stays excavated under the slab after backfill. */
  slab: Area;
  /** Planting beds (dark soil) and the decorative gravel strip around the building. */
  beds: Area[];
  gravelBand: number;
};

export type TerrainState = { contour: number; grade: number; dig: number; backfill: number; lawn: number };

export type GroundLook = { meadow: string; meadowDry: string; soil: string; dug: string; lawn: string; lawnDeep: string; gravel: string; bed: string };

const edge = (x: number, z: number, a: Area) => Math.min(x - a.x0, a.x1 - x, z - a.z0, a.z1 - z);
const inside = (x: number, z: number, a: Area) => edge(x, z, a) >= 0;
/** Distance from a point outside a rectangle to it (0 inside). */
const outDist = (x: number, z: number, a: Area) => Math.hypot(Math.max(a.x0 - x, 0, x - a.x1), Math.max(a.z0 - z, 0, z - a.z1));

export const naturalHeight = (x: number, z: number) => {
  const r = Math.hypot(x, z);
  let h = 0.55 * fbm2(x * 0.03 + 3.1, z * 0.03 - 2.2, 3) + 0.2 * fbm2(x * 0.11, z * 0.11, 2);
  h += 3.2 * smoothstep((r - 30) / 90) * fbm2(x * 0.014 + 1.7, z * 0.014 + 4.2, 3);
  h += 34 * smoothstep((r - 140) / 260) * (0.5 + fbm2(x * 0.0045 + 7, z * 0.0045 + 1, 3));
  return h;
};
const H0 = naturalHeight(0, 0);

const axis = (inner: number, step: number, outer: number, extra: number[]) => {
  const v: number[] = [];
  for (let x = -inner; x <= inner + 1e-6; x += step) v.push(x);
  for (let s = step, x = inner; x < outer; ) {
    s *= 1.14;
    x += s;
    v.push(x, -x);
  }
  v.push(...extra);
  v.sort((a, b) => a - b);
  return v.filter((x, i) => i === 0 || x - v[i - 1] > 0.004);
};

export class Terrain {
  readonly mesh: Mesh;
  private xs: number[];
  private zs: number[];
  private col: Float32Array;
  private pos: Float32Array;
  private key = "";
  private look: Record<keyof GroundLook, Color>;
  /** Cached per-vertex natural height and colour noise (they never change). */
  private nat: Float32Array;
  private nv: Float32Array;
  private nv2: Float32Array;

  private spec: SiteSpec;

  constructor(spec: SiteSpec, look: GroundLook, inner = 30, outer = 900) {
    this.spec = spec;
    const cuts = (a: Area, k: "x" | "z") => (k === "x" ? [a.x0, a.x1] : [a.z0, a.z1]).flatMap((v) => [v - 0.025, v, v + 0.025]);
    const areas = [spec.pit, spec.slab, ...spec.beds, { x0: spec.slab.x0 - spec.gravelBand, x1: spec.slab.x1 + spec.gravelBand, z0: spec.slab.z0 - spec.gravelBand, z1: spec.slab.z1 + spec.gravelBand }];
    this.xs = axis(inner, 0.3, outer, areas.flatMap((a) => cuts(a, "x")));
    this.zs = axis(inner, 0.3, outer, areas.flatMap((a) => cuts(a, "z")));
    const nx = this.xs.length, nz = this.zs.length;
    this.pos = new Float32Array(nx * nz * 3);
    this.col = new Float32Array(nx * nz * 3);
    this.nat = new Float32Array(nx * nz);
    this.nv = new Float32Array(nx * nz);
    this.nv2 = new Float32Array(nx * nz);
    this.zs.forEach((z, j) =>
      this.xs.forEach((x, i) => {
        this.nat[j * nx + i] = naturalHeight(x, z) - H0;
        this.nv[j * nx + i] = fbm2(x * 0.35, z * 0.35, 2);
        this.nv2[j * nx + i] = fbm2(x * 0.06 + 9, z * 0.06, 2);
      }),
    );
    const idx = new Uint32Array((nx - 1) * (nz - 1) * 6);
    let k = 0;
    for (let j = 0; j < nz - 1; j++)
      for (let i = 0; i < nx - 1; i++) {
        const a = j * nx + i, b = a + 1, c = a + nx, d = c + 1;
        idx.set([a, c, b, b, c, d], k);
        k += 6;
      }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(this.pos, 3));
    g.setAttribute("color", new BufferAttribute(this.col, 3));
    g.setIndex(new BufferAttribute(idx, 1));
    this.look = Object.fromEntries(Object.entries(look).map(([k2, v]) => [k2, new Color(v)])) as Record<keyof GroundLook, Color>;
    const mat = new MeshStandardMaterial({ vertexColors: true, roughness: 0.97, metalness: 0 });
    const contour = { value: 0 };
    mat.onBeforeCompile = (s) => {
      s.uniforms.uContour = contour;
      s.vertexShader = s.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vTw;")
        .replace("#include <project_vertex>", "#include <project_vertex>\nvTw = (modelMatrix * vec4(transformed, 1.0)).xyz;");
      s.fragmentShader = s.fragmentShader.replace("#include <common>", /* glsl */ `#include <common>
        varying vec3 vTw; uniform float uContour;
        float th(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float tn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(th(i), th(i + vec2(1.0, 0.0)), f.x), mix(th(i + vec2(0.0, 1.0)), th(i + vec2(1.0, 1.0)), f.x), f.y); }`).replace(
        "#include <color_fragment>",
        /* glsl */ `#include <color_fragment>
        {
          // fine ground texture (grass tufts, soil grain) below the vertex-colour resolution
          float fine = tn(vTw.xz * 2.7) * 0.55 + tn(vTw.xz * 9.0) * 0.3 + tn(vTw.xz * 31.0) * 0.15;
          diffuseColor.rgb *= 0.9 + 0.2 * fine;
        }
        {
          // survey contours every 0.25 m (every metre stronger), only near the site
          float hh = (vTw.y - 0.125) / 0.25;
          float w = max(fwidth(hh), 1e-4);
          float minor = 1.0 - min(abs(fract(hh - 0.5) - 0.5) / (w * 1.1), 1.0);
          float hm = (vTw.y - 0.125) / 1.0;
          float wm = max(fwidth(hm), 1e-4);
          float major = 1.0 - min(abs(fract(hm - 0.5) - 0.5) / (wm * 1.6), 1.0);
          float near = 1.0 - smoothstep(35.0, 110.0, length(vTw.xz));
          float l = max(minor * 0.6, major) * near * uContour;
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.96, 1.0, 0.97), l * 0.85);
        }`,
      );
    };
    mat.userData.contour = contour;
    this.mesh = new Mesh(g, mat);
    this.mesh.receiveShadow = true;
    this.mesh.frustumCulled = false;
  }

  /** Height of the ground for a given construction state. */
  height(x: number, z: number, st: TerrainState, n = naturalHeight(x, z) - H0) {
    const sp = this.spec;
    const graded = this.graded(x, z, st.grade);
    let h = n * (1 - graded);
    if (inside(x, z, sp.pit)) {
      const front = sp.pit.x0 - 0.6 + (sp.pit.x1 - sp.pit.x0 + 1.2) * st.dig;
      let d = sp.depth * clamp((front - x) / 0.6);
      if (!inside(x, z, sp.slab)) d *= 1 - st.backfill;
      h -= d;
    }
    return h;
  }

  private graded(x: number, z: number, grade: number) {
    const s = this.spec.site;
    const mask = smoothstep((edge(x, z, s) + 5) / 5);
    const w = s.x1 - s.x0 + 22;
    const local = clamp((grade * (w + 9) - (x - s.x0 + 11)) / 9);
    return mask * local;
  }

  update(st: TerrainState) {
    (this.mesh.material as MeshStandardMaterial).userData.contour.value = st.contour;
    const key = [st.grade, st.dig, st.backfill, st.lawn].map((v) => v.toFixed(4)).join("|");
    if (key === this.key) return;
    this.key = key;
    const sp = this.spec, L = this.look, nx = this.xs.length;
    const c = new Color();
    const band = { x0: sp.slab.x0 - sp.gravelBand, x1: sp.slab.x1 + sp.gravelBand, z0: sp.slab.z0 - sp.gravelBand, z1: sp.slab.z1 + sp.gravelBand };
    this.zs.forEach((z, j) =>
      this.xs.forEach((x, i) => {
        const vi = j * nx + i, k = vi * 3;
        const h = this.height(x, z, st, this.nat[vi]);
        this.pos[k] = x;
        this.pos[k + 1] = h;
        this.pos[k + 2] = z;
        const v = this.nv[vi], v2 = this.nv2[vi];
        c.copy(L.meadow).lerp(L.meadowDry, clamp(0.5 + v2 * 1.6)).multiplyScalar(0.94 + v * 0.22);
        const cleared = smoothstep(this.graded(x, z, Math.min(1, st.grade * 1.15)) * 1.4);
        c.lerp(L.soil.clone().multiplyScalar(0.9 + v * 0.35 + v2 * 0.1), cleared * 0.92);
        if (inside(x, z, sp.pit)) {
          c.lerp(L.dug, smoothstep(clamp(-h / sp.depth) * 3));
        }
        if (st.lawn > 0) {
          const site = smoothstep((edge(x, z, sp.site) + 5) / 5);
          const dist = outDist(x, z, sp.slab);
          const reach = smoothstep(clamp((st.lawn * 34 - dist) / 3));
          if (inside(x, z, band)) c.lerp(L.gravel, reach);
          else if (sp.beds.some((b) => inside(x, z, b))) c.lerp(L.bed, reach);
          else {
            // mown lawn: soft alternating stripes along the facade, plus natural patchiness
            const stripe = smoothstep((Math.sin((x * Math.PI) / 1.4) + 0.3) / 0.6);
            const lawn = L.lawn.clone().lerp(L.lawnDeep, clamp(0.5 + v * 2.2)).multiplyScalar(0.95 + v2 * 0.12 + stripe * 0.05);
            // outside the site the lawn feathers into the meadow
            c.lerp(lawn, reach * site);
          }
        }
        this.col[k] = c.r;
        this.col[k + 1] = c.g;
        this.col[k + 2] = c.b;
      }),
    );
    const g = this.mesh.geometry;
    g.attributes.position.needsUpdate = true;
    g.attributes.color.needsUpdate = true;
    g.computeVertexNormals();
  }
}
