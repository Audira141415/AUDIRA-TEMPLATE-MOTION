import * as THREE from "three";

/**
 * Creates high-clearcoat ABS plastic material with specular highlight.
 */
export function createAbsPlasticMaterial(color: string | number, roughness = 0.18, clearcoat = 0.85): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness,
    metalness: 0.0,
    clearcoat,
    clearcoatRoughness: 0.08,
    reflectivity: 0.6,
  });
}

/**
 * Creates translucent jewel plastic material for fires, lasers, or glass bricks.
 */
export function createTranslucentBrickMaterial(color: string | number, transmission = 0.75): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: 0.1,
    transmission,
    opacity: 0.85,
    transparent: true,
    ior: 1.49, // Acrylic plastic
    thickness: 0.5,
  });
}

/**
 * Creates wooden desk table material for macro background.
 */
export function createWoodTableMaterial(color: string | number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.7,
    metalness: 0.05,
  });
}

/**
 * Creates matte green baseplate material.
 */
export function createBaseplateMaterial(color: string | number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.55,
    metalness: 0.0,
  });
}

