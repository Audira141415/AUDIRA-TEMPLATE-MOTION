// LIDARFORGE Materials — Point cloud shaders, vertex color points & laser sweep planes.

import * as THREE from "three";
import { LIDAR_PALETTE } from "./palette";

export const createPointCloudMaterial = (pointSize = 0.08): THREE.PointsMaterial => {
  return new THREE.PointsMaterial({
    size: pointSize,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
  });
};

export const createLaserPlaneMaterial = (): THREE.MeshBasicMaterial => {
  return new THREE.MeshBasicMaterial({
    color: LIDAR_PALETTE.laserScanFront,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
};

export const createSurveyBoxMaterial = (): THREE.LineBasicMaterial => {
  return new THREE.LineBasicMaterial({
    color: LIDAR_PALETTE.gridWireframe,
    transparent: true,
    opacity: 0.6,
  });
};
