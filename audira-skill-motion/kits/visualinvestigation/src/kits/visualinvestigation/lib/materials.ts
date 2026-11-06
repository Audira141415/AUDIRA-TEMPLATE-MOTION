import * as THREE from "three";
import { VISUALINVESTIGATION_PALETTE } from "./palette";

export const getArchivalPaperMaterial = () =>
  new THREE.MeshStandardMaterial({
    color: VISUALINVESTIGATION_PALETTE.archivalPaper,
    roughness: 0.94,
    metalness: 0.0,
  });
