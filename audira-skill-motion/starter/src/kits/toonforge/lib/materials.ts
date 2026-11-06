// TOONFORGE materials — cel-shaded toon materials and inverted-hull ink outline shaders for Three.js.

import * as THREE from "three";
import { TOON_PALETTE } from "./palette";

/** Cel-shaded toon material with high diffuse contrast and sharp terminator */
export const createCelMaterial = (color: string = TOON_PALETTE.mechaArmor) => {
  return new THREE.MeshToonMaterial({
    color: new THREE.Color(color),
  });
};

/** Inverted-hull ink outline material for hand-drawn anime contours */
export const createInkOutlineMaterial = (color: string = TOON_PALETTE.inkOutline) => {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    side: THREE.BackSide,
    depthWrite: true,
  });
};

/** Additive speed line stroke material */
export const createSpeedLineMaterial = (color: string = TOON_PALETTE.actionSpeedLine, opacity = 0.8) => {
  return new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
};

/** High-energy anime thruster / blade material */
export const createAnimeEnergyMaterial = (color: string = TOON_PALETTE.skyCyan) => {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.95,
  });
};
