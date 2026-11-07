import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { computeMistisState, mulberry32 } from "../core/motion";
import { MISTIS_PALETTE } from "../lib/palette";
import {
  makeBambooTexture,
  makeEarthTexture,
  makeGedekTexture,
  makeGlowTexture,
  makeLeafTexture,
  makePathTexture,
  makeThatchTexture,
  makeTreelineTexture,
} from "../lib/materials";

const dummy = new THREE.Object3D();

// ---------- Bamboo grove (instanced culms + leaf sprays) ----------
interface Culm {
  x: number;
  z: number;
  h: number;
  r: number;
  lean: number;
  phase: number;
}

const useCulms = () =>
  useMemo(() => {
    const rnd = mulberry32(44);
    const out: Culm[] = [];
    for (let i = 0; i < 150; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (1.9 + rnd() * 3.6);
      const z = 7 - rnd() * 22;
      // keep clear of the banyan (left, z -1..-5) and the house (right, z -4..-9)
      if (side < 0 && z < -0.5 && z > -5.5 && x > -4.4) continue;
      if (side > 0 && z < -3.5 && z > -10 && x < 4.2) continue;
      out.push({ x, z, h: 6 + rnd() * 4, r: 0.035 + rnd() * 0.035, lean: (rnd() - 0.5) * 0.18 - side * 0.05, phase: rnd() * 6.28 });
    }
    return out;
  }, []);

const BambooGrove: React.FC<{ wind: number; t: number }> = ({ wind, t }) => {
  const culms = useCulms();
  const stalkRef = useRef<THREE.InstancedMesh>(null);
  const leafRef = useRef<THREE.InstancedMesh>(null);
  const tex = useMemo(() => makeBambooTexture(), []);
  const leafTex = useMemo(() => makeLeafTexture(7), []);
  const leavesPer = 5;
  const culmGeo = useMemo(() => new THREE.CylinderGeometry(0.85, 1, 1, 8).translate(0, 0.5, 0), []);

  useLayoutEffect(() => {
    const s = stalkRef.current;
    const l = leafRef.current;
    if (!s || !l) return;
    culms.forEach((c, i) => {
      const sway = c.lean + wind * 0.025 * Math.sin(t * 0.7 + c.phase) + Math.sin(t * 1.3 + c.phase) * 0.01;
      dummy.position.set(c.x, 0, c.z);
      dummy.rotation.set(sway * 0.6, 0, sway);
      dummy.scale.set(c.r, c.h, c.r);
      dummy.updateMatrix();
      s.setMatrixAt(i, dummy.matrix);
      for (let k = 0; k < leavesPer; k++) {
        const hh = c.h * (0.45 + k * 0.11);
        const lx = c.x + Math.sin(sway) * -hh + Math.cos(c.phase + k * 2.1) * 0.3;
        const lz = c.z + Math.sin(c.phase + k * 2.1) * 0.3;
        dummy.position.set(lx, hh, lz);
        dummy.rotation.set(0, c.phase + k * 1.3, Math.sin(t * 1.6 + c.phase + k) * 0.08);
        dummy.scale.setScalar(0.9 + (k % 2) * 0.4);
        dummy.updateMatrix();
        l.setMatrixAt(i * leavesPer + k, dummy.matrix);
      }
    });
    s.instanceMatrix.needsUpdate = true;
    l.instanceMatrix.needsUpdate = true;
  }, [culms, wind, t]);

  return (
    <group>
      {/* unit culm with its base at y=0 */}
      <instancedMesh ref={stalkRef} args={[culmGeo, undefined, culms.length]}>
        <meshStandardMaterial map={tex} roughness={0.7} color="#B9C29A" />
      </instancedMesh>
      <instancedMesh ref={leafRef} args={[undefined, undefined, culms.length * leavesPer]}>
        <planeGeometry args={[1.1, 1.1]} />
        <meshStandardMaterial map={leafTex} alphaTest={0.4} side={THREE.DoubleSide} roughness={0.8} color="#A4B48A" />
      </instancedMesh>
    </group>
  );
};

