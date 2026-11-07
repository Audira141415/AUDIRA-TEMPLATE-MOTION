// ANATOMIX camera — clinical orbit: opens close on the beating heart, pulls back as the wall turns translucent,
// keeps orbiting (never stops) and pushes in slightly for the payoff. Also exports a pure projector for HUD labels.
import * as THREE from "three";
import { clamp, seg } from "../core/motion";

export type AnatomyPose = { position: [number, number, number]; target: [number, number, number]; fov: number };

export const getAnatomyCamera = (t: number): AnatomyPose => {
  const tt = clamp(t, 0, 12);
  const r = 6.3 + 1.3 * seg(tt, 0, 3.8) - 0.6 * seg(tt, 7.5, 12);
  const ang = -0.55 + tt * 0.13;
  const y = 0.95 - 0.55 * seg(tt, 0, 5) + 0.25 * seg(tt, 8, 12);
  return {
    position: [Math.sin(ang) * r, y, Math.cos(ang) * r],
    target: [0.05, 0.22 - 0.1 * seg(tt, 0, 4), 0],
    fov: 34,
  };
};

/** Project a world point to pixel coordinates for the overlay (same pose as the 3D camera). */
export const projectToScreen = (t: number, p: [number, number, number], width: number, height: number) => {
  const pose = getAnatomyCamera(t);
  const cam = new THREE.PerspectiveCamera(pose.fov, width / height, 0.1, 100);
  cam.position.set(...pose.position);
  cam.lookAt(...pose.target);
  cam.updateMatrixWorld();
  cam.updateProjectionMatrix();
  const v = new THREE.Vector3(...p).project(cam);
  return { x: ((v.x + 1) / 2) * width, y: ((1 - v.y) / 2) * height, front: v.z < 1 };
};
