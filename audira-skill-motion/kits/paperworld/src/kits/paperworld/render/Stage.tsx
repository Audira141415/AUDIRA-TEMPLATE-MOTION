// Stage — owns light, lens and the render loop for a PAPERWORLD film.
//
// Each frame:
//   1. If a door is open onto another world, render that world from a "virtual camera"
//      (the main camera carried through the door's rigid transform) into a texture, lit by
//      the destination world's light, clipped at the destination doorway.
//   2. Render the main world through the finishing chain:
//      scene (MSAA) → GTAO contact shadows → sanitize → bokeh depth of field → soft bloom → tone map → grade.
// The doorway surface samples step 1 in screen space, so the view through a door has true
// perspective and parallax, and the camera can fly through it without a cut.

import React, { useLayoutEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Fog,
  HalfFloatType,
  HemisphereLight,
  Matrix4,
  Mesh,
  NeutralToneMapping,
  Object3D,
  PerspectiveCamera,
  Plane,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  type Scene,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { flat, type ShapeSpec } from "../geometry/shapes.ts";
import type { V3 } from "../components/Paper.tsx";

// ── Types ────────────────────────────────────────────────────────────────────

export type Shot = {
  pos: V3;
  target: V3;
  fov: number;
  roll?: number;
  /** Focus distance (world units) and bokeh settings. */
  focus: number;
  aperture: number;
  maxBlur: number;
};

/** A world's light: warm key with soft shadows, cool fill, hemispheric bounce, paper sky. */
export type Light = {
  /** Direction *toward* the key light (normalised internally). */
  dir: V3;
  key: string;
  keyI: number;
  fill: string;
  fillI: number;
  sky: string;
  ground: string;
  hemiI: number;
  bg: string;
  exposure: number;
  /** Half-size of the shadow frustum around the light centre. */
  shadowSize: number;
  shadowSoft: number;
  fog?: { color: string; near: number; far: number };
};

/** A door between worlds: rigid placement of the same doorway in both worlds. */
export type Pose = { pos: V3; yaw: number };
export type PortalState = {
  from: Pose;
  to: Pose;
  /** Opening silhouette in door-local coordinates (x right, y up, base on y = 0). */
  opening: ShapeSpec;
  light: Light;
  /** Where the destination light should centre its shadows (destination world coords). */
  center: V3;
};

export const poseMatrix = (p: Pose) => new Matrix4().makeRotationY(p.yaw).setPosition(...p.pos);
/** Rigid transform carrying source-world coordinates into the destination world. */
export const portalMatrix = (from: Pose, to: Pose) => poseMatrix(to).multiply(poseMatrix(from).invert());

export const mixLight = (a: Light, b: Light, t: number): Light => {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const c = (x: string, y: string) => "#" + new Color(x).lerp(new Color(y), t).getHexString();
  const n = (x: number, y: number) => x + (y - x) * t;
  return {
    dir: [n(a.dir[0], b.dir[0]), n(a.dir[1], b.dir[1]), n(a.dir[2], b.dir[2])],
    key: c(a.key, b.key),
    keyI: n(a.keyI, b.keyI),
    fill: c(a.fill, b.fill),
    fillI: n(a.fillI, b.fillI),
    sky: c(a.sky, b.sky),
    ground: c(a.ground, b.ground),
    hemiI: n(a.hemiI, b.hemiI),
    bg: c(a.bg, b.bg),
    exposure: n(a.exposure, b.exposure),
    shadowSize: n(a.shadowSize, b.shadowSize),
    shadowSoft: n(a.shadowSoft, b.shadowSoft),
    fog: a.fog && b.fog ? { color: c(a.fog.color, b.fog.color), near: n(a.fog.near, b.fog.near), far: n(a.fog.far, b.fog.far) } : t < 0.5 ? a.fog : b.fog,
  };
};

// ── Shaders ──────────────────────────────────────────────────────────────────

const PortalShader = {
  uniforms: { tPortal: { value: null }, uRes: { value: new Vector2(1080, 1920) }, uGain: { value: 1 } },
  vertexShader: /* glsl */ `void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tPortal; uniform vec2 uRes; uniform float uGain;
    void main(){ gl_FragColor = vec4(texture2D(tPortal, gl_FragCoord.xy / uRes).rgb * uGain, 1.0); }`,
};

const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uVignette: { value: 0.16 },
    uGrain: { value: 0.016 },
    uRes: { value: new Vector2(1080, 1920) },
  },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float uTime; uniform float uVignette; uniform float uGrain; uniform vec2 uRes;
    varying vec2 vUv;
    float hash(vec2 p){ p = fract(p * vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.x + p.y) * p.x); }
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
      // warm paper highlights, a breath of brown in the shadows (never blue-black)
      c.rgb += smoothstep(0.55, 1.0, l) * vec3(0.006, 0.002, -0.006);
      c.rgb += (1.0 - smoothstep(0.0, 0.45, l)) * vec3(0.012, 0.004, -0.004);
      c.rgb = mix(c.rgb, c.rgb * c.rgb * (3.0 - 2.0 * c.rgb), 0.18);
      vec2 d = (vUv - 0.5) * vec2(1.0, 1.15);
      c.rgb *= 1.0 - uVignette * smoothstep(0.38, 0.98, length(d));
      float g = hash(vUv * uRes + uTime * 17.0) - 0.5;
      c.rgb += g * uGrain * (0.6 + 0.4 * (1.0 - l));
      gl_FragColor = c;
    }`,
};

/** Keeps the HDR buffer finite before depth of field and bloom: one NaN or overflowing pixel from a
 * custom material would otherwise be smeared over the whole frame by the bloom blur. */
const SanitizeShader = {
  uniforms: { tDiffuse: { value: null }, uMax: { value: 12 } },
  vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uMax; varying vec2 vUv;
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      if (any(isnan(c)) || any(isinf(c))) c = vec4(0.0, 0.0, 0.0, 1.0);
      gl_FragColor = vec4(clamp(c.rgb, 0.0, uMax), clamp(c.a, 0.0, 1.0));
    }`,
};

