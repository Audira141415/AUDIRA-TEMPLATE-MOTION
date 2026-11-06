import * as THREE from "three";
import { HD2D_PALETTE } from "./palette";

export const getCobblestoneMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: HD2D_PALETTE.cobbleStone,
    roughness: 0.78,
    metalness: 0.1,
  });

export const getTimberMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: HD2D_PALETTE.timberBeam,
    roughness: 0.88,
    metalness: 0.0,
  });
