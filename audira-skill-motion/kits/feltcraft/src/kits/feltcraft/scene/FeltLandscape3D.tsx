import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { easeOutBack, mulberry32, stepT, win } from "../core/motion";
import { FELTCRAFT_PALETTE as P } from "../lib/palette";
import { feltMaterial, yarnMaterial } from "../lib/materials";
import { Fuzzy, SPHERE } from "./Fuzzy";

// The stitched-fabric diorama: blue felt sky cloth, three layers of puffy felt hills with
// blanket stitches along every crest, a big felt sun button that rises in the hook, pompom
// clouds on threads, an oatmeal felt base with a running-stitch path, and foreground notions
// (yarn ball with knitting needles, wooden spool, pompom flowers).

type HillDef = { x: number; z: number; y0: number; L: number; h: number; bumps: number; seed: number; color: string; depth: number };

const HILLS: HillDef[] = [
  { x: 0, z: -3.6, y0: 0, L: 5.5, h: 2.3, bumps: 3, seed: 1, color: P.hillFar, depth: 0.35 },
  { x: 0, z: -2.2, y0: 0, L: 5.0, h: 1.45, bumps: 2, seed: 2, color: P.hillMid, depth: 0.35 },
  { x: -1.15, z: 1.05, y0: 0, L: 1.0, h: 0.95, bumps: 1, seed: 3, color: P.hillNear, depth: 0.3 },
];

const crestY = (d: HillDef, x: number) => {
  const u = (x + d.L) / (2 * d.L); // 0..1
  const env = Math.sin(Math.PI * u);
  return d.h * env * (0.78 + 0.22 * Math.cos(u * Math.PI * 2 * d.bumps + d.seed));
};

const FeltHill: React.FC<{ d: HillDef }> = ({ d }) => {
  const geo = useMemo(() => {
    const sh = new THREE.Shape();
    sh.moveTo(-d.L, 0);
    const N = 60;
    for (let i = 0; i <= N; i++) {
      const x = -d.L + (i / N) * 2 * d.L;
      sh.lineTo(x, Math.max(0.02, crestY(d, x)));
    }
    sh.lineTo(d.L, 0);
    sh.closePath();
    return new THREE.ExtrudeGeometry(sh, { depth: d.depth, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.1, bevelSegments: 5, curveSegments: 8 });
  }, [d]);
  const mat = useMemo(() => feltMaterial(d.color, 0.8), [d.color]);
  // blanket stitch: bars over the crest edge + a running thread on the front face
  const bars = useRef<THREE.InstancedMesh>(null);
  const NB = Math.round(d.L * 9);
  const thread = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 80; i++) {
      const x = -d.L * 0.92 + (i / 80) * 2 * d.L * 0.92;
      pts.push(new THREE.Vector3(x, Math.max(0.05, crestY(d, x) - 0.13), d.depth + 0.125));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 200, 0.011, 5, false);
  }, [d]);
  useLayoutEffect(() => {
    const m = bars.current;
    if (!m) return;
    const o = new THREE.Object3D();
    for (let i = 0; i < NB; i++) {
      const x = -d.L * 0.92 + ((i + 0.5) / NB) * 2 * d.L * 0.92;
      const y = crestY(d, x);
      const slope = (crestY(d, x + 0.01) - crestY(d, x - 0.01)) / 0.02;
      o.position.set(x, Math.max(0.08, y - 0.06), d.depth + 0.125);
      o.rotation.set(0, 0, Math.atan(slope));
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [d, NB]);
  return (
    <group position={[d.x, d.y0, d.z]}>
      <mesh geometry={geo} material={mat} castShadow receiveShadow />
      <mesh geometry={thread}>
        <meshStandardMaterial color={P.stitchCream} roughness={1} />
      </mesh>
      <instancedMesh ref={bars} args={[undefined, undefined, NB]} castShadow>
        <capsuleGeometry args={[0.012, 0.13, 3, 6]} />
        <meshStandardMaterial color={P.stitchCream} roughness={1} />
      </instancedMesh>
    </group>
  );
};

const SunButton: React.FC<{ t: number }> = ({ t }) => {
  const rise = easeOutBack(win(stepT(t), 0.0, 1.8), 1.2);
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: P.buttonSun, roughness: 0.35, clearcoat: 0.6, sheen: 0.4 }), []);
  return (
    <group position={[1.6, 1.4 + rise * 2.4, -3.9]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh material={mat} castShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.12, 48]} />
      </mesh>
      <mesh position={[0, -0.065, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.5, 0.04, 10, 48]} />
        <meshPhysicalMaterial color="#D8962A" roughness={0.4} />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.16, -0.07, Math.sin(a) * 0.16]}>
            <cylinderGeometry args={[0.055, 0.055, 0.02, 16]} />
            <meshBasicMaterial color="#7A4A10" />
          </mesh>
        );
      })}
      {/* cross-stitch thread through the holes */}
      {[0, 1].map((k) => (
        <mesh key={`x${k}`} position={[0, -0.075, 0]} rotation={[0, (k ? 1 : -1) * Math.PI / 4, 0]}>
          <boxGeometry args={[0.42, 0.02, 0.035]} />
          <meshStandardMaterial color={P.stitchRust} roughness={1} />
        </mesh>
      ))}
    </group>
  );
};

