import * as THREE from "three";

/**
 * Creates matte white architectural plaster / 3D-print resin material.
 */
export function createPlasterModelMaterial(color: string | number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.88,
    metalness: 0.0,
  });
}

/**
 * Creates satin obsidian presentation plinth material.
 */
export function createObsidianPlinthMaterial(color: string | number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.45,
    metalness: 0.2,
  });
}

/**
 * Creates dark resin water basin inlay material with soft specular reflection.
 */
export function createWaterInlayMaterial(color: string | number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.15,
    metalness: 0.3,
  });
}

/**
 * Creates glowing projection-mapped data highlight material.
 */
export function createProjectedDataMaterial(color: string | number, intensity = 1.8): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(color),
    emissiveIntensity: intensity,
    roughness: 0.3,
  });
}

