import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ARCADE_PALETTE as P } from "../lib/palette";
import { canvasTex } from "../lib/materials";
import { V3, rng, ramp, smooth, easeOutBack } from "../core/motion";
import { COINS, PLATFORMS, SPRITE, SPRITE_COLORS, STAR, coinTaken, heroX, heroY, isAirborne } from "../core/game";

// The game level rebuilt as voxels: 1 game cell = 1 world unit, 1 sprite pixel = 1/8 unit,
// so the 3D world lines up with the raster the camera just dived through.
export const WORLD_ORIGIN: V3 = [0, 0, 0]; // rendered instead of the arcade once the camera is inside
const PX = 1 / 8;

const STAR_BITMAP = [
  ".....#.....",
  ".....#.....",
  "....###....",
  "....###....",
  "###########",
  ".#########.",
  "..#######..",
  "..#######..",
  ".####.####.",
  ".###...###.",
  "##.......##",
];

const tmpM = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();
const tmpE = new THREE.Euler();

const Terrain: React.FC = () => {
  const cells = useMemo(() => {
    const list: { p: V3; top: boolean; shade: boolean }[] = [];
    for (const pl of PLATFORMS)
      for (let x = Math.floor(pl.x0); x < pl.x1; x++) {
        const depth = pl.y === 0 ? 4 : 1;
        for (let d = 0; d < depth; d++)
          for (let z = -1; z <= 1; z++) list.push({ p: [x + 0.5, pl.y - 0.5 - d, z], top: d === 0, shade: (x + d + z) % 2 === 0 });
      }
    return list;
  }, []);
  const body = useRef<THREE.InstancedMesh>(null);
  const top = useRef<THREE.InstancedMesh>(null);
  const tops = useMemo(() => cells.filter((c) => c.top), [cells]);
  useLayoutEffect(() => {
    const c = new THREE.Color();
    cells.forEach((cl, i) => {
      tmpM.compose(new THREE.Vector3(...cl.p), tmpQ.identity(), new THREE.Vector3(0.97, 0.97, 0.97));
      body.current!.setMatrixAt(i, tmpM);
      body.current!.setColorAt(i, c.set(cl.shade ? P.brickShade : P.brick));
    });
    tops.forEach((cl, i) => {
      tmpM.compose(new THREE.Vector3(cl.p[0], cl.p[1] + 0.47, cl.p[2]), tmpQ.identity(), new THREE.Vector3(0.99, 0.1, 0.99));
      top.current!.setMatrixAt(i, tmpM);
    });
    body.current!.instanceMatrix.needsUpdate = true;
    if (body.current!.instanceColor) body.current!.instanceColor.needsUpdate = true;
    top.current!.instanceMatrix.needsUpdate = true;
  }, [cells, tops]);
  return (
    <group>
      <instancedMesh ref={body} args={[undefined, undefined, cells.length]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.55} metalness={0.05} />
      </instancedMesh>
      <instancedMesh ref={top} args={[undefined, undefined, tops.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={P.grass} emissive={P.grass} emissiveIntensity={0.7} roughness={0.4} toneMapped={false} />
      </instancedMesh>
    </group>
  );
};

const Hero: React.FC<{ t: number }> = ({ t }) => {
  const vox = useMemo(() => {
    const list: { i: number; j: number; col: string }[] = [];
    SPRITE.forEach((row, j) => [...row].forEach((ch, i) => ch !== "." && list.push({ i, j, col: SPRITE_COLORS[ch] })));
    return list;
  }, []);
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const c = new THREE.Color();
    const hx = heroX(t);
    const hy = heroY(t);
    const legsAlt = !isAirborne(t) && Math.floor(t * 10) % 2 === 0;
    vox.forEach((v, k) => {
      let ii = v.i;
      if (legsAlt && v.j >= 11) ii = v.i + (v.i < 6 ? 1 : -1);
      for (let d = 0; d < 2; d++) {
        tmpM.compose(new THREE.Vector3(hx - 0.75 + (ii + 0.5) * PX, hy + (13 - v.j + 0.5) * PX, (d - 0.5) * PX), tmpQ.identity(), new THREE.Vector3(PX, PX, PX));
        ref.current!.setMatrixAt(k * 2 + d, tmpM);
        ref.current!.setColorAt(k * 2 + d, c.set(v.col));
      }
    });
    ref.current!.instanceMatrix.needsUpdate = true;
    if (ref.current!.instanceColor) ref.current!.instanceColor.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, vox.length * 2]} castShadow frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.35} emissive="#FFFFFF" emissiveIntensity={0.08} />
    </instancedMesh>
  );
};

