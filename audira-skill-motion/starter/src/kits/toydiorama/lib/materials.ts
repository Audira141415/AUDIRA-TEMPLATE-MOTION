import * as THREE from "three";
import { TOYDIORAMA_PALETTE } from "./palette";

export const getMattePlasticMaterial = (color: string) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: 0.72,
    metalness: 0.04,
  });

export const getSoftClayMaterial = (color: string) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: 0.85,
    metalness: 0.02,
  });

export const getWoodStageMaterial = (isLight = false) =>
  new THREE.MeshStandardMaterial({
    color: isLight ? TOYDIORAMA_PALETTE.stageFloorLight : TOYDIORAMA_PALETTE.stageFloor,
    roughness: 0.65,
    metalness: 0.05,
  });

export const getPaperMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: TOYDIORAMA_PALETTE.paperCard,
    roughness: 0.92,
    metalness: 0.0,
  });
