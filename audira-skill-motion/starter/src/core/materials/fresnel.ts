/**
 * Fresnel Edge Rim Lighting Material System.
 *
 * Implements physical Schlick Fresnel approximation on mesh contours,
 * creating edge rim halos that separate 3D silhouettes cleanly from
 * dark backgrounds in mobile video formats (9:16).
 *
 * Authored by: AUDIRA (Agus Dwi R)
 */

import * as THREE from "three";

export interface FresnelOptions {
  baseColor?: string | number;
  rimColor?: string | number;
  rimPower?: number; // Higher = tighter edge line (typically 2.0 to 4.5)
  rimIntensity?: number; // Brightness multiplier (typically 1.0 to 3.0)
  roughness?: number;
  metalness?: number;
  transparent?: boolean;
  opacity?: number;
}

/**
 * Injects Fresnel rim term into standard MeshPhysicalMaterial / MeshStandardMaterial via onBeforeCompile.
 * This retains full PBR shadows and environmental reflections while adding the luminous rim.
 */
export function createFresnelPBRMaterial(options: FresnelOptions = {}): THREE.MeshStandardMaterial {
  const baseColor = options.baseColor ?? "#FFFFFF";
  const rimColor = new THREE.Color(options.rimColor ?? "#00F0FF");
  const rimPower = options.rimPower ?? 3.0;
  const rimIntensity = options.rimIntensity ?? 2.0;

  const mat = new THREE.MeshStandardMaterial({
    color: baseColor,
    roughness: options.roughness ?? 0.35,
    metalness: options.metalness ?? 0.2,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1.0,
  });

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uRimColor = { value: rimColor };
    shader.uniforms.uRimPower = { value: rimPower };
    shader.uniforms.uRimIntensity = { value: rimIntensity };

    // 1. Pass view direction from vertex to fragment
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      /* glsl */ `
      #include <common>
      varying vec3 vViewDirFresnel;
      `
    );

    shader.vertexShader = shader.vertexShader.replace(
      "#include <worldpos_vertex>",
      /* glsl */ `
      #include <worldpos_vertex>
      vViewDirFresnel = normalize(- (modelViewMatrix * vec4(position, 1.0)).xyz);
      `
    );

    // 2. Add Fresnel calculation in fragment shader
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      /* glsl */ `
      #include <common>
      uniform vec3 uRimColor;
      uniform float uRimPower;
      uniform float uRimIntensity;
      varying vec3 vViewDirFresnel;
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      /* glsl */ `
      #include <dithering_fragment>
      // Schlick Fresnel contour rim
      float fresnelFactor = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDirFresnel)), 0.0), uRimPower);
      vec3 rimGlow = uRimColor * (fresnelFactor * uRimIntensity);
      gl_FragColor.rgb += rimGlow;
      `
    );
  };

  return mat;
}

/**
 * Pure holographic Fresnel rim ShaderMaterial (useful for scanning shields, cyber wireframes, or Ghost X-ray views).
 */
export function createHoloFresnelMaterial(
  rimColor: string = "#00F0FF",
  rimPower: number = 2.5,
  coreOpacity: number = 0.08
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uRimColor: { value: new THREE.Color(rimColor) },
      uRimPower: { value: rimPower },
      uCoreOpacity: { value: coreOpacity },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormalVec;
      varying vec3 vViewVec;
      void main() {
        vNormalVec = normalize(normalMatrix * normal);
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewVec = normalize(-mvPos.xyz);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uRimColor;
      uniform float uRimPower;
      uniform float uCoreOpacity;
      varying vec3 vNormalVec;
      varying vec3 vViewVec;
      void main() {
        float f = 1.0 - max(dot(vNormalVec, vViewVec), 0.0);
        float alpha = clamp(pow(f, uRimPower) + uCoreOpacity, 0.0, 1.0);
        gl_FragColor = vec4(uRimColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
}