// ---------- Banyan (beringin) with a curtain of aerial roots ----------
const Banyan: React.FC<{ wind: number; t: number }> = ({ wind, t }) => {
  const rootRef = useRef<THREE.InstancedMesh>(null);
  const roots = useMemo(() => {
    const rnd = mulberry32(91);
    return Array.from({ length: 110 }, () => {
      const a = rnd() * Math.PI * 2;
      const rad = 0.5 + rnd() * 2.3;
      return { x: Math.cos(a) * rad, z: Math.sin(a) * rad * 0.8, top: 3.6 + rnd() * 0.8, len: 1.2 + rnd() * 2.8, r: 0.008 + rnd() * 0.018, ph: rnd() * 6.28 };
    });
  }, []);
  const rootGeo = useMemo(() => new THREE.CylinderGeometry(0.7, 1, 1, 5).translate(0, -0.5, 0), []);
  const canopy = useMemo(() => {
    const rnd = mulberry32(12);
    return Array.from({ length: 9 }, () => ({ x: (rnd() - 0.5) * 4.2, y: 4.4 + rnd() * 1.6, z: (rnd() - 0.5) * 3, r: 1.2 + rnd() * 1.0 }));
  }, []);

  useLayoutEffect(() => {
    const m = rootRef.current;
    if (!m) return;
    roots.forEach((r, i) => {
      dummy.position.set(r.x, r.top, r.z);
      dummy.rotation.set(Math.sin(t * 0.8 + r.ph) * 0.03 * (1 + Math.abs(wind)), 0, Math.sin(t * 0.6 + r.ph) * 0.04 * (1 + wind));
      dummy.scale.set(r.r, r.len, r.r);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [roots, wind, t]);

  const bark = MISTIS_PALETTE.banyanBark;
  return (
    <group position={[-3.0, 0, -3.0]}>
      {[
        [0, 0, 0, 0.55, 0.05],
        [0.45, 0, 0.2, 0.32, -0.18],
        [-0.4, 0, -0.15, 0.36, 0.2],
        [0.15, 0, -0.45, 0.28, 0.12],
        [-0.2, 0, 0.45, 0.25, -0.1],
      ].map(([x, y, z, r, lean], i) => (
        <mesh key={i} position={[x, y + 2.2, z]} rotation={[0, 0, lean]}>
          <cylinderGeometry args={[r * 0.75, r * 1.25, 4.4, 10]} />
          <meshStandardMaterial color={bark} roughness={0.95} />
        </mesh>
      ))}
      {canopy.map((c, i) => (
        <mesh key={i} position={[c.x, c.y, c.z]}>
          <dodecahedronGeometry args={[c.r, 1]} />
          <meshStandardMaterial color={MISTIS_PALETTE.banyanLeaf} roughness={0.9} flatShading />
        </mesh>
      ))}
      <instancedMesh ref={rootRef} args={[rootGeo, undefined, roots.length]}>
        <meshStandardMaterial color="#4A433B" roughness={0.95} />
      </instancedMesh>
      {/* sesajen-like offering mat at the roots: a small woven tray, no gore */}
      <mesh position={[1.3, 0.04, 1.2]} rotation={[-Math.PI / 2, 0, 0.4]}>
        <circleGeometry args={[0.22, 16]} />
        <meshStandardMaterial color="#8A7350" roughness={0.9} />
      </mesh>
    </group>
  );
};

// ---------- Rumah panggung (stilt house) ----------
const RumahPanggung: React.FC<{ glow: number }> = ({ glow }) => {
  const gedek = useMemo(() => makeGedekTexture(), []);
  const thatch = useMemo(() => makeThatchTexture(5), []);
  const stilts: [number, number][] = [];
  for (const x of [-1.3, 0, 1.3]) for (const z of [-1.0, 0, 1.0]) stilts.push([x, z]);
  return (
    <group position={[1.9, 0, -6.6]} rotation={[0, -0.42, 0]}>
      {stilts.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.6, z]}>
          <cylinderGeometry args={[0.07, 0.08, 1.2, 8]} />
          <meshStandardMaterial color={MISTIS_PALETTE.timber} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[3.1, 0.12, 2.5]} />
        <meshStandardMaterial color={MISTIS_PALETTE.timber} roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.05, -0.1]}>
        <boxGeometry args={[2.8, 1.5, 2.1]} />
        <meshStandardMaterial map={gedek} roughness={0.92} color="#B8A27E" />
      </mesh>
      {/* steep gable roof: triangular prism */}
      <mesh position={[0, 3.35, -0.1]} rotation={[0, 0, Math.PI / 2]} scale={[1.7, 1, 1]}>
        <cylinderGeometry args={[1.25, 1.25, 3.6, 3]} />
        <meshStandardMaterial map={thatch} roughness={1} color="#9C8A70" />
      </mesh>
      {/* lit window with wooden shutter bars */}
      <mesh position={[0.6, 2.1, 0.96]}>
        <planeGeometry args={[0.6, 0.55]} />
        <meshStandardMaterial color="#FFB866" emissive="#FF9A3C" emissiveIntensity={2.4 * glow} toneMapped={false} />
      </mesh>
      {[-0.18, 0, 0.18].map((dx, i) => (
        <mesh key={i} position={[0.6 + dx, 2.1, 0.975]}>
          <boxGeometry args={[0.03, 0.56, 0.02]} />
          <meshStandardMaterial color="#1A120C" />
        </mesh>
      ))}
      {/* doorway, dark */}
      <mesh position={[-0.7, 1.95, 0.96]}>
        <planeGeometry args={[0.6, 1.1]} />
        <meshStandardMaterial color="#120D09" roughness={1} />
      </mesh>
      {/* ladder */}
      {[0, 1, 2, 3].map((k) => (
        <mesh key={k} position={[-0.7, 0.25 + k * 0.28, 1.45 - k * 0.1]}>
          <boxGeometry args={[0.55, 0.04, 0.1]} />
          <meshStandardMaterial color={MISTIS_PALETTE.timber} />
        </mesh>
      ))}
      <pointLight position={[0.6, 2.1, 1.5]} color="#FFA14A" intensity={3.5 * glow} distance={6} decay={2} />
    </group>
  );
};

