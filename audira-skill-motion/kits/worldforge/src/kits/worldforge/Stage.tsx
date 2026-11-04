// Stage — owns lens, sun and the render loop of a WORLDFORGE film.
//
// One directional sun with a FIXED shadow frustum fitted (in light space) around the area the
// camera explores: the light and the frustum never move, so object shadows cannot swim or
// shimmer from frame to frame. Terrain self-shadowing is baked (see heightfield.ts); the shadow
// map only carries props — rocks, buildings, vehicles, people.
//
// Finishing chain per frame:
//   scene (MSAA, half float) → GTAO contact occlusion → optional bokeh DOF → restrained bloom
//   → tone map (OutputPass) → grade (warm split tone, vignette, fine grain, entry haze).

import React, { useLayoutEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  type Camera,
  Color,
  DirectionalLight,
  FogExp2,
  HalfFloatType,
  Matrix4,
  NeutralToneMapping,
  Object3D,
  PerspectiveCamera,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  type Texture,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import type { Pass } from "three/examples/jsm/postprocessing/Pass.js";

export type V3 = [number, number, number];

/**
 * Render layer for additive / volumetric effects (light shafts, glows, beams). Put such meshes on
 * this layer only (`mesh.layers.set(FX_LAYER)`): the camera renders them, but GTAO and depth of
 * field skip them. Large transparent volumes on the default layer can silently blank the frame.
 */
export const FX_LAYER = 1;
const withoutFx = <P extends Pass>(pass: P, camera: Camera): P => {
  const render = pass.render.bind(pass);
  pass.render = (renderer, writeBuffer, readBuffer, deltaTime, maskActive) => {
    camera.layers.disable(FX_LAYER);
    try {
      render(renderer, writeBuffer, readBuffer, deltaTime, maskActive);
    } finally {
      camera.layers.enable(FX_LAYER);
    }
  };
  return pass;
};

export type Shot = {
  pos: V3;
  target: V3;
  fov: number;
  roll?: number;
  near: number;
  far: number;
  /** Bokeh: focus distance (world units), aperture, max blur. Off when aperture is 0. */
  focus?: number;
  aperture?: number;
  maxBlur?: number;
};

export type Look = {
  /** Unit vector toward the sun; null = no sun (e.g. a space shot lit in-shader). */
  sun: V3 | null;
  sunColor: string;
  sunI: number;
  exposure: number;
  fog: { color: string; density: number } | null;
  background: string;
  environment: Texture | null;
  /** Scales the image light (e.g. a dim reflection environment for a space shot). */
  envIntensity?: number;
  ao: number;
  bloom: number;
  /** Entry haze 0..1 and the flow clock that drives its streaks. */
  haze: number;
  hazeFlow: number;
  hazeColor: string;
  vignette: number;
};

/** World-space box the sun's shadow map must cover. */
export type ShadowBox = { min: V3; max: V3; mapWidth: number; sun: V3 };

// ── Grade ────────────────────────────────────────────────────────────────────

/**
 * Replaces non-finite pixels (NaN/Inf from a faulty custom shader) right after the scene render.
 * Without it, bloom spreads a single NaN pixel across the whole frame and the frame renders blank
 * with no error — found in testing with a custom light-shaft shader.
 */
const NanGuardShader = {
  uniforms: { tDiffuse: { value: null } },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: /* glsl */ `uniform sampler2D tDiffuse; varying vec2 vUv;
    void main(){ vec4 c = texture2D(tDiffuse, vUv);
      if (any(isnan(c)) || any(isinf(c))) c = vec4(0.0, 0.0, 0.0, 1.0);
      gl_FragColor = clamp(c, 0.0, 64.0); }`,
};

const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uVignette: { value: 0.18 },
    uGrain: { value: 0.012 },
    uRes: { value: new Vector2(540, 960) },
    uHaze: { value: 0 },
    uFlow: { value: 0 },
    uHazeColor: { value: new Color("#e5ad86") },
  },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float uTime; uniform float uVignette; uniform float uGrain; uniform vec2 uRes;
    uniform float uHaze; uniform float uFlow; uniform vec3 uHazeColor;
    varying vec2 vUv;
    float hash(vec2 p){ p = fract(p * vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.x + p.y) * p.x); }
    float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
      // warm highlights, a breath of umber in the shadows (never blue-black)
      c.rgb += smoothstep(0.55, 1.0, l) * vec3(0.010, 0.003, -0.008);
      c.rgb += (1.0 - smoothstep(0.0, 0.4, l)) * vec3(0.012, 0.004, -0.002);
      c.rgb = mix(c.rgb, c.rgb * c.rgb * (3.0 - 2.0 * c.rgb), 0.14);
      // entry haze: dust streaks rushing outward from the centre of the frame, then a warm veil
      if (uHaze > 0.0) {
        vec2 p = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
        float r = length(p);
        float a = atan(p.y, p.x);
        float s1 = vnoise(vec2(a * 9.0, log(r + 0.02) * 3.0 - uFlow * 2.6));
        float s2 = vnoise(vec2(a * 23.0 + 4.0, log(r + 0.02) * 6.0 - uFlow * 4.1));
        float streak = smoothstep(0.45, 1.0, s1 * 0.6 + s2 * 0.5) * smoothstep(0.08, 0.6, r);
        float veil = smoothstep(0.0, 1.0, uHaze);
        vec3 hz = uHazeColor * (0.95 + 0.1 * s1 + 0.08 * streak);
        c.rgb = mix(c.rgb, hz, clamp(veil * (0.85 + 0.15 * streak) + streak * uHaze * 0.18 + smoothstep(0.82, 0.97, uHaze) * 0.4, 0.0, 1.0));
      }
      vec2 d = (vUv - 0.5) * vec2(1.0, 1.1);
      c.rgb *= 1.0 - uVignette * smoothstep(0.35, 0.95, length(d));
      float g = hash(vUv * uRes + uTime * 17.0) - 0.5;
      c.rgb += g * uGrain * (0.6 + 0.4 * (1.0 - l));
      gl_FragColor = c;
    }`,
};

// ── Stage ────────────────────────────────────────────────────────────────────

/** One light (and shadow map) per shadow box, kept for the page: switching boxes at a cut never reallocates. */
const lightCache = new Map<ShadowBox | null, { light: DirectionalLight; target: Object3D }>();

export type StageProps = {
  shot: Shot;
  look: Look;
  shadowBox: ShadowBox | null;
  frame: number;
  children: React.ReactNode;
};

export const Stage: React.FC<StageProps> = ({ shot, look, shadowBox, frame, children }) => {
  const { gl, scene, camera, size } = useThree();

  const sun = useMemo(() => {
    const hit = lightCache.get(shadowBox);
    if (hit) return hit;
    const target = new Object3D();
    const light = new DirectionalLight("#fff", 3);
    light.target = target;
    light.castShadow = !!shadowBox;
    if (shadowBox) {
      // Fit an orthographic frustum, in light space, around the box. Fixed for the whole film.
      const L = new Vector3(...shadowBox.sun).normalize();
      const c = new Vector3(...shadowBox.min).add(new Vector3(...shadowBox.max)).multiplyScalar(0.5);
      target.position.copy(c);
      light.position.copy(c).addScaledVector(L, 3000);
      const view = new Matrix4().lookAt(light.position, c, new Vector3(0, 1, 0));
      const inv = new Matrix4().makeTranslation(light.position.x, light.position.y, light.position.z).multiply(view).invert();
      const lo = new Vector3(Infinity, Infinity, Infinity), hi = new Vector3(-Infinity, -Infinity, -Infinity);
      for (let k = 0; k < 8; k++) {
        const p = new Vector3(k & 1 ? shadowBox.max[0] : shadowBox.min[0], k & 2 ? shadowBox.max[1] : shadowBox.min[1], k & 4 ? shadowBox.max[2] : shadowBox.min[2]).applyMatrix4(inv);
        lo.min(p);
        hi.max(p);
      }
      const cam = light.shadow.camera;
      cam.left = lo.x;
      cam.right = hi.x;
      cam.bottom = lo.y;
      cam.top = hi.y;
      cam.near = Math.max(1, -hi.z - 50);
      cam.far = -lo.z + 50;
      cam.updateProjectionMatrix();
      const w = shadowBox.mapWidth;
      const h = Math.min(8192, Math.max(1024, Math.round((w * (hi.y - lo.y)) / (hi.x - lo.x))));
      light.shadow.mapSize.set(w, h);
      light.shadow.bias = -0.0002;
      light.shadow.normalBias = 0.02;
      light.shadow.radius = 1.6;
      light.shadow.autoUpdate = true;
    }
    const out = { light, target };
    lightCache.set(shadowBox, out);
    return out;
  }, [shadowBox]);

  const chain = useMemo(() => {
    const w = size.width, h = size.height;
    const rt = new WebGLRenderTarget(w, h, { type: HalfFloatType, samples: 4 });
    const composer = new EffectComposer(gl, rt);
    composer.setPixelRatio(1);
    composer.setSize(w, h);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new ShaderPass(NanGuardShader));
    const gtao = new GTAOPass(scene, camera, w, h);
    gtao.blendIntensity = 0.8;
    gtao.updateGtaoMaterial({ radius: 1.6, distanceExponent: 1.4, thickness: 1.6, scale: 1.0, samples: 16, distanceFallOff: 1.0, screenSpaceRadius: false });
    gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 5, rings: 2, samples: 16 });
    composer.addPass(withoutFx(gtao, camera));
    const dof = withoutFx(new BokehPass(scene, camera, { focus: 20, aperture: 0.0, maxblur: 0.0 }), camera);
    composer.addPass(dof);
    const bloom = new UnrealBloomPass(new Vector2(w, h), 0.12, 0.55, 0.92);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    const grade = new ShaderPass(GradeShader);
    (grade.uniforms.uRes.value as Vector2).set(w, h);
    composer.addPass(grade);
    return { composer, gtao, dof, bloom, grade };
  }, [gl, scene, camera, size.width, size.height]);

  useLayoutEffect(() => {
    const cam = camera as PerspectiveCamera;
    cam.position.set(...shot.pos);
    const roll = shot.roll ?? 0;
    cam.up.set(Math.sin(roll), Math.cos(roll), 0);
    cam.lookAt(...shot.target);
    cam.fov = shot.fov;
    cam.near = shot.near;
    cam.far = shot.far;
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();
    cam.layers.enable(FX_LAYER);

    gl.toneMapping = NeutralToneMapping;
    gl.toneMappingExposure = look.exposure;
    scene.background = new Color(look.background);
    scene.environment = look.environment;
    scene.environmentIntensity = look.envIntensity ?? 1;
    scene.fog = look.fog ? new FogExp2(look.fog.color, look.fog.density) : null;
    sun.light.visible = !!look.sun;
    // the light may come from another direction in another world (the shadow frustum is
    // only meaningful for the shadow box's own sun, which is where it returns to)
    if (look.sun) sun.light.position.copy(sun.target.position).addScaledVector(new Vector3(...look.sun).normalize(), 3000);
    sun.light.color.set(look.sunColor);
    sun.light.intensity = look.sunI;

    chain.gtao.enabled = look.ao > 0;
    chain.gtao.blendIntensity = look.ao;
    const u = chain.dof.uniforms as unknown as Record<string, { value: number }>;
    const ap = shot.aperture ?? 0;
    chain.dof.enabled = ap > 0 && (shot.maxBlur ?? 0) > 0;
    u.focus.value = shot.focus ?? 20;
    u.aperture.value = ap;
    u.maxblur.value = shot.maxBlur ?? 0;
    chain.bloom.strength = look.bloom;
    const g = chain.grade.uniforms;
    g.uTime.value = frame % 997;
    g.uHaze.value = look.haze;
    g.uFlow.value = look.hazeFlow;
    (g.uHazeColor.value as Color).set(look.hazeColor).convertLinearToSRGB();
    g.uVignette.value = look.vignette;
  }, [shot, look, camera, gl, scene, sun, chain, frame]);

  useFrame(() => {
    chain.composer.render();
  }, 1);

  return (
    <>
      <primitive object={sun.target} />
      <primitive object={sun.light} />
      {children}
    </>
  );
};
