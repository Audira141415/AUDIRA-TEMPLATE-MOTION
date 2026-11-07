import React, { useMemo } from "react";
import * as THREE from "three";
import { ABYSS_PALETTE } from "../lib/palette";
import { makeHideMaterial, makeLumenMaterial } from "../lib/materials";
import { lureLight, mulberry32, smooth } from "../core/motion";

/** World position of the payoff creature (original "lanternmaw", an anglerfish-like predator). */
export const ANGLER_POS: [number, number, number] = [0.5, -37.9, -1.6];

/** Lumpy hide: sphere with seeded bumps so the lure light rakes across a textured skin. */
const hideGeometry = () => {
  const geo = new THREE.SphereGeometry(1, 72, 54);
  const rnd = mulberry32(5210);
  const bumps = Array.from({ length: 40 }, () => new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize());
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    let h = 0;
    for (const b of bumps) h += Math.exp(-v.distanceToSquared(b) * 60) * 0.035;
    h += Math.sin(v.x * 23) * Math.sin(v.y * 19) * 0.008;
    v.multiplyScalar(1 + h);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
};

const finShape = () => {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.quadraticCurveTo(0.5, 0.5, 0.9, 0.2);
  s.quadraticCurveTo(0.7, -0.05, 0.95, -0.35);
  s.quadraticCurveTo(0.4, -0.3, 0, 0);
  return new THREE.ShapeGeometry(s, 16);
};

