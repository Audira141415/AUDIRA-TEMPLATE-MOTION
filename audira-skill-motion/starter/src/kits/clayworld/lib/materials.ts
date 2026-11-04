// CLAYWORLD materials — tactile plasticine clay shaders with high roughness and soft specular response.

import * as THREE from "three";
import { CLAY_PALETTE } from "./palette";

/** Standard plasticine clay material with soft tactile sheen and high diffuse scatter */
export const createClayMaterial = (color: string = CLAY_PALETTE.terracotta, roughness = 0.85) => {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness,
    metalness: 0.02,
    flatShading: false,
  });
};

/** Glossy black bead material for clay character eyes */
export const createBeadEyeMaterial = () => {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(CLAY_PALETTE.charcoal),
    roughness: 0.15,
    metalness: 0.1,
  });
};

/** Hand-pressed clay dough slab material for ground and environment props */
export const createClayGroundMaterial = (color: string = CLAY_PALETTE.olive) => {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.92,
    metalness: 0.0,
  });
};
