// POLYVERSE materials — flat-shaded low-polygon materials for Three.js.

import * as THREE from "three";
import { POLY_PALETTE } from "./palette";

/** Standard flat-shaded low-poly material catching light on individual triangle facets */
export const createPolyMaterial = (color: string = POLY_PALETTE.grassEmerald, roughness = 0.8) => {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness,
    metalness: 0.05,
    flatShading: true,
  });
};

/** Low-poly faceted water material with subtle transparency and specular shine */
export const createPolyWaterMaterial = (color: string = POLY_PALETTE.waterSurface) => {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.15,
    metalness: 0.2,
    transparent: true,
    opacity: 0.82,
    flatShading: true,
  });
};

/** Low-poly cloud material with pure white diffuse */
export const createPolyCloudMaterial = () => {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(POLY_PALETTE.cloudWhite),
    roughness: 0.95,
    metalness: 0.0,
    flatShading: true,
  });
};

/** Low-poly crystal monolith with emissive core */
export const createPolyCrystalMaterial = (color: string = POLY_PALETTE.crystalMonolith) => {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.45,
    roughness: 0.2,
    metalness: 0.8,
    flatShading: true,
  });
};