// ---------- Ground, path, sky, moon, treelines ----------
export const KampungNight3D: React.FC<{ f: number }> = ({ f }) => {
  const s = computeMistisState(f);
  const earth = useMemo(() => makeEarthTexture(3), []);
  const path = useMemo(() => makePathTexture(4), []);
  const glow = useMemo(() => makeGlowTexture(), []);
  const tl1 = useMemo(() => makeTreelineTexture(1), []);
  const tl2 = useMemo(() => makeTreelineTexture(2), []);

  const grassRef = useRef<THREE.InstancedMesh>(null);
  const grass = useMemo(() => {
    const rnd = mulberry32(8);
    return Array.from({ length: 360 }, () => {
      const side = rnd() < 0.5 ? -1 : 1;
      return { x: side * (0.75 + rnd() * 2.2), z: 8 - rnd() * 20, h: 0.12 + rnd() * 0.3, ry: rnd() * 6.28 };
    });
  }, []);
  useLayoutEffect(() => {
    const m = grassRef.current;
    if (!m) return;
    grass.forEach((g, i) => {
      dummy.position.set(g.x, g.h / 2, g.z);
      dummy.rotation.set(0, g.ry, Math.sin(s.t * 1.7 + g.ry) * 0.12);
      dummy.scale.set(0.08, g.h, 0.08);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [grass, s.t]);

  const moonGlow = 1 + s.moonSurge * 0.6;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -6]}>
        <planeGeometry args={[40, 60]} />
        <meshStandardMaterial map={earth} roughness={1} color="#8C8070" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -2]}>
        <planeGeometry args={[1.9, 26]} />
        <meshStandardMaterial map={path} transparent roughness={1} depthWrite={false} />
      </mesh>
      <instancedMesh ref={grassRef} args={[undefined, undefined, grass.length]}>
        <coneGeometry args={[1, 1, 4]} />
        <meshStandardMaterial color="#34402A" roughness={1} />
      </instancedMesh>

      <BambooGrove wind={s.wind} t={s.t} />
      <Banyan wind={s.wind} t={s.t} />
      <RumahPanggung glow={s.lanternGutter} />

      {/* distant treelines, swallowed by blue fog */}
      <mesh position={[0, 3.0, -17]}>
        <planeGeometry args={[34, 8.5]} />
        <meshBasicMaterial map={tl1} color="#1A2738" transparent alphaTest={0.3} />
      </mesh>
      <mesh position={[2, 4.0, -24]}>
        <planeGeometry args={[46, 11.5]} />
        <meshBasicMaterial map={tl2} color="#22344C" transparent alphaTest={0.3} />
      </mesh>

      {/* the moon: ignores fog, haloed */}
      <mesh position={[-2.2, 10.5, -30]}>
        <circleGeometry args={[1.5, 48]} />
        <meshBasicMaterial color={MISTIS_PALETTE.moonDisc} fog={false} toneMapped={false} />
      </mesh>
      <sprite position={[-2.2, 10.5, -30.1]} scale={[12 * moonGlow, 12 * moonGlow, 1]}>
        <spriteMaterial map={glow} color="#9DB6D8" transparent opacity={0.55} depthWrite={false} fog={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
};