// ── Stage ────────────────────────────────────────────────────────────────────

export type StageProps = {
  shot: Shot;
  light: Light;
  /** Shadow/light centre for the main pass; defaults to the shot target. */
  center?: V3;
  portal?: PortalState | null;
  frame: number;
  ao?: boolean;
  children: React.ReactNode;
};

type Rig = {
  key: DirectionalLight;
  fill: DirectionalLight;
  hemi: HemisphereLight;
  amb: AmbientLight;
  target: Object3D;
};

const applyLight = (scene: Scene, rig: Rig, L: Light, center: Vector3, gl: { toneMappingExposure: number }) => {
  const d = new Vector3(...L.dir).normalize();
  rig.target.position.copy(center);
  rig.target.updateMatrixWorld();
  rig.key.position.copy(center).addScaledVector(d, 160);
  rig.key.color.set(L.key);
  rig.key.intensity = L.keyI;
  const cam = rig.key.shadow.camera;
  cam.left = cam.bottom = -L.shadowSize;
  cam.right = cam.top = L.shadowSize;
  cam.near = 20;
  cam.far = 320;
  cam.updateProjectionMatrix();
  rig.key.shadow.radius = L.shadowSoft;
  rig.key.updateMatrixWorld();
  // fill from the opposite side, low, cool-ish
  rig.fill.position.copy(center).add(new Vector3(-d.x * 100, 40, -d.z * 100 + 60));
  rig.fill.color.set(L.fill);
  rig.fill.intensity = L.fillI;
  rig.fill.updateMatrixWorld();
  rig.hemi.color.set(L.sky);
  rig.hemi.groundColor.set(L.ground);
  rig.hemi.intensity = L.hemiI;
  scene.background = new Color(L.bg);
  scene.fog = L.fog ? new Fog(L.fog.color, L.fog.near, L.fog.far) : null;
  gl.toneMappingExposure = L.exposure;
};

