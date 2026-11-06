import * as THREE from "three";

export function createBrutalPopMaterial(colorHex: string) {
  return new THREE.MeshToonMaterial({
    color: colorHex,
  });
}
