// CYBERFORGE materials — custom shaders and optimized Three.js materials for holographic and HUD rendering.

import * as THREE from "three";
import { CYBER_PALETTE } from "./palette";

/** Additive glowing line material for wireframes and HUD telemetry */
export const createHoloLineMaterial = (color: string = CYBER_PALETTE.cyan, opacity = 0.85) => {
  return new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
};

/** Holographic faceted mesh material with semi-transparency and Fresnel edge glow */
export const createHoloMeshMaterial = (color: string = CYBER_PALETTE.cyan, opacity = 0.25) => {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.6,
    roughness: 0.1,
    metalness: 0.9,
    transmission: 0.7,
    transparent: true,
    opacity,
    wireframe: false,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
};

/** High-contrast cyber wireframe overlay material */
export const createCyberWireframeMaterial = (color: string = CYBER_PALETTE.cyan, opacity = 0.75) => {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    wireframe: true,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
};

/** Additive glow particle material for floating quantum data nodes */
export const createDataParticleMaterial = (color: string = CYBER_PALETTE.cyan, size = 0.08) => {
  return new THREE.PointsMaterial({
    color: new THREE.Color(color),
    size,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
};

