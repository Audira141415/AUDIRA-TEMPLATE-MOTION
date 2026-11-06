import * as THREE from "three";
import { RETROWAVE_PALETTE } from "./palette";

export function createNeonGridMaterial() {
  return new THREE.LineBasicMaterial({
    color: RETROWAVE_PALETTE.neonMagenta,
    linewidth: 2,
  });
}
