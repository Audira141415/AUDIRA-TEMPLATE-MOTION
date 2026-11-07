import React, { useMemo } from "react";
import * as THREE from "three";
import { makeMarbleMaterial } from "../lib/materials";
import { BUST_HEAD, mulberry32 } from "../core/motion";

const g2 = (x: number, y: number, cx: number, cy: number, sx: number, sy: number) => Math.exp(-(((x - cx) / sx) ** 2 + ((y - cy) / sy) ** 2));
const sstep = (a: number, b: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

/**
 * Sculpted head: a dense sphere displaced along its normals by gaussian "chisel" features
 * (brow, sockets, blank classical eyes, nose, cheekbones, lips, chin). Face looks down +z.
 */
const headGeometry = () => {
  const geo = new THREE.SphereGeometry(1, 180, 140);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const { x, y, z } = v;
    const ax = Math.abs(x);
    const front = sstep(0.2, 0.75, z);
    let r = 1;
    // skull & jaw
    r -= 0.1 * sstep(-0.1, -0.85, y) * (ax > 0.1 ? 1 : 0.6);
    r += 0.04 * sstep(0.3, 0.9, y) * (1 - front);
    // brow ridge
    r += 0.06 * g2(ax, y, 0.28, 0.22, 0.26, 0.06) * front;
    // eye sockets and blank eyeballs
    r -= 0.12 * g2(ax, y, 0.3, 0.07, 0.14, 0.1) * front;
    r += 0.05 * g2(ax, y, 0.3, 0.06, 0.08, 0.055) * front;
    // nose: bridge to tip, nostril wings
    const noseProfile = sstep(0.18, -0.26, y) * (y > -0.36 ? 1 : 0.15);
    r += (0.035 + 0.3 * noseProfile) * g2(x, 0, 0, 0, 0.085 + 0.05 * noseProfile, 1) * front * (y < 0.2 ? 1 : 0.2);
    r += 0.05 * g2(ax, y, 0.1, -0.3, 0.06, 0.05) * front;
    // cheekbones
    r += 0.045 * g2(ax, y, 0.46, -0.1, 0.14, 0.12) * sstep(0.0, 0.5, z);
    // lips with a parting groove, philtrum
    r += 0.045 * g2(ax, y, 0.0, -0.47, 0.17, 0.035) * front;
    r += 0.05 * g2(ax, y, 0.0, -0.56, 0.15, 0.04) * front;
    r -= 0.025 * g2(ax, y, 0.0, -0.515, 0.18, 0.012) * front;
    // chin
    r += 0.07 * g2(ax, y, 0.0, -0.74, 0.16, 0.1) * front;
    // ears
    r += 0.09 * g2(Math.abs(z), y, 0.05, 0.0, 0.12, 0.2) * sstep(0.75, 0.95, ax);
    v.multiplyScalar(r);
    pos.setXYZ(i, v.x * 0.86, v.y * 1.0, v.z * 0.95);
  }
  geo.computeVertexNormals();
  return geo;
};

/** Torso with himation drapery folds running diagonally over the left shoulder. */
const torsoGeometry = () => {
  const geo = new THREE.SphereGeometry(1, 120, 80, 0, Math.PI * 2, 0, Math.PI * 0.62);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const diag = v.x * 0.75 + v.y * 0.65;
    const drape = v.x < 0.35 ? 1 : Math.max(0, 1 - (v.x - 0.35) * 4);
    const fold = 0.035 * Math.sin(diag * 22) * drape + 0.015 * Math.sin(diag * 47 + v.z * 3) * drape;
    v.multiplyScalar(1 + fold);
    pos.setXYZ(i, v.x * 1.05, v.y * 0.62, v.z * 0.56);
  }
  geo.computeVertexNormals();
  return geo;
};

/** Points on the scalp/jaw for curls, oriented by the surface normal. */
const curlSites = (seed: number, count: number, accept: (n: THREE.Vector3) => boolean) => {
  const rnd = mulberry32(seed);
  const out: THREE.Matrix4[] = [];
  const n = new THREE.Vector3();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 0, 1);
  let guard = 0;
  while (out.length < count && guard++ < count * 40) {
    n.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
    if (n.lengthSq() > 1 || n.lengthSq() < 0.01) continue;
    n.normalize();
    if (!accept(n)) continue;
    const s = 0.055 + rnd() * 0.035;
    const p = new THREE.Vector3(n.x * 0.86, n.y * 1.0, n.z * 0.95).multiplyScalar(1.04);
    q.setFromUnitVectors(up, n);
    q.multiply(new THREE.Quaternion().setFromAxisAngle(up, rnd() * Math.PI * 2));
    out.push(new THREE.Matrix4().compose(p, q.clone(), new THREE.Vector3(s * 1.15, s * 0.9, s * 0.75)));
  }
  return out;
};

