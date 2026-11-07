import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { COMIC_PALETTE as P } from "../lib/palette";
import { makeCanvasTexture } from "../lib/materials";
import { ComicState, DRONE_HIT, HERO_START, HERO_TARGET, V3, easeOutBack, rng, smooth } from "../core/motion";
import { ComicMats, Inked } from "./Ink";

const Billboard: React.FC<{ position: V3; cam: V3; children: React.ReactNode; scale?: number }> = ({ position, cam, children, scale = 1 }) => {
  const ref = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    ref.current!.lookAt(cam[0], cam[1], cam[2]);
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      {children}
    </group>
  );
};

const starShape = (spikes: number, rOut: number, rIn: number, seed: number) => {
  const r = rng(seed);
  const s = new THREE.Shape();
  for (let i = 0; i <= spikes * 2; i++) {
    const a = (i / (spikes * 2)) * Math.PI * 2;
    const rad = i % 2 === 0 ? rOut * (0.75 + r() * 0.35) : rIn * (0.85 + r() * 0.2);
    const x = Math.cos(a) * rad;
    const y = Math.sin(a) * rad * 0.82;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  return new THREE.ShapeGeometry(s);
};

// ---------- villain: an original rogue spike-drone ----------
const Drone: React.FC<{ s: ComicState; mats: ComicMats }> = ({ s, mats }) => {
  const g = useMemo(
    () => ({
      core: new THREE.SphereGeometry(0.62, 24, 18),
      ring: new THREE.TorusGeometry(0.9, 0.09, 10, 36),
      spike: new THREE.ConeGeometry(0.11, 0.42, 8),
      eye: new THREE.SphereGeometry(0.24, 16, 12),
      pupil: new THREE.SphereGeometry(0.11, 12, 10),
    }),
    [],
  );
  if (s.droneAlive < 0.5) return null;
  const spin = s.t * 1.4;
  return (
    <group position={s.dronePos} rotation={[0.25, -0.6, 0]}>
      <Inked geometry={g.core} material={mats.drone} outline={mats.outlineThick} />
      <group rotation={[Math.PI / 2 + 0.3, spin, 0]}>
        <Inked geometry={g.ring} material={mats.steel} outline={mats.outline} />
      </group>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 + spin * 0.5;
        return <Inked key={i} geometry={g.spike} material={mats.steel} outline={mats.outlineThin} position={[Math.cos(a) * 0.72, Math.sin(a) * 0.72, 0]} rotation={[0, 0, a - Math.PI / 2]} />;
      })}
      <Inked geometry={g.eye} material={mats.yellow} outline={mats.outline} position={[0, 0, 0.5]} />
      <mesh geometry={g.pupil} material={mats.ink} position={[0, 0, 0.68]} />
    </group>
  );
};

// ---------- shards of the drone after the punch ----------
const SHARDS = 42;
const Shards: React.FC<{ s: ComicState; mats: ComicMats }> = ({ s, mats }) => {
  const body = useRef<THREE.InstancedMesh>(null);
  const hull = useRef<THREE.InstancedMesh>(null);
  const seeds = useMemo(() => {
    const r = rng(68);
    return Array.from({ length: SHARDS }, () => {
      const v = new THREE.Vector3(r() - 0.5, r() - 0.35, r() - 0.6).normalize().multiplyScalar(2.5 + r() * 4);
      return { v, spin: new THREE.Vector3(r() * 6, r() * 6, r() * 6), size: 0.12 + r() * 0.22 };
    });
  }, []);
  const geo = useMemo(() => new THREE.TetrahedronGeometry(1, 0), []);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const tt = s.boom * 3.2;
    const on = s.boom > 0 ? 1 : 0;
    seeds.forEach((sd, i) => {
      const p = new THREE.Vector3(DRONE_HIT[0], DRONE_HIT[1], DRONE_HIT[2]).addScaledVector(sd.v, tt * Math.exp(-tt * 0.35));
      p.y -= 0.9 * tt * tt * 0.25;
      e.set(sd.spin.x * tt, sd.spin.y * tt, sd.spin.z * tt);
      q.setFromEuler(e);
      const sc = sd.size * on * (1 - smooth((tt - 2.4) / 0.8));
      m.compose(p, q, new THREE.Vector3(sc, sc, sc));
      body.current!.setMatrixAt(i, m);
      hull.current!.setMatrixAt(i, m);
    });
    body.current!.instanceMatrix.needsUpdate = true;
    hull.current!.instanceMatrix.needsUpdate = true;
  });
  return (
    <group>
      <instancedMesh ref={body} args={[geo, mats.drone, SHARDS]} frustumCulled={false} />
      <instancedMesh ref={hull} args={[geo, mats.outline, SHARDS]} frustumCulled={false} />
    </group>
  );
};

