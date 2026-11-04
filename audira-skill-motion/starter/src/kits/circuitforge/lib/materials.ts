// CIRCUITFORGE Materials — Solder mask substrate, ENIG gold contacts & glowing electron streams.

import * as THREE from "three";
import { CIRCUIT_PALETTE } from "./palette";

export const createSolderMaskMaterial = (): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial({
    color: CIRCUIT_PALETTE.solderMaskDark,
    roughness: 0.65,
    metalness: 0.1,
  });
};

export const createCopperTraceMaterial = (): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial({
    color: CIRCUIT_PALETTE.copperTraceBevel,
    roughness: 0.35,
    metalness: 0.75,
  });
};

export const createEnigGoldMaterial = (): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial({
    color: CIRCUIT_PALETTE.enigGold,
    roughness: 0.22,
    metalness: 0.92,
  });
};

export const createSiliconDieMaterial = (): THREE.MeshStandardMaterial => {
  return new THREE.MeshStandardMaterial({
    color: CIRCUIT_PALETTE.siliconDie,
    roughness: 0.15,
    metalness: 0.85,
  });
};

export const createCurrentPulseMaterial = (color = CIRCUIT_PALETTE.electronAmber): THREE.MeshBasicMaterial => {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });
};
