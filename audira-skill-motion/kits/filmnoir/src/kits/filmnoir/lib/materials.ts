import * as THREE from "three";
import { FILMNOIR_PALETTE } from "./palette";

export const getWetAsphaltMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: FILMNOIR_PALETTE.pavementWet,
    roughness: 0.15, // Wet slick surface
    metalness: 0.6,
  });

export const getCastIronMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: FILMNOIR_PALETTE.trimIron,
    roughness: 0.65,
    metalness: 0.8,
  });

export const getBrickWallMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: FILMNOIR_PALETTE.brickWall,
    roughness: 0.88,
    metalness: 0.05,
  });

export const getSilhouetteMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: FILMNOIR_PALETTE.voidDark,
    roughness: 0.95,
    metalness: 0.0,
  });
