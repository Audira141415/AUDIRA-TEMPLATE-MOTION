// TACTICBOARD — the miniature pitch board, goals with nets, and the stadium-bowl backdrop (bokeh crowd + floodlights).
import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { TACTIC_PALETTE as P } from "../lib/palette";
import { makeGlowTexture, makeNetTexture, makePitchTexture, PITCH_SURFACE } from "../lib/materials";
import { GOAL, netBulge, prng } from "../core/motion";

const Goal: React.FC<{ z: number; dir: 1 | -1; bulge: number; netTex: THREE.Texture }> = ({ z, dir, bulge, netTex }) => {
  const post = 0.022;
  const back = z - dir * (GOAL.depth + bulge * 0.14);
  const mid = (z + back) / 2;
  const len = Math.abs(back - z);
  return (
    <group>
      {[-GOAL.halfW, GOAL.halfW].map((x) => (
        <mesh key={x} position={[x, GOAL.h / 2, z]} castShadow>
          <cylinderGeometry args={[post, post, GOAL.h, 12]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.25} metalness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, GOAL.h, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[post, post, GOAL.halfW * 2 + post * 2, 12]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.25} metalness={0.2} />
      </mesh>
      {/* back net (bulges on the goal) */}
      <mesh position={[0, GOAL.h / 2, back]}>
        <planeGeometry args={[GOAL.halfW * 2, GOAL.h]} />
        <meshBasicMaterial map={netTex} alphaMap={netTex} transparent opacity={0.75} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* roof + side nets */}
      <mesh position={[0, GOAL.h, mid]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[GOAL.halfW * 2, len]} />
        <meshBasicMaterial map={netTex} alphaMap={netTex} transparent opacity={0.6} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {[-GOAL.halfW, GOAL.halfW].map((x) => (
        <mesh key={`s${x}`} position={[x, GOAL.h / 2, mid]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[len, GOAL.h]} />
          <meshBasicMaterial map={netTex} alphaMap={netTex} transparent opacity={0.6} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

/** Stadium bowl: thousands of tiny warm/cool lights read as an out-of-focus crowd behind the board. */
const CrowdBowl: React.FC<{ t: number }> = ({ t }) => {
  const COUNT = 4200;
  const ref = useRef<THREE.InstancedMesh>(null);
  const seeds = useMemo(() => {
    const r = prng(777);
    return Array.from({ length: COUNT }, () => ({ a: r() * Math.PI * 2, tier: r(), ph: r() * 6.28, warm: r() > 0.45, s: 0.5 + r() }));
  }, []);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    const c = new THREE.Color();
    seeds.forEach((d, i) => {
      const rad = 13.2 + d.tier * 6.6;
      o.position.set(Math.cos(d.a) * rad * 0.8, -0.2 + d.tier * 5.4, Math.sin(d.a) * rad * 1.15);
      const tw = 0.75 + 0.25 * Math.sin(t * 3 + d.ph);
      o.scale.setScalar(0.028 * d.s * tw);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      c.set(d.warm ? P.crowdWarm : P.crowdCool).multiplyScalar(0.55 + 0.45 * tw);
      m.setColorAt(i, c);
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [seeds, t]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
};

export const PitchBoard3D: React.FC<{ t: number }> = ({ t }) => {
  const pitchTex = useMemo(() => makePitchTexture(), []);
  const netTex = useMemo(() => makeNetTexture(), []);
  const glow = useMemo(() => makeGlowTexture(), []);
  const bulge = netBulge(t);
  const W = PITCH_SURFACE.w;
  const L = PITCH_SURFACE.l;

  return (
    <group>
      {/* studio floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.34, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={P.floor} roughness={0.42} metalness={0.3} />
      </mesh>

      {/* composite board body + brushed aluminium lip */}
      <mesh position={[0, -0.17, 0]} castShadow receiveShadow>
        <boxGeometry args={[W + 0.6, 0.32, L + 1.3]} />
        <meshStandardMaterial color={P.frame} roughness={0.55} metalness={0.25} />
      </mesh>
      <mesh position={[0, -0.005, 0]} receiveShadow>
        <boxGeometry args={[W + 0.24, 0.02, L + 0.95]} />
        <meshStandardMaterial color={P.frameEdge} roughness={0.28} metalness={0.85} />
      </mesh>

      {/* the pitch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]} receiveShadow>
        <planeGeometry args={[W, L]} />
        <meshStandardMaterial map={pitchTex} roughness={0.86} metalness={0} />
      </mesh>

      <Goal z={GOAL.z} dir={1} bulge={bulge} netTex={netTex} />
      <Goal z={-GOAL.z} dir={-1} bulge={0} netTex={netTex} />

      {/* background: stadium bowl + floodlight towers */}
      {/* dark stand tiers that carry the crowd lights */}
      {[0, 1, 2].map((k) => (
        <mesh key={k} position={[0, -0.4 + k * 1.9, 0]} scale={[0.8, 1, 1.15]}>
          <cylinderGeometry args={[14.6 + k * 2.3, 13.4 + k * 2.3, 1.9, 64, 1, true]} />
          <meshStandardMaterial color="#0E151D" roughness={0.9} side={THREE.BackSide} />
        </mesh>
      ))}
      <CrowdBowl t={t} />
      {[
        [-11, -14],
        [11, -14],
        [-11, 13],
        [11, 13],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 4, 0]}>
            <boxGeometry args={[0.18, 8.6, 0.18]} />
            <meshStandardMaterial color="#1B232C" roughness={0.6} metalness={0.5} />
          </mesh>
          <mesh position={[0, 8.4, 0]} rotation={[0, Math.atan2(-x, -z), 0]}>
            <boxGeometry args={[1.6, 0.8, 0.12]} />
            <meshBasicMaterial color={P.flood} toneMapped={false} />
          </mesh>
          <sprite position={[0, 8.4, 0]} scale={[7, 7, 1]}>
            <spriteMaterial map={glow} color={P.flood} transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
        </group>
      ))}
    </group>
  );
};