const PompomClouds: React.FC<{ t: number }> = ({ t }) => {
  const clouds = useMemo(() => {
    const rnd = mulberry32(5533);
    return [-2.2, -0.4, 1.4, 2.9].map((x, i) => ({ x, y: 3.3 + rnd() * 1.1, z: -2.9 + rnd() * 0.6, ph: i * 1.7, puffs: 3 + (i % 2) }));
  }, []);
  const ts = stepT(t);
  return (
    <group>
      {clouds.map((c, i) => {
        const sway = Math.sin(ts * 0.9 + c.ph) * 0.06;
        return (
          <group key={i} position={[c.x + sway, c.y + Math.sin(ts * 1.3 + c.ph) * 0.05, c.z]}>
            <mesh position={[0, 2.2, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 4.2, 5]} />
              <meshStandardMaterial color={P.stitchCream} roughness={1} />
            </mesh>
            {Array.from({ length: c.puffs }, (_, k) => (
              <Fuzzy key={k} geometry={SPHERE} color="#FFFFFF" position={[(k - (c.puffs - 1) / 2) * 0.32, k % 2 ? 0.08 : 0, 0]} scale={0.26 + (k % 2) * 0.06} shells={3} spacing={0.05} />
            ))}
          </group>
        );
      })}
    </group>
  );
};

const GroundAndPath: React.FC = () => {
  const mat = useMemo(() => feltMaterial(P.ground, 3), []);
  const pathStitches = useRef<THREE.InstancedMesh>(null);
  const N = 22;
  useLayoutEffect(() => {
    const m = pathStitches.current;
    if (!m) return;
    const o = new THREE.Object3D();
    for (let i = 0; i < N; i++) {
      const u = i / (N - 1);
      const x = -2.4 + u * 4.6;
      const z = 0.75 + Math.sin(u * 5) * 0.12;
      for (let s = -1; s <= 1; s += 2) {
        o.position.set(x, 0.012, z + s * 0.22);
        o.rotation.set(-Math.PI / 2, 0, Math.PI / 2 + Math.cos(u * 5) * 0.12);
        o.updateMatrix();
        m.setMatrixAt(i * 2 + (s > 0 ? 1 : 0), o.matrix);
      }
    }
    m.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <group>
      <mesh position={[0, -0.1, -0.5]} material={mat} receiveShadow>
        <boxGeometry args={[12, 0.2, 9]} />
      </mesh>
      <mesh position={[-0.1, 0.004, 0.75]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.8, 0.4]} />
        <meshPhysicalMaterial color={P.path} roughness={1} sheen={1} sheenColor="#FFFFFF" />
      </mesh>
      <instancedMesh ref={pathStitches} args={[undefined, undefined, N * 2]}>
        <capsuleGeometry args={[0.01, 0.08, 3, 6]} />
        <meshStandardMaterial color={P.stitchRust} roughness={1} />
      </instancedMesh>
    </group>
  );
};

const Notions: React.FC<{ t: number }> = ({ t }) => {
  const yarnBall = useMemo(() => {
    // wound yarn: a long tube along a precessing great-circle path on a sphere
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 900; i++) {
      const u = i / 900;
      const a = u * Math.PI * 2 * 26;
      const tilt = u * Math.PI * 7.3;
      const v = new THREE.Vector3(Math.cos(a), Math.sin(a), 0).applyAxisAngle(new THREE.Vector3(Math.cos(tilt), 0, Math.sin(tilt)).normalize(), tilt * 0.9);
      pts.push(v.multiplyScalar(0.5));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 2400, 0.03, 5, false);
  }, []);
  const yarnMat = useMemo(() => yarnMaterial(P.stitchRust), []);
  const ts = stepT(t);
  return (
    <group>
      {/* foreground left: yarn ball + needles */}
      <group position={[-1.75, 0.45, 2.15]}>
        <mesh geometry={yarnBall} material={yarnMat} castShadow />
        <mesh position={[0, 0, 0]} scale={0.47}>
          <sphereGeometry args={[1, 24, 16]} />
          <meshStandardMaterial color="#8E3A1F" roughness={1} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[0.1 * s, 0.35, 0]} rotation={[0.3 * s, 0, 0.5 + s * 0.15]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 1.5, 10]} />
            <meshPhysicalMaterial color="#C7B48F" roughness={0.3} clearcoat={0.8} />
          </mesh>
        ))}
      </group>
      {/* foreground right: wooden spool */}
      <group position={[1.85, 0, 1.9]} rotation={[0, 0.4, 0]}>
        {[0, 0.62].map((y) => (
          <mesh key={y} position={[0, y + 0.04, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.08, 32]} />
            <meshPhysicalMaterial color={P.spool} roughness={0.55} clearcoat={0.3} />
          </mesh>
        ))}
        <mesh position={[0, 0.36, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.56, 32]} />
          <meshPhysicalMaterial color={P.scarf} roughness={0.9} sheen={1} sheenColor="#BDEDEA" />
        </mesh>
      </group>
      {/* pompom flowers along the front */}
      {[-0.9, -0.2, 0.55, 1.3].map((x, i) => (
        <group key={i} position={[x, 0, 1.55 + (i % 2) * 0.2]} rotation={[0, 0, Math.sin(ts * 1.4 + i) * 0.06]}>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.4, 6]} />
            <meshStandardMaterial color={P.yarnGreen} roughness={1} />
          </mesh>
          <Fuzzy geometry={SPHERE} color={[P.cheek, P.buttonSun, "#FFFFFF", "#B9A0E0"][i]} position={[0, 0.44, 0]} scale={0.1} shells={3} spacing={0.08} />
        </group>
      ))}
    </group>
  );
};

export const FeltLandscape3D: React.FC<{ t: number }> = ({ t }) => {
  const sky = useMemo(() => feltMaterial(P.skyFelt, 4), []);
  return (
    <group>
      <mesh position={[0, 3, -4.6]} material={sky} receiveShadow>
        <planeGeometry args={[16, 12]} />
      </mesh>
      <SunButton t={t} />
      <PompomClouds t={t} />
      {HILLS.map((d, i) => (
        <FeltHill key={i} d={d} />
      ))}
      <GroundAndPath />
      <Notions t={t} />
    </group>
  );
};

