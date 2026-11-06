import * as THREE from "three";
import { DATAPHYSICAL_PALETTE } from "./palette";

export const getAluminumMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: DATAPHYSICAL_PALETTE.machinedAluminum,
    roughness: 0.22,
    metalness: 0.88,
  });

export const getBrassMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: DATAPHYSICAL_PALETTE.brassGold,
    roughness: 0.25,
    metalness: 0.85,
  });
