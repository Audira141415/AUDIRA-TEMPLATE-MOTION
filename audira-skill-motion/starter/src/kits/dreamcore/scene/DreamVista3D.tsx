import React, { useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { DREAM_PALETTE } from "../lib/palette";
import { makeEnvironment, makeRippleNormal, makeSkyMaterial } from "../lib/materials";
import { FloatingDoor3D } from "./FloatingDoor3D";
import { float, mulberry32, sunDoor } from "../core/motion";

const tmp = new THREE.Object3D();

type Cloud = { c: [number, number, number]; size: number; seed: number; drift: number };
const CLOUDS: Cloud[] = [
  // indoors: oversized clouds hanging under the tiled ceiling
  { c: [-1.4, 4.35, 6.2], size: 0.95, seed: 1, drift: 0.05 },
  { c: [1.7, 4.45, 1.4], size: 0.85, seed: 2, drift: -0.04 },
  // outside: giant, slow
  { c: [-7, 7.5, -22], size: 3.4, seed: 3, drift: 0.12 },
  { c: [7.5, 9.5, -30], size: 4.2, seed: 4, drift: -0.1 },
  { c: [-1, 5.2, -40], size: 5.2, seed: 5, drift: 0.08 },
  { c: [4.2, 2.6, -13], size: 1.3, seed: 6, drift: 0.06 },
];

/** Sky dome, endless shallow water, stairs to nowhere, doors on the water, clouds inside and out, drifting bubbles. */
export const DreamVista3D: React.FC<{ t: number }> = ({ t }) => {
  const { gl, scene } = useThree();
  const env = useMemo(() => makeEnvironment(gl), [gl]);
  useLayoutEffect(() => {
    scene.environment = env;
    scene.environmentIntensity = 0.45;
    scene.fog = new THREE.FogExp2(DREAM_PALETTE.haze, 0.013);
  }, [scene, env]);

  const sky = useMemo(() => makeSkyMaterial(), []);
  const ripple = useMemo(() => {
    const tex = makeRippleNormal();
    tex.repeat.set(60, 60);
    return tex;
  }, []);
  ripple.offset.set(t * 0.004, t * 0.006);

  const puffs = useMemo(() => {
    const list: { cloud: number; o: THREE.Vector3; r: number }[] = [];
    CLOUDS.forEach((cl, ci) => {
      const rnd = mulberry32(6410 + cl.seed);
      const n = 26;
      for (let k = 0; k < n; k++) {
        const a = rnd() * Math.PI * 2;
        const rr = Math.sqrt(rnd());
        list.push({ cloud: ci, o: new THREE.Vector3(Math.cos(a) * rr * 1.6, (rnd() - 0.3) * 0.55 * (1 - rr * 0.5), Math.sin(a) * rr * 0.9), r: 0.35 + rnd() * 0.45 * (1.2 - rr) });
      }
    });
    const mesh = new THREE.InstancedMesh(
      new THREE.SphereGeometry(1, 28, 20),
      new THREE.MeshStandardMaterial({ color: DREAM_PALETTE.cloud, roughness: 1, emissive: new THREE.Color(DREAM_PALETTE.cloudShade), emissiveIntensity: 0.12, envMapIntensity: 0.4 }),
      list.length,
    );
    mesh.frustumCulled = false;
    return { mesh, list };
  }, []);
  useLayoutEffect(() => {
    puffs.list.forEach((p, i) => {
      const cl = CLOUDS[p.cloud];
      const breathe = 1 + Math.sin(t * 0.4 + i) * 0.03;
      tmp.position.set(cl.c[0] + t * cl.drift + p.o.x * cl.size, cl.c[1] + float(t, cl.seed, 0.06) + p.o.y * cl.size, cl.c[2] + p.o.z * cl.size);
      tmp.scale.setScalar(p.r * cl.size * breathe);
      tmp.updateMatrix();
      puffs.mesh.setMatrixAt(i, tmp.matrix);
    });
    puffs.mesh.instanceMatrix.needsUpdate = true;
  });

  const bubbles = useMemo(() => {
    const rnd = mulberry32(6420);
    const mesh = new THREE.InstancedMesh(
      new THREE.SphereGeometry(1, 20, 14),
      new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.05, transparent: true, opacity: 0.28, iridescence: 1, iridescenceIOR: 1.3, envMapIntensity: 1.6, depthWrite: false }),
      48,
    );
    mesh.frustumCulled = false;
    const seeds = Array.from({ length: 48 }, () => ({ x: (rnd() - 0.5) * 5, y: rnd() * 4, z: 8 - rnd() * 16, s: 0.03 + rnd() * 0.07, v: 0.05 + rnd() * 0.1, ph: rnd() * 6.28 }));
    return { mesh, seeds };
  }, []);
  useLayoutEffect(() => {
    bubbles.seeds.forEach((b, i) => {
      tmp.position.set(b.x + Math.sin(t * 0.6 + b.ph) * 0.2, 0.3 + ((b.y + t * b.v) % 4.5), b.z);
      tmp.scale.setScalar(b.s);
      tmp.updateMatrix();
      bubbles.mesh.setMatrixAt(i, tmp.matrix);
    });
    bubbles.mesh.instanceMatrix.needsUpdate = true;
  });

  const steps = 18;
  const glow = sunDoor(t);

  return (
    <group>
      <mesh material={sky} scale={90}>
        <sphereGeometry args={[1, 48, 24]} />
      </mesh>

      {/* soft pastel light: big sky fill, low warm sun from beyond the arch */}
      <hemisphereLight args={[DREAM_PALETTE.skyZenith, DREAM_PALETTE.water, 0.35]} />
      <ambientLight intensity={0.1} color={DREAM_PALETTE.skyMid} />
      <directionalLight position={[-6, 10, -20]} intensity={1.3} color={DREAM_PALETTE.sunGlow} />
      <directionalLight position={[4, 6, 12]} intensity={0.5} color={DREAM_PALETTE.doorLilac} />

      {/* endless shallow water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -30]}>
        <planeGeometry args={[200, 200]} />
        <meshPhysicalMaterial color={DREAM_PALETTE.water} roughness={0.04} metalness={0} normalMap={ripple} normalScale={new THREE.Vector2(0.12, 0.12)} envMapIntensity={1.1} clearcoat={0.6} />
      </mesh>

      {/* stairs to nowhere, rising out of the water */}
      <group position={[2.4, 0, -8.5]} rotation={[0, -0.25, 0]}>
        {Array.from({ length: steps }, (_, i) => (
          <mesh key={i} position={[0, 0.2 * i + 0.1, -0.42 * i]}>
            <boxGeometry args={[1.5, 0.2, 0.5]} />
            <meshStandardMaterial color={DREAM_PALETTE.stair} roughness={0.5} />
          </mesh>
        ))}
        {/* stringer under the flight */}
        <mesh position={[0, 0.2 * steps * 0.5 - 0.25, -0.42 * steps * 0.5]} rotation={[Math.atan2(0.2, 0.42), 0, 0]}>
          <boxGeometry args={[1.5, 0.18, Math.hypot(0.2 * steps, 0.42 * steps)]} />
          <meshStandardMaterial color={DREAM_PALETTE.cloudShade} roughness={0.6} />
        </mesh>
        {/* the payoff: a door at the top, opening onto a brighter sky */}
        <FloatingDoor3D position={[0, 0.2 * steps, -0.42 * (steps - 1) - 0.2]} open={0.25 + glow * 0.9} glow={0.6 + glow * 1.6} leaf={DREAM_PALETTE.doorLilac} />
      </group>

      {/* doors standing in the open water */}
      <FloatingDoor3D position={[-2.9, -0.3 + float(t, 3, 0.05), -7.5]} rotationY={0.5} open={0.5 + Math.sin(t * 0.3) * 0.08} glow={0.5} leaf={DREAM_PALETTE.doorMint} />
      <FloatingDoor3D position={[-0.9, -0.35 + float(t, 4, 0.05), -16]} rotationY={-0.2} open={0.9} glow={0.6} leaf={DREAM_PALETTE.doorPink} scale={1.2} />
      <FloatingDoor3D position={[5.5, -0.3 + float(t, 5, 0.05), -12]} rotationY={-0.8} open={0.3} glow={0.4} leaf={DREAM_PALETTE.doorMint} />

      {/* a lone arch standing in the water far away */}
      <group position={[-5.5, 0, -24]}>
        {[-1.4, 1.4].map((x) => (
          <mesh key={x} position={[x, 2.2, 0]}>
            <boxGeometry args={[0.6, 4.4, 0.6]} />
            <meshStandardMaterial color={DREAM_PALETTE.stair} roughness={0.5} />
          </mesh>
        ))}
        <mesh position={[0, 4.4, 0]}>
          <torusGeometry args={[1.4, 0.3, 12, 32, Math.PI]} />
          <meshStandardMaterial color={DREAM_PALETTE.stair} roughness={0.5} />
        </mesh>
      </group>

      <primitive object={puffs.mesh} />
      <primitive object={bubbles.mesh} />
    </group>
  );
};