export const Lanternmaw3D: React.FC<{ t: number }> = ({ t }) => {
  const hide = useMemo(() => hideGeometry(), []);
  const hideMat = useMemo(() => makeHideMaterial(), []);
  const fin = useMemo(() => finShape(), []);
  const finMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#16212B", roughness: 0.5, transparent: true, opacity: 0.7, side: THREE.DoubleSide }),
    [],
  );
  const mouthMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#14040A", roughness: 0.7 }), []);
  const toothMat = useMemo(() => new THREE.MeshStandardMaterial({ color: ABYSS_PALETTE.toothIvory, roughness: 0.25, metalness: 0.05 }), []);
  const photoMat = useMemo(() => makeLumenMaterial(ABYSS_PALETTE.lumenCyan, 2.5), []);
  const eyeMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#9FD8E8", roughness: 0.05, metalness: 0.6, emissive: "#1B5568", emissiveIntensity: 0.6 }), []);

  const lure = lureLight(t);
  const escaMat = useMemo(() => makeLumenMaterial(ABYSS_PALETTE.lureWhite, 1), []);
  escaMat.color.set(ABYSS_PALETTE.lureWhite).multiplyScalar(0.2 + lure * 1.05);
  const haloMat = useMemo(() => makeLumenMaterial(ABYSS_PALETTE.lumenCyan, 1, 0.5), []);
  haloMat.opacity = 0.05 * lure;

  // Teeth along upper + lower jaw arcs (needle fangs, pointing inward)
  const teeth = useMemo(() => {
    const rnd = mulberry32(5211);
    const out: { p: [number, number, number]; r: [number, number, number]; s: number }[] = [];
    for (const [jawY, dir] of [[0.02, -1], [-0.62, 1]] as const) {
      for (let k = 0; k < 13; k++) {
        const a = -1.15 + (k / 12) * 2.3;
        const R = jawY < 0 ? 0.78 : 0.7;
        out.push({ p: [Math.sin(a) * R, jawY, Math.cos(a) * R * 0.65 + (jawY < 0 ? 0.92 : 0.85)], r: [dir > 0 ? 0 : Math.PI, 0, (rnd() - 0.5) * 0.4], s: 0.6 + rnd() * 0.9 });
      }
    }
    return out;
  }, []);

  const stalk = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.95, 0.35),
      new THREE.Vector3(0.05, 1.7, 0.6),
      new THREE.Vector3(0.0, 2.05, 1.4),
      new THREE.Vector3(-0.05, 1.75, 2.05),
    ]);
    return new THREE.TubeGeometry(curve, 40, 0.025, 6, false);
  }, []);

  const photophores = useMemo(() => {
    const rnd = mulberry32(5212);
    return Array.from({ length: 18 }, (_, i) => {
      const side = i % 2 === 0 ? 1 : -1;
      const u = rnd();
      return [side * (1.22 + rnd() * 0.05), -0.35 - u * 0.25, 0.4 - u * 1.4] as [number, number, number];
    });
  }, []);

  // The creature glides in slightly and opens its jaw as the lure ignites
  const approach = smooth(7.5, 12, t);
  const jaw = 0.12 + 0.22 * smooth(9.2, 10.6, t) + Math.sin(t * 2.2) * 0.02;
  const sway = Math.sin(t * 0.9) * 0.08;

  return (
    <group position={[ANGLER_POS[0], ANGLER_POS[1] + Math.sin(t * 0.7) * 0.08, ANGLER_POS[2] + approach * 0.7]} rotation={[0.08, -0.25 + sway, 0]}>
      {/* faint cold rim so the silhouette separates from the black water */}
      <directionalLight position={[-3, 2, -4]} intensity={1.2 * smooth(8.6, 10, t)} color={ABYSS_PALETTE.lumenCyan} />
      {/* head/body */}
      <mesh geometry={hide} material={hideMat} scale={[1.25, 1.05, 1.3]} />
      {/* upper jaw overhang */}
      <mesh geometry={hide} material={hideMat} scale={[0.95, 0.42, 0.75]} position={[0, 0.12, 0.72]} />
      {/* gaping mouth cavity */}
      <mesh material={mouthMat} scale={[0.82, 0.5 + jaw, 0.45]} position={[0, -0.28, 0.95]}>
        <sphereGeometry args={[1, 40, 28]} />
      </mesh>
      {/* lower jaw, hinged */}
      <group position={[0, -0.32, 0.2]} rotation={[jaw, 0, 0]}>
        <mesh geometry={hide} material={hideMat} scale={[0.98, 0.32, 0.95]} position={[0, -0.3, 0.55]} />
      </group>
      {teeth.map((th, i) => (
        <mesh key={i} material={toothMat} position={[th.p[0], th.p[1] + (th.p[1] < 0 ? -jaw * 0.6 : 0), th.p[2]]} rotation={th.r} scale={th.s}>
          <coneGeometry args={[0.028, 0.26, 6]} />
        </mesh>
      ))}
      {/* eyes */}
      {[-1, 1].map((s) => (
        <mesh key={s} material={eyeMat} position={[s * 0.62, 0.48, 0.92]}>
          <sphereGeometry args={[0.085, 20, 16]} />
        </mesh>
      ))}
      {/* pectoral fins + tail */}
      {[-1, 1].map((s) => (
        <mesh key={`f${s}`} geometry={fin} material={finMat} position={[s * 1.15, -0.3, -0.1]} rotation={[0, s > 0 ? -0.5 : Math.PI + 0.5, Math.sin(t * 2 + s) * 0.25]} scale={0.8} />
      ))}
      <mesh geometry={fin} material={finMat} position={[0, 0, -1.25]} rotation={[0, Math.PI / 2, Math.sin(t * 1.5) * 0.2]} scale={1.1} />
      {/* lateral photophores */}
      {photophores.map((p, i) => (
        <mesh key={`p${i}`} material={photoMat} position={p}>
          <sphereGeometry args={[0.022, 8, 8]} />
        </mesh>
      ))}
      {/* the lure: stalk, glowing esca, halo and the light it casts */}
      <mesh geometry={stalk} material={hideMat} />
      <group position={[-0.05, 1.75, 2.05]}>
        <mesh material={escaMat}>
          <sphereGeometry args={[0.09, 24, 18]} />
        </mesh>
        <mesh material={haloMat}>
          <sphereGeometry args={[0.32, 20, 14]} />
        </mesh>
        <pointLight color={ABYSS_PALETTE.lureWhite} intensity={lure * 14} distance={7} decay={1.2} />
      </group>
    </group>
  );
};