const Coins: React.FC<{ t: number }> = ({ t }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    COINS.forEach(([x, y], i) => {
      const taken = coinTaken(t, x);
      const pop = taken ? 1 - smooth(ramp(heroX(t) - x, -0.2, 0.6)) : 1;
      tmpE.set(Math.PI / 2, t * 4 + x, 0);
      tmpQ.setFromEuler(tmpE);
      const s = pop;
      tmpM.compose(new THREE.Vector3(x, y + (taken ? (1 - pop) * 1.2 : Math.sin(t * 3 + x) * 0.08), 0), tmpQ, new THREE.Vector3(s, s, s));
      ref.current!.setMatrixAt(i, tmpM);
    });
    ref.current!.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COINS.length]} frustumCulled={false}>
      <cylinderGeometry args={[0.32, 0.32, 0.1, 8]} />
      <meshStandardMaterial color={P.yellow} emissive={P.yellow} emissiveIntensity={0.6} metalness={0.5} roughness={0.3} toneMapped={false} />
    </instancedMesh>
  );
};

const GoalStar: React.FC<{ t: number }> = ({ t }) => {
  const cubes = useMemo(() => {
    const list: [number, number][] = [];
    STAR_BITMAP.forEach((row, j) => [...row].forEach((ch, i) => ch === "#" && list.push([i - 5, 5 - j])));
    return list;
  }, []);
  const PARTS = 48;
  const burst = useMemo(() => {
    const r = rng(77);
    return Array.from({ length: PARTS }, () => new THREE.Vector3(r() - 0.5, r() - 0.3, r() - 0.5).normalize().multiplyScalar(2 + r() * 4));
  }, []);
  const ref = useRef<THREE.InstancedMesh>(null);
  const parts = useRef<THREE.InstancedMesh>(null);
  const grab = 10.1;
  const label = useMemo(
    () =>
      canvasTex(512, 160, (ctx) => {
        ctx.font = "900 120px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = P.magenta;
        ctx.fillText("+5000", 262, 86);
        ctx.fillStyle = P.yellow;
        ctx.fillText("+5000", 254, 78);
      }, true),
    [],
  );
  useLayoutEffect(() => {
    const s = t < grab ? 1 + Math.sin(t * 8) * 0.06 : 0;
    tmpE.set(0, t * 1.6, 0);
    tmpQ.setFromEuler(tmpE);
    const center = new THREE.Vector3(STAR[0], STAR[1], 0);
    cubes.forEach(([i, j], k) => {
      const p = new THREE.Vector3(i * 0.16, j * 0.16, 0).applyQuaternion(tmpQ).multiplyScalar(s).add(center);
      tmpM.compose(p, tmpQ, new THREE.Vector3(0.16 * s, 0.16 * s, 0.3 * s));
      ref.current!.setMatrixAt(k, tmpM);
    });
    ref.current!.instanceMatrix.needsUpdate = true;
    const k = Math.max(0, t - grab);
    burst.forEach((v, i) => {
      const live = t >= grab ? 1 - smooth(ramp(k, 0.8, 1.6)) : 0;
      const p = center.clone().addScaledVector(v, k * Math.exp(-k * 0.8));
      p.y -= k * k * 0.8;
      tmpE.set(k * 5 + i, k * 3, 0);
      tmpM.compose(p, new THREE.Quaternion().setFromEuler(tmpE), new THREE.Vector3(0.14 * live, 0.14 * live, 0.14 * live));
      parts.current!.setMatrixAt(i, tmpM);
    });
    parts.current!.instanceMatrix.needsUpdate = true;
  });
  const labelK = t >= grab ? easeOutBack(ramp(t, grab, grab + 0.4), 2) * (1 - smooth(ramp(t, 11.5, 12))) : 0;
  return (
    <group>
      <instancedMesh ref={ref} args={[undefined, undefined, cubes.length]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={P.yellow} emissive={P.yellow} emissiveIntensity={1.1} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={parts} args={[undefined, undefined, PARTS]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={P.yellow} toneMapped={false} />
      </instancedMesh>
      {labelK > 0 && (
        <mesh position={[STAR[0] + 0.4, STAR[1] + 0.9 + (t - grab) * 0.25, 0.6]} scale={labelK}>
          <planeGeometry args={[3.2, 1]} />
          <meshBasicMaterial map={label} transparent toneMapped={false} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
};

const Backdrop: React.FC<{ t: number }> = ({ t }) => {
  const N = 260;
  const ref = useRef<THREE.InstancedMesh>(null);
  const stars = useMemo(() => {
    const r = rng(9);
    return Array.from({ length: N }, () => ({ p: [-20 + r() * 80, -2 + r() * 26, -14 - r() * 30] as V3, s: 0.08 + r() * 0.16, ph: r() * 6, col: r() > 0.85 ? P.yellow : r() > 0.7 ? P.cyan : P.white }));
  }, []);
  const sky = useMemo(
    () =>
      canvasTex(16, 256, (ctx) => {
        const g = ctx.createLinearGradient(0, 0, 0, 256);
        g.addColorStop(0, "#06041A");
        g.addColorStop(0.6, P.gameSky);
        g.addColorStop(1, "#3A0F5E");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 16, 256);
      }),
    [],
  );
  useLayoutEffect(() => {
    const c = new THREE.Color();
    stars.forEach((s, i) => {
      const tw = 0.6 + 0.4 * (Math.floor(t * 6 + s.ph * 3) % 2);
      tmpM.compose(new THREE.Vector3(...s.p), tmpQ.identity(), new THREE.Vector3(s.s, s.s, s.s));
      ref.current!.setMatrixAt(i, tmpM);
      ref.current!.setColorAt(i, c.set(s.col).multiplyScalar(tw));
    });
    ref.current!.instanceMatrix.needsUpdate = true;
    if (ref.current!.instanceColor) ref.current!.instanceColor.needsUpdate = true;
  });
  return (
    <group>
      <mesh position={[20, 8, -60]}>
        <planeGeometry args={[220, 90]} />
        <meshBasicMaterial map={sky} toneMapped={false} />
      </mesh>
      <instancedMesh ref={ref} args={[undefined, undefined, N]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <group position={[52, 17, -70]} rotation={[0.3, t * 0.1, 0.25]}>
        <mesh>
          <icosahedronGeometry args={[5, 1]} />
          <meshStandardMaterial color={P.magenta} flatShading roughness={0.6} emissive={P.magenta} emissiveIntensity={0.25} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[8, 0.35, 4, 24]} />
          <meshStandardMaterial color={P.orange} flatShading emissive={P.orange} emissiveIntensity={0.5} />
        </mesh>
      </group>
    </group>
  );
};

export const PixelWorld3D: React.FC<{ t: number }> = ({ t }) => (
  <group position={WORLD_ORIGIN}>
    <ambientLight intensity={0.55} color="#B9A8FF" />
    <directionalLight position={[8, 14, 10]} intensity={1.6} color="#FFF1E0" />
    <directionalLight position={[-6, 4, -8]} intensity={0.8} color={P.cyan} />
    <Backdrop t={t} />
    <Terrain />
    <Coins t={t} />
    <GoalStar t={t} />
    <Hero t={t} />
  </group>
);