const curlMesh = (mat: THREE.Material, mats: THREE.Matrix4[]) => {
  // drill-cut lock: a squashed, slightly twisted lump (classical curls read as clustered nubs, not rings)
  const geo = new THREE.SphereGeometry(1, 12, 9);
  const p = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const a = y * 0.9;
    p.setXY(i, x * Math.cos(a) - y * 0.15, y + x * Math.sin(a) * 0.3);
  }
  geo.computeVertexNormals();
  const mesh = new THREE.InstancedMesh(geo, mat, mats.length);
  mats.forEach((m, i) => mesh.setMatrixAt(i, m));
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
};

/** Original Greco-Roman style "thinker" bust on a turned socle and a moulded plinth. */
export const MarbleBust3D: React.FC<{ t: number }> = ({ t }) => {
  const marble = useMemo(() => makeMarbleMaterial(), []);
  const plinthMarble = useMemo(() => makeMarbleMaterial({ color: "#E7E1D7", scale: 0.9, strength: 0.45, roughness: 0.38 }), []);
  const head = useMemo(() => headGeometry(), []);
  const torso = useMemo(() => torsoGeometry(), []);
  const hair = useMemo(() => curlMesh(marble, curlSites(6111, 420, (n) => n.y > 0.32 - 0.5 * Math.max(0, -n.z) && !(n.z > 0.55 && n.y < 0.52))), [marble]);
  const beard = useMemo(
    () => curlMesh(marble, curlSites(6112, 300, (n) => n.y < -0.3 && n.z > -0.35 && !(Math.abs(n.x) < 0.2 && n.y > -0.6 && n.z > 0.7) && !(Math.abs(n.x) < 0.12 && n.y > -0.52))),
    [marble],
  );
  const socle = useMemo(() => {
    const pts = [
      [0.0, 0],
      [0.42, 0],
      [0.42, 0.05],
      [0.36, 0.08],
      [0.22, 0.14],
      [0.17, 0.22],
      [0.2, 0.27],
      [0.3, 0.3],
      [0.0, 0.3],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 64);
  }, []);

  const [hx, hy, hz] = BUST_HEAD;
  // stone is still; only light and camera move (a tiny settle keeps the subject alive at 60 fps)
  const settle = Math.sin(t * 0.5) * 0.004;

  return (
    <group>
      {/* plinth: base, shaft, cornice */}
      <mesh material={plinthMarble} position={[0, 0.08, 0]}>
        <boxGeometry args={[1.25, 0.16, 1.25]} />
      </mesh>
      <mesh material={plinthMarble} position={[0, 0.66, 0]}>
        <boxGeometry args={[1.0, 1.0, 1.0]} />
      </mesh>
      <mesh material={plinthMarble} position={[0, 1.2, 0]}>
        <boxGeometry args={[1.18, 0.1, 1.18]} />
      </mesh>
      <mesh material={plinthMarble} position={[0, 1.14, 0]}>
        <boxGeometry args={[1.1, 0.04, 1.1]} />
      </mesh>

      <group position={[0, 1.25, 0]}>
        <mesh geometry={socle} material={marble} />
        {/* torso + drapery */}
        <mesh geometry={torso} material={marble} position={[0, 0.4, 0]} scale={[0.78, 0.72, 0.72]} />
        {/* neck */}
        <mesh material={marble} position={[0, 0.9, 0.02]}>
          <cylinderGeometry args={[0.2, 0.24, 0.36, 40]} />
        </mesh>
      </group>

      <group position={[hx, hy, hz]} rotation={[0.04 + settle, -0.12, 0]} scale={0.4}>
        <mesh geometry={head} material={marble} />
        {/* hair mass under the curls (crown + back) */}
        <mesh material={marble} position={[0, 0.2, -0.12]} scale={[0.9, 0.86, 0.92]}>
          <sphereGeometry args={[1, 64, 48, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        </mesh>
        {/* beard mass under the chin */}
        <mesh material={marble} position={[0, -0.62, 0.22]} scale={[0.62, 0.5, 0.62]}>
          <sphereGeometry args={[1, 48, 36]} />
        </mesh>
        <primitive object={hair} />
        <primitive object={beard} />
      </group>
    </group>
  );
};
