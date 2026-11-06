import * as THREE from "three";
import { MEMPHISDIORAMA_PALETTE } from "./palette";

export const getMemphisMatteMaterial = (color: string) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: 0.92,
    metalness: 0.0,
  });
