import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { ABYSS_PALETTE } from "../lib/palette";
import { makeBellMaterial, makeLumenMaterial } from "../lib/materials";
import { cameraDepthY, mulberry32, pulse } from "../core/motion";

type JellySpec = { pos: [number, number, number]; size: number; lumen: string; rate: number; phase: number; seed: number };

/** Each jelly is placed just ahead of the camera at the moment it should be featured. */
const at = (time: number, x: number, z: number, size: number, lumen: string, rate: number, phase: number, seed: number): JellySpec => ({
  pos: [x, cameraDepthY(time) - 2.4, z],
  size,
  lumen,
  rate,
  phase,
  seed,
});

export const JELLIES: JellySpec[] = [
  at(0.7, -0.9, -1.2, 0.9, ABYSS_PALETTE.lumenCyan, 1.7, 0.3, 1),
  at(2.0, 1.2, -2.4, 0.7, ABYSS_PALETTE.lumenMagenta, 1.5, 1.4, 2),
  at(3.2, -1.1, -1.0, 0.85, ABYSS_PALETTE.lumenViolet, 1.3, 2.2, 3),
  at(4.4, 1.0, -1.6, 0.75, ABYSS_PALETTE.lumenCyan, 1.8, 0.9, 4),
  at(5.6, -0.9, -2.2, 0.8, ABYSS_PALETTE.lumenMagenta, 1.6, 2.7, 5),
  at(6.8, 0.6, -1.2, 0.6, ABYSS_PALETTE.lumenCyan, 1.9, 1.1, 6),
  at(7.9, -1.3, -2.6, 0.55, ABYSS_PALETTE.lumenViolet, 1.7, 0.5, 7),
  at(9.3, 1.9, -3.2, 0.45, ABYSS_PALETTE.lumenMagenta, 2.0, 1.9, 8),
];

/** Bell profile (lathe): domed top, flared skirt, slight inward lip. */
const bellGeometry = (() => {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 24; i++) {
    const a = (i / 24) * (Math.PI / 2) * 1.08;
    const r = Math.sin(a) * (1 + 0.08 * Math.sin(a * 3));
    const y = Math.cos(a) * 0.72 - (i > 20 ? (i - 20) * 0.02 : 0);
    pts.push(new THREE.Vector2(Math.max(0.001, r), y));
  }
  return new THREE.LatheGeometry(pts, 48);
})();

const tentacleCurve = (t: number, k: number, n: number, contract: number, seed: number, len: number) => {
  const a = (k / n) * Math.PI * 2;
  const pts: THREE.Vector3[] = [];
  for (let s = 0; s <= 10; s++) {
    const u = s / 10;
    const sway = Math.sin(t * 1.6 - u * 5 + k * 1.3 + seed) * 0.18 * u;
    const r = 0.92 * (1 - contract * 0.15) * (1 - u * 0.35) + sway;
    const twist = u * 0.5 * Math.sin(seed + k);
    pts.push(new THREE.Vector3(Math.cos(a + twist) * r, -u * len * (1 + contract * 0.12), Math.sin(a + twist) * r));
  }
  return new THREE.CatmullRomCurve3(pts);
};

const Jelly: React.FC<{ spec: JellySpec; t: number }> = ({ spec, t }) => {
  const c = pulse(t, spec.rate, spec.phase);
  const rise = t * 0.12 + Math.sin(t * spec.rate + spec.phase - 0.8) * 0.06;
  const bellMat = useMemo(() => makeBellMaterial(spec.lumen), [spec.lumen]);
  const innerMat = useMemo(() => makeBellMaterial(spec.lumen), [spec.lumen]);
  const rimMat = useMemo(() => makeLumenMaterial(spec.lumen, 3.2), [spec.lumen]);
  const tentMat = useMemo(() => makeLumenMaterial(spec.lumen, 1.2, 0.6), [spec.lumen]);
  const gonadMat = useMemo(() => makeLumenMaterial(ABYSS_PALETTE.lureWhite, 1.6, 0.9), []);
  const tentLens = useMemo(() => {
    const rnd = mulberry32(500 + spec.seed);
    return Array.from({ length: 14 }, () => 1.6 + rnd() * 1.6);
  }, [spec.seed]);

  // Tentacles are rebuilt per frame (tiny tubes); old geometry is disposed.
  const tentacles = useMemo(
    () => tentLens.map((len, k) => new THREE.TubeGeometry(tentacleCurve(t, k, tentLens.length, c, spec.seed, len), 20, k % 3 === 0 ? 0.018 : 0.009, 4, false)),
    [t, c, spec.seed, tentLens],
  );
  const arms = useMemo(
    () =>
      [0, 1, 2, 3].map((k) => {
        const a = (k / 4) * Math.PI * 2 + 0.4;
        const pts = Array.from({ length: 9 }, (_, s) => {
          const u = s / 8;
          const w = Math.sin(t * 1.2 - u * 4 + k) * 0.12 * u;
          return new THREE.Vector3(Math.cos(a) * (0.12 + w), -0.1 - u * 1.3, Math.sin(a) * (0.12 + w));
        });
        return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.045, 6, false);
      }),
    [t],
  );
  useEffect(() => () => [...tentacles, ...arms].forEach((g) => g.dispose()), [tentacles, arms]);

  bellMat.emissiveIntensity = 0.22 + c * 0.6;
  rimMat.color.set(spec.lumen).multiplyScalar(1.6 + c * 1.6);

  return (
    <group
      position={[spec.pos[0] + Math.sin(t * 0.3 + spec.seed) * 0.2, spec.pos[1] + rise, spec.pos[2]]}
      rotation={[Math.sin(t * 0.4 + spec.seed) * 0.15, spec.seed, Math.cos(t * 0.35 + spec.seed) * 0.12]}
      scale={spec.size}
    >
      <group scale={[1 - 0.2 * c, 1 + 0.14 * c, 1 - 0.2 * c]}>
        <mesh geometry={bellGeometry} material={bellMat} />
        <mesh geometry={bellGeometry} material={innerMat} scale={0.62} position={[0, 0.12, 0]} />
        {/* four horseshoe glow organs seen through the bell */}
        {[0, 1, 2, 3].map((k) => (
          <mesh key={k} material={gonadMat} position={[Math.cos(k * 1.571) * 0.26, 0.42, Math.sin(k * 1.571) * 0.26]} rotation={[Math.PI / 2, 0, k * 1.571]}>
            <torusGeometry args={[0.11, 0.022, 6, 20, Math.PI * 1.4]} />
          </mesh>
        ))}
        <mesh material={rimMat} position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.99, 0.022, 6, 64]} />
        </mesh>
      </group>
      {tentacles.map((g, i) => (
        <mesh key={i} geometry={g} material={tentMat} />
      ))}
      {arms.map((g, i) => (
        <mesh key={`a${i}`} geometry={g} material={innerMat} />
      ))}
      <pointLight color={spec.lumen} intensity={(1.4 + c * 2.6) * spec.size} distance={6} decay={1.6} />
    </group>
  );
};

export const Jellyfish3D: React.FC<{ t: number }> = ({ t }) => (
  <group>
    {JELLIES.map((j) => (
      <Jelly key={j.seed} spec={j} t={t} />
    ))}
  </group>
);