export const Stage: React.FC<StageProps> = ({ shot, light, center, portal, frame, ao = true, children }) => {
  const { gl, scene, camera, size } = useThree();

  const rig = useMemo<Rig>(() => {
    const target = new Object3D();
    const key = new DirectionalLight("#fff", 3);
    key.castShadow = true;
    key.shadow.mapSize.set(4096, 4096);
    key.shadow.bias = -0.00025;
    key.shadow.normalBias = 0.035;
    key.target = target;
    const fill = new DirectionalLight("#fff", 0.5);
    fill.target = target;
    const hemi = new HemisphereLight("#fff", "#888", 1);
    const amb = new AmbientLight("#ffffff", 0);
    return { key, fill, hemi, amb, target };
  }, []);

  const chain = useMemo(() => {
    const w = size.width, h = size.height;
    const rt = new WebGLRenderTarget(w, h, { type: HalfFloatType, samples: 4 });
    const composer = new EffectComposer(gl, rt);
    composer.setPixelRatio(1);
    composer.setSize(w, h);
    composer.addPass(new RenderPass(scene, camera));
    let gtao: GTAOPass | null = null;
    if (ao) {
      gtao = new GTAOPass(scene, camera, w, h);
      gtao.blendIntensity = 0.85;
      gtao.updateGtaoMaterial({ radius: 0.9, distanceExponent: 1.6, thickness: 0.8, scale: 1.0, samples: 16, distanceFallOff: 1.0, screenSpaceRadius: false });
      gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
      composer.addPass(gtao);
    }
    composer.addPass(new ShaderPass(SanitizeShader));
    const dof = new BokehPass(scene, camera, { focus: 20, aperture: 0.002, maxblur: 0.006 });
    composer.addPass(dof);
    const bloom = new UnrealBloomPass(new Vector2(w, h), 0.16, 0.6, 0.92);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    const grade = new ShaderPass(GradeShader);
    (grade.uniforms.uRes.value as Vector2).set(w, h);
    composer.addPass(grade);
    const portalRT = new WebGLRenderTarget(w, h, { type: HalfFloatType, samples: 4 });
    const vcam = new PerspectiveCamera();
    vcam.matrixAutoUpdate = false;
    vcam.matrixWorldAutoUpdate = false;
    const portalMat = new ShaderMaterial({ ...PortalShader, uniforms: { tPortal: { value: portalRT.texture }, uRes: { value: new Vector2(w, h) }, uGain: { value: 1 } } });
    portalMat.fog = false;
    return { composer, dof, grade, portalRT, vcam, portalMat, gtao };
  }, [gl, scene, camera, size.width, size.height, ao]);

  const portalMesh = useMemo(() => {
    const m = new Mesh(undefined, chain.portalMat);
    m.matrixAutoUpdate = false;
    m.frustumCulled = false;
    return m;
  }, [chain]);

  // Camera for this frame.
  useLayoutEffect(() => {
    const cam = camera as PerspectiveCamera;
    cam.position.set(...shot.pos);
    cam.up.set(Math.sin(shot.roll ?? 0), Math.cos(shot.roll ?? 0), 0);
    cam.lookAt(...shot.target);
    cam.fov = shot.fov;
    cam.near = 0.08;
    cam.far = 900;
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();
    gl.toneMapping = NeutralToneMapping;
    gl.shadowMap.autoUpdate = false;
    const u = chain.dof.uniforms as unknown as Record<string, { value: number }>;
    u.focus.value = shot.focus;
    u.aperture.value = shot.aperture;
    u.maxblur.value = shot.maxBlur;
    chain.dof.enabled = shot.maxBlur > 0 && shot.aperture > 0;
    chain.grade.uniforms.uTime.value = frame % 997;
  }, [shot, camera, gl, chain, frame]);

  // Doorway surface for this frame.
  useLayoutEffect(() => {
    if (!portal) {
      portalMesh.visible = false;
      return;
    }
    portalMesh.geometry = flat(portal.opening);
    // sit a hair behind the door plane so the frame's inner edges stay crisp
    portalMesh.matrix.copy(poseMatrix(portal.from)).multiply(new Matrix4().makeTranslation(0, 0, -0.01));
    portalMesh.matrixWorldNeedsUpdate = true;
    portalMesh.updateMatrixWorld(true);
    portalMesh.visible = true;
  }, [portal, portalMesh]);

  useFrame(() => {
    const cam = camera as PerspectiveCamera;
    const mainCenter = new Vector3(...(center ?? shot.target));
    if (portal) {
      const X = portalMatrix(portal.from, portal.to);
      const v = chain.vcam;
      v.projectionMatrix.copy(cam.projectionMatrix);
      v.projectionMatrixInverse.copy(cam.projectionMatrixInverse);
      v.matrixWorld.multiplyMatrices(X, cam.matrixWorld);
      v.matrixWorldInverse.copy(v.matrixWorld).invert();
      // Clip everything on the near side of the destination doorway.
      const toM = poseMatrix(portal.to);
      const n = new Vector3(0, 0, -1).transformDirection(toM);
      const p = new Vector3(0, 0, 0).applyMatrix4(toM);
      gl.clippingPlanes = [new Plane().setFromNormalAndCoplanarPoint(n, p)];
      applyLight(scene, rig, portal.light, new Vector3(...portal.center), gl);
      chain.portalMat.uniforms.uGain.value = portal.light.exposure / light.exposure;
      portalMesh.visible = false;
      gl.setRenderTarget(chain.portalRT);
      gl.shadowMap.needsUpdate = true;
      gl.clear();
      gl.render(scene, v);
      gl.setRenderTarget(null);
      gl.clippingPlanes = [];
      portalMesh.visible = true;
    }
    applyLight(scene, rig, light, mainCenter, gl);
    gl.shadowMap.needsUpdate = true;
    chain.composer.render();
  }, 1);

  return (
    <>
      <primitive object={rig.target} />
      <primitive object={rig.key} />
      <primitive object={rig.fill} />
      <primitive object={rig.hemi} />
      <primitive object={rig.amb} />
      <primitive object={portalMesh} />
      {children}
    </>
  );
};
