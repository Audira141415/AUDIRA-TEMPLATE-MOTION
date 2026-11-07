// ANATOMIX — stylised heart: deformed-sphere myocardium (translucent after the reveal), four chambers,
// valves, great vessels as glass tubes, coronary arteries on the surface. Beats at 72 BPM (lub-dub).
import React, { useMemo } from "react";
import * as THREE from "three";
import { ANATOMY_PALETTE as P } from "../lib/palette";
import { makeVesselMaterial, makeWallMaterial } from "../lib/materials";
import { beat, heartify, TL, seg, VESSELS, wallOpacity } from "../core/motion";

const buildHeartGeometry = (inflate = 1) => {
  const g = new THREE.SphereGeometry(1, 96, 72);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    heartify(v).multiplyScalar(inflate);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
};

/** Points on the heart surface along a (theta, phi) path, lifted slightly: coronary arteries. */
const surfaceCurve = (pts: [number, number][]) =>
  new THREE.CatmullRomCurve3(
    pts.map(([th, ph]) => heartify(new THREE.Vector3(Math.sin(ph) * Math.cos(th), Math.cos(ph), Math.sin(ph) * Math.sin(th)).multiplyScalar(1.01))),
  );

const Chamber: React.FC<{ pos: [number, number, number]; scale: [number, number, number]; color: string; squeeze: number; o: number }> = ({
  pos,
  scale,
  color,
  squeeze,
  o,
}) => (
  <mesh position={pos} scale={[scale[0] * (1 - squeeze), scale[1] * (1 - squeeze * 0.6), scale[2] * (1 - squeeze)]}>
    <sphereGeometry args={[1, 40, 28]} />
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.4} transparent opacity={o} depthWrite={false} />
  </mesh>
);

export const Heart3D: React.FC<{ t: number }> = ({ t }) => {
  const geo = useMemo(() => buildHeartGeometry(), []);
  const wall = useMemo(() => makeWallMaterial(), []);
  const vessels = useMemo(() => {
    const tube = (c: THREE.Curve<THREE.Vector3>, r: number) => new THREE.TubeGeometry(c, 64, r, 20, false);
    return {
      aorta: tube(VESSELS.aorta, 0.15),
      brachio: tube(VESSELS.brachio, 0.065),
      carotid: tube(VESSELS.carotid, 0.055),
      pulmonary: tube(VESSELS.pulmonary, 0.13),
      pulmonaryR: tube(VESSELS.pulmonaryR, 0.1),
      svc: tube(VESSELS.svc, 0.11),
      ivc: tube(VESSELS.ivc, 0.12),
      pvein1: tube(VESSELS.pvein1, 0.065),
      pvein2: tube(VESSELS.pvein2, 0.065),
      lad: new THREE.TubeGeometry(surfaceCurve([[1.45, 0.55], [1.35, 1.0], [1.15, 1.6], [0.9, 2.3], [0.6, 2.8]]), 48, 0.022, 8, false),
      rca: new THREE.TubeGeometry(surfaceCurve([[1.9, 0.75], [2.4, 1.1], [2.9, 1.5], [3.4, 1.9]]), 48, 0.02, 8, false),
    };
  }, []);
  const mats = useMemo(
    () => ({
      red: makeVesselMaterial(P.oxyVessel, 0.5),
      blue: makeVesselMaterial(P.deoxyVessel, 0.5),
      vein: makeVesselMaterial(P.vein, 0.55),
      coronary: new THREE.MeshStandardMaterial({ color: P.coronary, roughness: 0.4 }),
    }),
    [],
  );

  const b = beat(t);
  const op = wallOpacity(t);
  wall.opacity = op;
  wall.depthWrite = op > 0.95;
  const pump = 1 + 0.045 * b.lub + 0.022 * b.dub;
  const inner = seg(t, TL.reveal[0], TL.reveal[1]);
  const cOp = 0.25 + 0.55 * inner;

  return (
    <group scale={[pump, pump * (1 - 0.012 * b.lub), pump]}>
      {/* chambers: right (blue) on the patient's right = -x; left (red) = +x */}
      <Chamber pos={[-0.47, 0.32, 0.06]} scale={[0.36, 0.33, 0.34]} color={P.deoxy} squeeze={0.1 * b.dub} o={cOp} />
      <Chamber pos={[-0.22, -0.32, 0.2]} scale={[0.36, 0.55, 0.3]} color={P.deoxy} squeeze={0.14 * b.lub} o={cOp} />
      <Chamber pos={[0.42, 0.36, -0.16]} scale={[0.33, 0.3, 0.3]} color={P.oxy} squeeze={0.1 * b.dub} o={cOp} />
      <Chamber pos={[0.26, -0.36, -0.03]} scale={[0.38, 0.62, 0.34]} color={P.oxy} squeeze={0.16 * b.lub} o={cOp} />
      {/* atrioventricular valves */}
      {[
        [-0.36, 0.02, 0.14],
        [0.36, 0.06, -0.1],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation={[Math.PI / 2 - 0.2, 0, 0.3]}>
          <torusGeometry args={[0.16, 0.022, 10, 40]} />
          <meshStandardMaterial color={P.valve} roughness={0.3} transparent opacity={0.4 + 0.5 * inner} />
        </mesh>
      ))}

      {/* great vessels */}
      <mesh geometry={vessels.aorta} material={mats.red} />
      <mesh geometry={vessels.brachio} material={mats.red} />
      <mesh geometry={vessels.carotid} material={mats.red} />
      <mesh geometry={vessels.pulmonary} material={mats.blue} />
      <mesh geometry={vessels.pulmonaryR} material={mats.blue} />
      <mesh geometry={vessels.svc} material={mats.blue} />
      <mesh geometry={vessels.ivc} material={mats.blue} />
      <mesh geometry={vessels.pvein1} material={mats.vein} />
      <mesh geometry={vessels.pvein2} material={mats.vein} />

      {/* myocardium + coronary arteries */}
      <mesh geometry={geo} material={wall} renderOrder={5} />
      <mesh geometry={vessels.lad} material={mats.coronary} />
      <mesh geometry={vessels.rca} material={mats.coronary} />
    </group>
  );
};
