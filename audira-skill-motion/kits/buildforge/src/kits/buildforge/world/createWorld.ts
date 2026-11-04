// Generic BUILDFORGE world: sky, sun with soft shadows, graded terrain, the structure's components on
// their construction timeline, and existing trees around the site. Built once; `update(c, look)` poses
// the build for construction-clock value `c` and sets the light of the moment.
//
// A film supplies its own components, phase windows, site spec and terrain/finish timing; everything
// else (looks, sky, ground, foliage palettes) defaults to the daylight preset.

import { Color, DirectionalLight, Fog, Group, HemisphereLight, Mesh, Vector3, type Material, type Scene, type ShaderMaterial, type WebGLRenderer } from "three";
import { schedule, type PhaseWindow, type Timeline } from "../assembly/schedule.ts";
import { createSky, skyEnvironment, type SkyLook } from "../environment/Sky.ts";
import { Terrain, type GroundLook, type SiteSpec, type TerrainState } from "../environment/Terrain.ts";
import { roundTree, shrub, type Palette } from "../environment/Vegetation.ts";
import { rng } from "../geometry/noise.ts";
import { createLibrary, makeSweep, type Library, type Look, type Sweep } from "../materials/library.ts";
import { Site } from "../render/Site.ts";
import type { Component, SubMesh } from "../types.ts";
import { FOG, GROUND, LEAF, LOOKS, SKY } from "../presets/daylight.ts";

export type WorldLook = {
  /** Sun azimuth (0 = front/+z, positive toward +x) and elevation, degrees. */
  sunAz: number;
  sunEl: number;
  /** 0 = neutral daylight, 1 = warm late-afternoon light. */
  warmth: number;
  cloudShift: number;
  /** Light fittings (materials with `emissive` in their look), 0..1. */
  lamps: number;
  /** Blueprint ghosts of every component not yet installed, 0..1. */
  blueprint: number;
};

export const sunLook = (dir: [number, number, number], over: Partial<WorldLook> = {}): WorldLook => {
  const v = new Vector3(...dir).normalize();
  return {
    sunAz: (Math.atan2(v.x, v.z) * 180) / Math.PI,
    sunEl: (Math.asin(v.y) * 180) / Math.PI,
    warmth: 0,
    cloudShift: 0,
    lamps: 0,
    blueprint: 0,
    ...over,
  };
};

export type WorldSpec = {
  /** Every component of the structure (and plantings), and the phase windows on the construction clock. */
  components: Component[];
  windows: PhaseWindow[];
  site: SiteSpec;
  /** Ground operations over the construction clock (contours, grading, excavation, backfill, lawn). */
  terrainAt: (c: number) => TerrainState;
  /** Finish sweeps: id → direction/softness, and the front's position over the clock. */
  sweeps?: Record<string, { dir: [number, number, number]; soft: number; front: (c: number) => number }>;
  looks?: Record<string, Look>;
  sky?: SkyLook;
  fog?: string;
  ground?: GroundLook;
  /** Existing trees: [x, z, height]. Those within `shadowRadius` of the origin cast shadows. */
  trees?: [number, number, number][];
  treeLeaf?: Palette;
  /** Extra distant trees scattered on a ring (count, inner radius, outer radius). */
  scatter?: [number, number, number];
  /** Sun direction used for the sky's environment lighting; half-size of the shadow frustum. */
  sunDir?: [number, number, number];
  shadowSize?: number;
  shadowRadius?: number;
};

export type World = {
  root: Group;
  components: Component[];
  timeline: Timeline;
  lib: Library;
  terrain: Terrain;
  update: (c: number, look: WorldLook) => void;
};

const D = Math.PI / 180;

