// TERRARIUM camera — macro orbit around the jar: starts wide and a little high (whole jar + room), circles
// ~140° while descending and pushing in, ending at eye level with the snail. Also places the foreground leaf.
import * as THREE from "three";
import { clamp, lerp, seg, snailAt } from "../core/motion";

export type TerraPose = { position: [number, number, number]; target: [number, number, number]; fov: number };

export const getTerraCamera = (t: number): TerraPose => {
  const tt = clamp(t, 0, 12);
  const ang = 0.45 + tt * 0.2;
  const r = 6.4 - 2.9 * seg(tt, 0.5, 11.5);
  const y = 2.7 - 1.75 * seg(tt, 0, 11);
  const sn = snailAt(tt);
  const k = seg(tt, 5, 11.5);
  return {
    position: [Math.sin(ang) * r, y, Math.cos(ang) * r],
    target: [lerp(0, sn.x * 0.75, k), lerp(1.35, 0.72, seg(tt, 0, 11)), lerp(0, sn.z * 0.75, k)],
    fov: 34,
  };
};

/** Foreground fern frond: fixed in the lens' lower-left corner, ~1.1 units in front of the camera. */
export const leafPose = (t: number) => {
  const p = getTerraCamera(t);
  const cam = new THREE.PerspectiveCamera(p.fov, 9 / 16, 0.1, 100);
  cam.position.set(...p.position);
  cam.lookAt(...p.target);
  cam.updateMatrixWorld();
  const pos = new THREE.Vector3(-0.42, -0.62, -1.15).applyMatrix4(cam.matrixWorld);
  const q = cam.quaternion.clone();
  return { pos: [pos.x, pos.y, pos.z] as [number, number, number], quat: [q.x, q.y, q.z, q.w] as [number, number, number, number] };
};
