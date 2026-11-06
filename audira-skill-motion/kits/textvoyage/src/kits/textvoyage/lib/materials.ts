import * as THREE from "three";
import { TEXTVOYAGE_PALETTE } from "./palette";

export function createMonolithTextMaterial() {
  return new THREE.MeshStandardMaterial({
    color: TEXTVOYAGE_PALETTE.monolithTitanium,
    roughness: 0.35,
    metalness: 0.8,
  });
}
