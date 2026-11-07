import React, { useMemo } from "react";
import * as THREE from "three";
import { candleFlicker, computeManuscriptState, mulberry32, pageToWorld } from "../core/motion";
import { MANUSCRIPT_PALETTE as P } from "../lib/palette";
import { makeGlowTexture } from "../lib/materials";
import { INITIAL_POS } from "./CodexLectern3D";

const CANDLES: { pos: [number, number, number]; h: number; seed: number }[] = [
  { pos: [-0.95, 0, -0.1], h: 0.5, seed: 1 },
  { pos: [1.45, 0, -0.1], h: 0.34, seed: 2 },
];

/** Beeswax candles with flicker lights, dust motes in the light, and the gold-leaf gleam light. */
export const CandleLight3D: React.FC<{ f: number }> = ({ f }) => {
  const s = computeManuscriptState(f);
  const glow = useMemo(() => makeGlowTexture(), []);
  const motes = useMemo(() => {
    const rnd = mulberry32(17);
    return Array.from({ length: 36 }, () => ({ x: (rnd() - 0.5) * 2.2, y: 0.3 + rnd() * 1.1, z: -0.6 + rnd() * 1.2, ph: rnd() * 6.28 }));
  }, []);
  const gleam = pageToWorld(INITIAL_POS[0] + s.gleamX * 0.22, INITIAL_POS[1] + 0.04, 0.22);

  return (
    <group>
      {CANDLES.map((c, i) => {
        const fl = candleFlicker(s.t, c.seed);
        const sway = Math.sin(s.t * 2.1 + c.seed) * 0.02;
        return (
          <group key={i} position={c.pos}>
            <mesh position={[0, 0.012, 0]} castShadow>
              <cylinderGeometry args={[0.11, 0.12, 0.024, 28]} />
              <meshStandardMaterial color="#B8893A" metalness={0.9} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.024 + c.h / 2, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.052, c.h, 24]} />
              <meshPhysicalMaterial color={P.candleWax} roughness={0.45} transmission={0} sheen={0.6} sheenColor="#FFE8C0" emissive="#5A3A10" emissiveIntensity={0.25} />
            </mesh>
            {[0.3, 2.2, 4.1].map((a, k) => (
              <mesh key={k} position={[Math.cos(a) * 0.05, 0.024 + c.h - 0.04 - k * 0.03, Math.sin(a) * 0.05]} scale={[1, 2.2, 1]}>
                <sphereGeometry args={[0.012, 10, 8]} />
                <meshStandardMaterial color={P.candleWax} roughness={0.4} />
              </mesh>
            ))}
            <group position={[0, 0.024 + c.h + 0.045, 0]} rotation={[0, 0, sway]}>
              <mesh scale={[1, 2.1 * fl, 1]}>
                <sphereGeometry args={[0.016, 12, 10]} />
                <meshBasicMaterial color={P.candleFlame} toneMapped={false} />
              </mesh>
              <sprite scale={[0.5 * fl, 0.6 * fl, 1]}>
                <spriteMaterial map={glow} color={P.candleAmber} transparent opacity={0.8} depthWrite={false} blending={THREE.AdditiveBlending} />
              </sprite>
              <pointLight color={P.candleAmber} intensity={2.6 * fl} distance={5} decay={1.6} castShadow={i === 0} shadow-mapSize={[1024, 1024]} shadow-bias={-0.002} />
            </group>
          </group>
        );
      })}

      {/* gleam: a small warm light gliding over the gold leaf (hook + payoff) */}
      <pointLight position={gleam} intensity={1.6 * s.gleamPower} distance={1.0} decay={1.4} color="#FFF0C8" />

      {motes.map((m, i) => (
        <sprite key={i} position={[m.x + Math.sin(s.t * 0.3 + m.ph) * 0.1, m.y + ((s.t * 0.03 + m.ph) % 0.4), m.z]} scale={[0.012, 0.012, 1]}>
          <spriteMaterial map={glow} color="#FFE2B0" transparent opacity={0.5 + 0.4 * Math.sin(s.t * 1.7 + m.ph)} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      ))}
    </group>
  );
};
