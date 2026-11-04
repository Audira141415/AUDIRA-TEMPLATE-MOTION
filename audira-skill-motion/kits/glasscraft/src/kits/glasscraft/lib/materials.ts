// GLASSCRAFT materials — optical frosted glass and chromatic prism shaders for Three.js.

import * as THREE from "three";
import { GLASS_PALETTE } from "./palette";

/** Optical frosted glass material with high transmission, internal thickness, and physical roughness */
export const createFrostedGlassMaterial = (color: string = GLASS_PALETTE.frostedGlass, roughness = 0.08) => {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness,
    metalness: 0.05,
    transmission: 0.94,
    ior: 1.52,
    thickness: 1.2,
    specularIntensity: 1.0,
    clearcoat: 0.4,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 1.0,
    side: THREE.DoubleSide,
  });
};

/** Floating liquid glass droplet material with optical reflectivity and high refraction */
export const createLiquidDropMaterial = (color: string = GLASS_PALETTE.prismCyan) => {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: 0.02,
    metalness: 0.2,
    transmission: 0.88,
    ior: 1.45,
    thickness: 0.8,
    clearcoat: 1.0,
    transparent: true,
  });
};

/** Iridescent chromatic prism bevel material */
export const createPrismBevelMaterial = (color: string = GLASS_PALETTE.prismBlue) => {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.1,
    metalness: 0.9,
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.35,
  });
};

