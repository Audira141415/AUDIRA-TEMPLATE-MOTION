import * as THREE from "three";
import { BRUTAL_PALETTE } from "./palette";

export function createBrutalPopMaterial(colorHex: string) {
  return new THREE.MeshToonMaterial({
    color: colorHex,
  });
}
