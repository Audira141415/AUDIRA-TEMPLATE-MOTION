import React, { useMemo } from "react";
import * as THREE from "three";
import { APPLE_DROP, BUMP, CATCH, HEARTS, clamp01, easeOutBack, mulberry32, stepT, win } from "../core/motion";
import { FELTCRAFT_PALETTE as P } from "../lib/palette";
import { feltMaterial, yarnMaterial } from "../lib/materials";
import { Fuzzy, SPHERE } from "./Fuzzy";

// Yarn tree: a trunk wrapped in brown yarn coils and a canopy of wound green yarn balls, with
// felt apples. The fox bumps it, it shakes (on twos), one apple drops into the fox's paws, and
// felt hearts pop on the payoff.

export const TREE_POS = new THREE.Vector3(1.45, 0, -0.25);

const coil = (radius: number, height: number, turns: number) => {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= turns * 24; i++) {
    const u = i / (turns * 24);
    const a = u * turns * Math.PI * 2;
    const r = radius * (1 - u * 0.25);
    pts.push(new THREE.Vector3(Math.cos(a) * r, u * height, Math.sin(a) * r));
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), turns * 40, 0.028, 5, false);
};

const woundBall = (r: number, seed: number) => {
  const rnd = mulberry32(seed);
  const pts: THREE.Vector3[] = [];
  const axis = new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize();
  for (let i = 0; i < 520; i++) {
    const u = i / 520;
    const a = u * Math.PI * 2 * 17;
    const tilt = u * Math.PI * 5.1;
    const ax = axis.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), tilt);
    pts.push(new THREE.Vector3(Math.cos(a), Math.sin(a), 0).applyAxisAngle(ax, tilt).multiplyScalar(r));
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 1400, 0.032, 5, false);
};

const CANOPY = [
  { p: [0, 1.75, 0], r: 0.62 },
  { p: [-0.5, 1.45, 0.1], r: 0.45 },
  { p: [0.5, 1.5, -0.05], r: 0.48 },
  { p: [0.05, 2.25, -0.05], r: 0.42 },
] as const;

const APPLES: [number, number, number][] = [
  [-0.32, 1.32, 0.42],
  [0.42, 1.95, 0.4],
  [0.55, 1.35, 0.35],
  [-0.15, 2.1, 0.35],
];

export const FeltApple: React.FC = () => {
  const leaf = useMemo(() => feltMaterial(P.yarnGreen, 1), []);
  return (
    <group>
      <Fuzzy geometry={SPHERE} color={P.apple} scale={[0.15, 0.14, 0.15]} shells={3} spacing={0.05} />
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.08, 6]} />
        <meshStandardMaterial color={P.yarnBrown} roughness={1} />
      </mesh>
      <mesh position={[0.06, 0.17, 0]} rotation={[0, 0, -0.8]} scale={[0.07, 0.03, 0.012]} geometry={SPHERE} material={leaf} />
    </group>
  );
};

const heartGeo = (() => {
  const s = new THREE.Shape();
  s.moveTo(0, -0.1);
  s.bezierCurveTo(0.02, -0.07, 0.11, -0.02, 0.11, 0.03);
  s.bezierCurveTo(0.11, 0.08, 0.05, 0.1, 0, 0.06);
  s.bezierCurveTo(-0.05, 0.1, -0.11, 0.08, -0.11, 0.03);
  s.bezierCurveTo(-0.11, -0.02, -0.02, -0.07, 0, -0.1);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 3 });
  g.center();
  return g;
})();

export const YarnTree3D: React.FC<{ t: number; foxHand: THREE.Vector3 }> = ({ t, foxHand }) => {
  const ts = stepT(t);
  const trunk = useMemo(() => coil(0.16, 1.25, 16), []);
  const balls = useMemo(() => CANOPY.map((c, i) => woundBall(c.r, 5600 + i)), []);
  const trunkMat = useMemo(() => yarnMaterial(P.yarnBrown), []);
  const leafMat = useMemo(() => yarnMaterial(P.yarnGreen), []);
  const coreMat = useMemo(() => feltMaterial("#3F6E3B", 1), []);
  const heartMat = useMemo(() => feltMaterial(P.cheek, 1), []);
  const shakeA = ts - BUMP;
  const shake = shakeA > 0 ? Math.sin(shakeA * 40) * Math.exp(-shakeA * 3.5) * 0.08 : 0;

  // falling apple: index 2 drops from the canopy to the fox hand, then the fox holds it
  const drop = APPLES[2];
  const fallP = clamp01((ts - APPLE_DROP[0]) / (APPLE_DROP[1] - APPLE_DROP[0]));
  const start = new THREE.Vector3(...drop).add(TREE_POS);
  const fallPos = start.clone().lerp(foxHand, fallP * fallP);
  fallPos.y += Math.sin(fallP * Math.PI) * 0.25;

  const hearts = ts > HEARTS ? [0, 1, 2, 3, 4] : [];
  return (
    <group>
      <group position={TREE_POS} rotation={[0, 0, shake]}>
        <mesh geometry={trunk} material={trunkMat} castShadow />
        <mesh position={[0, 0.62, 0]} material={trunkMat}>
          <cylinderGeometry args={[0.13, 0.17, 1.25, 16]} />
        </mesh>
        {CANOPY.map((c, i) => (
          <group key={i} position={c.p as unknown as [number, number, number]} rotation={[0, i, shake * 2]}>
            <mesh geometry={balls[i]} material={leafMat} castShadow receiveShadow />
            <mesh material={coreMat} scale={c.r * 0.93}>
              <sphereGeometry args={[1, 24, 16]} />
            </mesh>
          </group>
        ))}
        {APPLES.map((a, i) =>
          i === 2 && ts >= APPLE_DROP[0] ? null : (
            <group key={i} position={[a[0], a[1] + (i % 2 ? shake : -shake) * 0.5, a[2]]}>
              <FeltApple />
            </group>
          ),
        )}
      </group>
      {ts >= APPLE_DROP[0] && ts < CATCH && (
        <group position={fallPos} rotation={[0, 0, fallP * 3]}>
          <FeltApple />
        </group>
      )}
      {hearts.map((k) => {
        const a = ts - HEARTS - k * 0.12;
        if (a < 0) return null;
        const pop = easeOutBack(win(a, 0, 0.35));
        const ang = -0.9 + k * 0.45;
        return (
          <mesh
            key={k}
            geometry={heartGeo}
            material={heartMat}
            position={[foxHand.x + Math.sin(ang) * (0.35 + a * 0.35), foxHand.y + 0.45 + a * 0.5, foxHand.z + 0.15]}
            rotation={[0, 0, -ang * 0.5]}
            scale={pop * 0.85}
            castShadow
          />
        );
      })}
    </group>
  );
};