export const createWorld = (gl: WebGLRenderer, scene: Scene, spec: WorldSpec): World => {
  const looks = spec.looks ?? LOOKS;
  const skyLook = spec.sky ?? SKY;
  const sunDir = new Vector3(...(spec.sunDir ?? [-0.55, 0.62, 0.56])).normalize();
  const root = new Group();
  scene.fog = new Fog(new Color(spec.fog ?? FOG), 110, 1300);
  scene.environment = skyEnvironment(gl, skyLook, sunDir);
  scene.environmentIntensity = 0.42;
  const sky = createSky(skyLook, sunDir);
  root.add(sky);
  const skyU = (sky.material as ShaderMaterial).uniforms;

  const DAY = new Color("#ffeed6"), WARM = new Color("#ffd8a4");
  const sun = new DirectionalLight(DAY.clone(), 3.1);
  const s = spec.shadowSize ?? 24;
  const aim = new Vector3(0, 0, 0);
  sun.position.copy(aim).addScaledVector(sunDir, 100);
  sun.target.position.copy(aim);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 30, far: 190 });
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -0.0002;
  sun.shadow.normalBias = 0.03;
  sun.shadow.radius = 2.5;
  root.add(sun, sun.target, new HemisphereLight(new Color("#d4e4f3"), new Color("#d6caae"), 0.36));

  const terrain = new Terrain(spec.site, spec.ground ?? GROUND);
  root.add(terrain.mesh);

  const sweepDefs = spec.sweeps ?? {};
  const sweeps: Record<string, Sweep> = Object.fromEntries(Object.entries(sweepDefs).map(([id, d]) => [id, makeSweep(d.dir, d.soft)]));
  const lib = createLibrary(looks, sweeps);
  const components = spec.components;
  const timeline = schedule(components, spec.windows);
  const site = new Site(components, timeline, lib);
  root.add(site.group);

  // existing trees: a few shared variants, scaled and turned
  const leaf = spec.treeLeaf ?? LEAF.wild;
  const mats: Record<string, Material> = { bark: lib.make("bark"), foliage: lib.make("foliage") };
  const variants = [3, 7, 11, 17, 23].map((seed) => roundTree(10, seed, leaf, 1.25));
  const ground0 = spec.terrainAt(0);
  const placeTree = (subs: SubMesh[], x: number, z: number, h: number, yaw: number, cast: boolean) => {
    const y = terrain.height(x, z, ground0) - 0.1;
    for (const sm of subs) {
      const m = new Mesh(sm.geom, mats[sm.material ?? "foliage"]);
      m.position.set(x, y, z);
      m.scale.setScalar(h / 10);
      m.rotation.y = yaw;
      m.castShadow = cast;
      m.receiveShadow = true;
      root.add(m);
    }
  };
  const r = rng(77);
  const near = spec.shadowRadius ?? 45;
  (spec.trees ?? []).forEach(([x, z, h], i) => placeTree(variants[i % variants.length], x, z, h, r() * 6.28, Math.hypot(x, z) < near));
  const [count, r0, r1] = spec.scatter ?? [30, 80, 260];
  for (let i = 0; i < count; i++) {
    const a = r() * Math.PI * 2, d = r0 + r() * (r1 - r0);
    placeTree(variants[i % variants.length], Math.cos(a) * d, Math.sin(a) * d, 7 + r() * 6, r() * 6.28, false);
  }
  // low meadow scrub outside the site, for scale
  const scrub = [41, 42, 43].map((seed) => shrub(0.7, seed, leaf, 4));
  const a = spec.site.site;
  for (let i = 0; i < 26; i++) {
    const ang = r() * Math.PI * 2, d = 22 + r() * 60;
    const x = Math.cos(ang) * d, z = Math.sin(ang) * d;
    if (x > a.x0 - 3 && x < a.x1 + 3 && z > a.z0 - 3 && z < a.z1 + 3) continue;
    placeTree(scrub[i % 3], x, z, 10 * (0.6 + r() * 0.8), r() * 6.28, d < near);
  }

  const dir = new Vector3();
  return {
    root,
    components,
    timeline,
    lib,
    terrain,
    update(c: number, look: WorldLook) {
      terrain.update(spec.terrainAt(c));
      for (const [id, d] of Object.entries(sweepDefs)) sweeps[id].front.value = d.front(c);
      site.update(c, look.blueprint);
      lib.setLamps(look.lamps);
      const az = look.sunAz * D, el = look.sunEl * D;
      dir.set(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az));
      sun.position.copy(aim).addScaledVector(dir, 100);
      sun.color.copy(DAY).lerp(WARM, look.warmth);
      skyU.uSunDir.value.copy(dir);
      skyU.uShift.value.set(look.cloudShift, look.cloudShift * 0.35);
    },
  };
};
