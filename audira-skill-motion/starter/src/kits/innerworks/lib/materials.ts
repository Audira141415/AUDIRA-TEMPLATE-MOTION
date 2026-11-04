// INNERWORKS Material Library — X-Ray ghosted housings, polished brass gears, and precision shafts.

import * as THREE from "three";
import { INNERWORKS_PALETTE } from "./palette";

export const createGhostHousingMaterial = (opacity = 0.25): THREE.MeshPhysicalMaterial => {
  return new THREE.MeshPhysicalMaterial({
    color: INNERWORKS_PALETTE.xrayCyan,
    roughness: 0.1,
    metalness: 0.1,
    transmission: 0.85,
    transparent: true,
    opacity,
    wireframe: false,
  });
};

export const createBrassGearMaterial = (): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial({
    color: INNERWORKS_PALETTE.brassGear,
    roughness: 0.25,
    metalness: 0.9,
  });
};

export const createSteelShaftMaterial = (): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial({
    color: INNERWORKS_PALETTE.hardenedShaft,
    roughness: 0.2,
    metalness: 0.95,
  });
};
