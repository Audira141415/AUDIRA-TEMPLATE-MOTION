// PRECISION PBR Material Library — Physical aerospace metal, ceramic, optical glass and satin anodized finishes.

import * as THREE from "three";
import { PRECISION_PALETTE } from "./palette";

export const createAnodizedAluminiumMaterial = (color = PRECISION_PALETTE.spaceGray): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.28,
    metalness: 0.88,
  });
};

export const createTitaniumMaterial = (): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial({
    color: PRECISION_PALETTE.titaniumNatural,
    roughness: 0.35,
    metalness: 0.95,
  });
};

export const createCeramicClearcoatMaterial = (): THREE.MeshPhysicalMaterial => {
  return new THREE.MeshPhysicalMaterial({
    color: PRECISION_PALETTE.ceramicGloss,
    roughness: 0.08,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  });
};

export const createCopperCoreMaterial = (): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial({
    color: PRECISION_PALETTE.copperAccents,
    roughness: 0.2,
    metalness: 0.9,
  });
};