// ---------- onomatopoeia burst + radial action lines ----------
const Burst: React.FC<{ s: ComicState; cam: V3 }> = ({ s, cam }) => {
  const g = useMemo(() => ({ outer: starShape(14, 2.3, 1.45, 3), mid: starShape(14, 2.05, 1.3, 3), inner: starShape(11, 1.45, 0.95, 9) }), []);
  const word = useMemo(
    () =>
      makeCanvasTexture(1024, 512, (ctx) => {
        ctx.translate(512, 256);
        ctx.rotate(-0.12);
        ctx.font = "italic 900 200px Impact, 'Arial Black', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.lineJoin = "round";
        ctx.lineWidth = 34;
        ctx.strokeStyle = P.ink;
        ctx.strokeText("KRA-KOOM!", 0, 10);
        ctx.fillStyle = P.yellow;
        ctx.fillText("KRA-KOOM!", 0, 10);
        ctx.lineWidth = 6;
        ctx.strokeStyle = P.red;
        ctx.strokeText("KRA-KOOM!", 0, 10);
      }),
    [],
  );
  const rays = useMemo(
    () =>
      makeCanvasTexture(1024, 1024, (ctx) => {
        const r = rng(12);
        ctx.translate(512, 512);
        for (let i = 0; i < 90; i++) {
          const a = (i / 90) * Math.PI * 2 + r() * 0.03;
          const w = 0.006 + r() * 0.014;
          ctx.fillStyle = i % 3 === 0 ? P.yellow : "#FFFFFF";
          ctx.beginPath();
          ctx.moveTo(Math.cos(a - w) * 120, Math.sin(a - w) * 120);
          ctx.lineTo(Math.cos(a) * 512, Math.sin(a) * 512);
          ctx.lineTo(Math.cos(a + w) * 120, Math.sin(a + w) * 120);
          ctx.fill();
        }
      }),
    [],
  );
  if (s.boom <= 0) return null;
  const pop = easeOutBack(s.boom * 6, 2.6);
  const raysK = 1 - smooth((s.boom - 0.75) / 0.25);
  const p: V3 = [DRONE_HIT[0] + 0.2, DRONE_HIT[1] + 0.4, DRONE_HIT[2] - 0.3];
  return (
    <group>
      <Billboard position={[p[0], p[1], p[2] - 2.5]} cam={cam} scale={2.2 + s.boom * 6}>
        <mesh rotation={[0, 0, s.boom * 0.6]}>
          <planeGeometry args={[6, 6]} />
          <meshBasicMaterial map={rays} transparent opacity={0.9 * raysK} depthWrite={false} toneMapped={false} />
        </mesh>
      </Billboard>
      <Billboard position={p} cam={cam} scale={pop * 0.95}>
        <group rotation={[0, 0, 0.1 + Math.sin(s.boom * 20) * 0.02]}>
          <mesh geometry={g.outer} position={[0, 0, -0.02]}>
            <meshBasicMaterial color={P.ink} />
          </mesh>
          <mesh geometry={g.mid} position={[0, 0, -0.01]}>
            <meshBasicMaterial color={P.yellow} toneMapped={false} />
          </mesh>
          <mesh geometry={g.inner}>
            <meshBasicMaterial color={P.red} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[4.4, 2.2]} />
            <meshBasicMaterial map={word} transparent depthWrite={false} toneMapped={false} />
          </mesh>
        </group>
      </Billboard>
    </group>
  );
};

// ---------- speech balloon ----------
const Balloon: React.FC<{ s: ComicState; cam: V3 }> = ({ s, cam }) => {
  const tex = useMemo(
    () =>
      makeCanvasTexture(1024, 640, (ctx) => {
        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = P.ink;
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.ellipse(512, 260, 470, 220, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(390, 430);
        ctx.lineTo(300, 620);
        ctx.lineTo(500, 455);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(512, 260, 462, 212, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = P.ink;
        ctx.font = "900 92px Impact, 'Arial Black', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("NOT IN MY CITY,", 512, 205);
        ctx.fillStyle = P.red;
        ctx.fillText("TIN CAN!", 512, 315);
      }),
    [],
  );
  if (s.balloon <= 0.001) return null;
  const p: V3 = [s.heroPos[0] + 1.0, s.heroPos[1] + 2.5, s.heroPos[2] - 1.0];
  return (
    <Billboard position={p} cam={cam} scale={easeOutBack(s.balloon, 1.8) * 0.8}>
      <mesh renderOrder={20}>
        <planeGeometry args={[2.4, 1.5]} />
        <meshBasicMaterial map={tex} transparent depthWrite={false} depthTest={false} toneMapped={false} />
      </mesh>
    </Billboard>
  );
};

// ---------- speed lines streaming behind the flying hero ----------
const LINES = 46;
const SpeedLines: React.FC<{ s: ComicState }> = ({ s }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const seeds = useMemo(() => {
    const r = rng(5);
    return Array.from({ length: LINES }, () => ({ a: r() * Math.PI * 2, rad: 0.7 + r() * 1.8, off: r(), len: 1.2 + r() * 2.4 }));
  }, []);
  const dir = useMemo(() => new THREE.Vector3(HERO_TARGET[0] - HERO_START[0], HERO_TARGET[1] - HERO_START[1] - 3, HERO_TARGET[2] - HERO_START[2]).normalize(), []);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    const side = new THREE.Vector3(1, 0, 0).applyQuaternion(q);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
    seeds.forEach((sd, i) => {
      const k = (sd.off + s.t * 1.7) % 1;
      const p = new THREE.Vector3(...s.heroPos)
        .addScaledVector(side, Math.cos(sd.a) * sd.rad)
        .addScaledVector(up, Math.sin(sd.a) * sd.rad + 0.9)
        .addScaledVector(dir, -k * 7 + 1.5);
      const sc = s.flying * Math.sin(k * Math.PI);
      m.compose(p, q, new THREE.Vector3(sc, sc, sd.len * sc));
      ref.current!.setMatrixAt(i, m);
    });
    ref.current!.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, LINES]} frustumCulled={false}>
      <boxGeometry args={[0.025, 0.025, 1]} />
      <meshBasicMaterial color="#FFFFFF" toneMapped={false} />
    </instancedMesh>
  );
};

export const Impact3D: React.FC<{ s: ComicState; mats: ComicMats; cam: V3 }> = ({ s, mats, cam }) => (
  <group>
    <Drone s={s} mats={mats} />
    <Shards s={s} mats={mats} />
    <Burst s={s} cam={cam} />
    <Balloon s={s} cam={cam} />
    <SpeedLines s={s} />
  </group>
);
