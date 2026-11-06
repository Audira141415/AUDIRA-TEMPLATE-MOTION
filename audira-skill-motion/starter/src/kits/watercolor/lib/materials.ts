import * as THREE from "three";
import { WATERCOLOR_PALETTE } from "./palette";

export const getWatercolorWashMaterial = (color: string, opacity = 0.88) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness: 0.94, // Matte water-absorbed paper texture
    metalness: 0.0,
    transparent: opacity < 1.0,
    opacity,
  });

export const getPencilSketchMaterial = () =>
  new THREE.MeshBasicMaterial({
    color: WATERCOLOR_PALETTE.pencilGraphite,
  });
