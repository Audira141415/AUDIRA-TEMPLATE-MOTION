import * as THREE from "three";
import { CHALK_PALETTE } from "./palette";

export function createChalkStrokeMaterial(colorHex: string) {
  return new THREE.LineBasicMaterial({
    color: colorHex,
    linewidth: 2,
  });
}
