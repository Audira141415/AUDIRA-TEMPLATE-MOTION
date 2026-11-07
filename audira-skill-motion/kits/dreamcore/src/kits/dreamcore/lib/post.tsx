// Camera rig + finishing chain for DREAMCORE: scene (HDR, MSAA) -> bloom -> ACES tone map -> grade.
// The rig applies this frame's shot in a layout effect, before R3F advances; the composer then renders.
import React, { useLayoutEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

export type V3 = [number, number, number];
export type DreamShot = { pos: V3; target: V3; fov: number; roll?: number; exposure: number };

export const DreamCameraRig: React.FC<{ shot: DreamShot; near?: number; far?: number }> = ({ shot, near = 0.05, far = 200 }) => {
  const { camera, gl } = useThree();
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...shot.pos);
    cam.up.set(Math.sin(shot.roll ?? 0), Math.cos(shot.roll ?? 0), 0);
    cam.lookAt(...shot.target);
    cam.fov = shot.fov;
    cam.near = near;
    cam.far = far;
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = shot.exposure;
  }, [shot, camera, gl, near, far]);
  return null;
};

const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uVignette: { value: 0.3 },
    uGrain: { value: 0.02 },
    uRes: { value: new THREE.Vector2(1080, 1920) },
  },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float uTime; uniform float uVignette; uniform float uGrain; uniform vec2 uRes;
    varying vec2 vUv;
    float hash(vec2 p){ p = fract(p * vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.x + p.y) * p.x); }
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      if (any(isnan(c))) c = vec4(0.0, 0.0, 0.0, 1.0);
      vec2 d = (vUv - 0.5) * vec2(1.0, 1.3);
      c.rgb *= 1.0 - uVignette * smoothstep(0.3, 0.95, length(d));
      c.rgb += (hash(vUv * uRes + uTime * 17.0) - 0.5) * uGrain;
      gl_FragColor = vec4(clamp(c.rgb, 0.0, 1.0), 1.0);
    }`,
};

export const DreamPost: React.FC<{ frame: number; strength: number; radius: number; threshold: number; vignette: number; grain: number }> = ({
  frame,
  strength,
  radius,
  threshold,
  vignette,
  grain,
}) => {
  const { gl, scene, camera, size } = useThree();
  const chain = useMemo(() => {
    const w = size.width, h = size.height;
    const rt = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: 4 });
    const composer = new EffectComposer(gl, rt);
    composer.setPixelRatio(1);
    composer.setSize(w, h);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), strength, radius, threshold);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    const grade = new ShaderPass(GradeShader);
    (grade.uniforms.uRes.value as THREE.Vector2).set(w, h);
    composer.addPass(grade);
    return { composer, bloom, grade };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene, camera, size.width, size.height]);

  useLayoutEffect(() => {
    chain.bloom.strength = strength;
    chain.bloom.radius = radius;
    chain.bloom.threshold = threshold;
    chain.grade.uniforms.uVignette.value = vignette;
    chain.grade.uniforms.uGrain.value = grain;
    chain.grade.uniforms.uTime.value = frame % 997;
  }, [chain, frame, strength, radius, threshold, vignette, grain]);

  useFrame(() => {
    chain.composer.render();
  }, 1);
  return null;
};
