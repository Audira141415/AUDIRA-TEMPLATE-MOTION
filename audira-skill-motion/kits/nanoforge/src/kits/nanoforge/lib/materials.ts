// NANOFORGE PBR & Fluorescent Material Library — Bio-luminescence, subsurface scattering and lipid bilayers.

import * as THREE from "three";
import { NANO_PALETTE } from "./palette";

export const createBioMembraneMaterial = (): THREE.MeshPhysicalMaterial => {
  return new THREE.MeshPhysicalMaterial({
    color: NANO_PALETTE.membraneGlow,
    roughness: 0.25,
    metalness: 0.1,
    transmission: 0.65,
    ior: 1.33, // Water / Cytoplasm refractive index
    transparent: true,
    opacity: 0.85,
    clearcoat: 0.8,
  });
};

export const createNucleotideMaterial = (color: string): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.3,
  });
};

export const createDnaBackboneMaterial = (): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial({
    color: "#60a5fa",
    roughness: 0.35,
    metalness: 0.2,
  });
};

export const createNanobotMaterial = (): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial({
    color: NANO_PALETTE.nanobotChrome,
    roughness: 0.18,
    metalness: 0.92,
  });
};

