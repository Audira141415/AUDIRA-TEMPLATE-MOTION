import * as THREE from "three";
import { SATELLITEBRIEFING_PALETTE } from "./palette";

export const getTerrainMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: SATELLITEBRIEFING_PALETTE.analystGrey,
    roughness: 0.85,
    metalness: 0.05,
  });
