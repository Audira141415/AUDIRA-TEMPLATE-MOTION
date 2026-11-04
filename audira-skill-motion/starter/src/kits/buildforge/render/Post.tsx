// Camera + finishing chain (metre scale, exterior daylight). The rig applies the shot for this frame before R3F advances,
// then the composer renders: scene (MSAA) → ground-truth AO → sanitize → depth of field → restrained
// bloom → Khronos PBR Neutral tone mapping → grade (warmth, vignette, fine grain).

import React, { useLayoutEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { HalfFloatType, NeutralToneMapping, PerspectiveCamera, Vector2, WebGLRenderTarget } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

export type Shot = {
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
  roll?: number;
  /** Focus distance (world units) and lens aperture for the bokeh pass. */
  focus: number;
  aperture: number;
  maxBlur: number;
  exposure: number;
};

export const CameraRig: React.FC<{ shot: Shot }> = ({ shot }) => {
  const { camera, gl } = useThree();
  useLayoutEffect(() => {
    const cam = camera as PerspectiveCamera;
    cam.position.set(...shot.pos);
    cam.up.set(Math.sin(shot.roll ?? 0), Math.cos(shot.roll ?? 0), 0);
    cam.lookAt(...shot.target);
    cam.fov = shot.fov;
    cam.near = 0.4;
    cam.far = 2500;
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();
    gl.toneMapping = NeutralToneMapping;
    gl.toneMappingExposure = shot.exposure;
  }, [shot, camera, gl]);
  return null;
};

const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uVignette: { value: 0.14 },
    uGrain: { value: 0.012 },
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
      // ivory highlights, a breath of cool in the shadows
      c.rgb += smoothstep(0.6, 1.0, l) * vec3(0.002, 0.001, -0.003);
      c.rgb += (1.0 - smoothstep(0.0, 0.5, l)) * vec3(-0.004, 0.0, 0.006);
      // gentle S-curve: deeper form shadows without crushing the whites
      c.rgb = mix(c.rgb, c.rgb * c.rgb * (3.0 - 2.0 * c.rgb), 0.24);
      vec2 d = (vUv - 0.5) * vec2(1.0, 1.25);
      c.rgb *= 1.0 - uVignette * smoothstep(0.35, 0.95, length(d));
      float g = hash(vUv * uRes + uTime * 17.0) - 0.5;
      c.rgb += g * uGrain;
      gl_FragColor = c;
    }`,
};

/** Keeps the HDR buffer finite before depth of field and bloom: one NaN or overflowing pixel (a sliver seen
 * edge-on, a custom shader) would otherwise be smeared over the whole frame by the bloom blur. */
const SanitizeShader = {
  uniforms: { tDiffuse: { value: null }, uMax: { value: 16 } },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float uMax; varying vec2 vUv;
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      if (any(isnan(c)) || any(isinf(c))) c = vec4(0.0, 0.0, 0.0, 1.0);
      gl_FragColor = vec4(clamp(c.rgb, 0.0, uMax), clamp(c.a, 0.0, 1.0));
    }`,
};

export const Post: React.FC<{ shot: Shot; frame: number; ao?: boolean; aoRadius?: number }> = ({ shot, frame, ao = true, aoRadius = 0.28 }) => {
  const { gl, scene, camera, size } = useThree();
  const chain = useMemo(() => {
    const w = size.width, h = size.height;
    const rt = new WebGLRenderTarget(w, h, { type: HalfFloatType, samples: 4 });
    const composer = new EffectComposer(gl, rt);
    composer.setPixelRatio(1);
    composer.setSize(w, h);
    composer.addPass(new RenderPass(scene, camera));
    if (ao) {
      const gtao = new GTAOPass(scene, camera, w, h);
      gtao.blendIntensity = 1.0;
      gtao.updateGtaoMaterial({ radius: aoRadius, distanceExponent: 1.8, thickness: 0.5, scale: 1.0, samples: 16, distanceFallOff: 1.0, screenSpaceRadius: false });
      gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 5, rings: 2, samples: 16 });
      composer.addPass(gtao);
    }
    composer.addPass(new ShaderPass(SanitizeShader));
    const dof = new BokehPass(scene, camera, { focus: 10, aperture: 0.002, maxblur: 0.008 });
    composer.addPass(dof);
    const bloom = new UnrealBloomPass(new Vector2(w, h), 0.14, 0.45, 2.2);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    const grade = new ShaderPass(GradeShader);
    grade.uniforms.uRes.value.set(w, h);
    composer.addPass(grade);
    return { composer, dof, grade };
  }, [gl, scene, camera, size.width, size.height, ao, aoRadius]);

  useLayoutEffect(() => {
    const u = chain.dof.uniforms as unknown as Record<string, { value: number }>;
    u.focus.value = shot.focus;
    u.aperture.value = shot.aperture;
    u.maxblur.value = shot.maxBlur;
    chain.dof.enabled = shot.maxBlur > 0 && shot.aperture > 0;
    chain.grade.uniforms.uTime.value = frame % 997;
  }, [frame, chain, shot]);

  useFrame(() => {
    chain.composer.render();
  }, 1);
  return null;
};
