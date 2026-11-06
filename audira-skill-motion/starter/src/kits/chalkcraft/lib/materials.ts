import * as THREE from "three";

export function createChalkStrokeMaterial(colorHex: string) {
  return new THREE.LineBasicMaterial({
    color: colorHex,
    linewidth: 2,
  });
}
