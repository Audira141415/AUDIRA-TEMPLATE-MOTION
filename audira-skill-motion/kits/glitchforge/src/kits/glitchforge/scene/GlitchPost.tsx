import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GlitchShader, makeStudioEnv } from "../lib/materials";
import { GlitchState } from "../core/motion";

// Render chain: scene (MSAA) → OutputPass (tone map + sRGB) → glitch pass on display-referred pixels.
// useFrame is used ONLY to hand rendering to the composer (same pattern as buildforge/render/Post.tsx);
// every uniform is set from the frame-derived GlitchState in a layout effect.
export const GlitchPost: React.FC<{ s: GlitchState }> = ({ s }) => {
  const { gl, scene, camera, size } = useThree();
  const chain = useMemo(() => {
    const w = size.width;
    const h = size.height;
    scene.environment = makeStudioEnv(gl);
    const rt = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: 4 });
    const composer = new EffectComposer(gl, rt);
    composer.setPixelRatio(1);
    composer.setSize(w, h);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new OutputPass());
    const glitch = new ShaderPass(GlitchShader);
    glitch.uniforms.uRes.value.set(w, h);
    composer.addPass(glitch);
    return { composer, glitch };
  }, [gl, scene, camera, size.width, size.height]);

  useLayoutEffect(() => {
    const u = chain.glitch.uniforms as unknown as Record<string, { value: number }>;
    u.uSeed.value = s.seed;
    u.uSplit.value = s.split;
    u.uTear.value = s.tear;
    u.uBlock.value = s.block;
    u.uMosh.value = s.mosh;
    u.uSort.value = s.sort;
    u.uLost.value = s.lost;
  }, [chain, s]);

  useFrame(() => {
    chain.composer.render();
  }, 1);
  return null;
};
