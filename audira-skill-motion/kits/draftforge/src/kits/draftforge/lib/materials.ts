// DRAFTFORGE materials — high-clarity vector-like line materials and drafting shaders for Three.js.

import * as THREE from "three";
import { DRAFT_PALETTE } from "./palette";

/** Crisp technical drafting line material */
export const createCadLineMaterial = (color: string = DRAFT_PALETTE.cadWhite, opacity = 0.95) => {
  return new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    depthWrite: true,
  });
};

/** Ghost / construction projection line material (dashed or low opacity) */
export const createGhostLineMaterial = (color: string = DRAFT_PALETTE.cadCyan, opacity = 0.4) => {
  return new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    depthWrite: false,
  });
};

/** Dimension annotation material (gold/amber) */
export const createDimensionLineMaterial = (color: string = DRAFT_PALETTE.dimensionGold, opacity = 0.9) => {
  return new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    depthWrite: false,
  });
};

/** Blueprint semi-translucent surface fill (shows solid form with drafting shading) */
export const createBlueprintMeshMaterial = (color: string = DRAFT_PALETTE.blueprintNavy, opacity = 0.6) => {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
};

