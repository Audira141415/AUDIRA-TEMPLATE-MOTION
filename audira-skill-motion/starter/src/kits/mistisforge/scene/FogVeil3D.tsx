import React, { useMemo } from "react";
import * as THREE from "three";
import { computeMistisState, mulberry32 } from "../core/motion";
import { MISTIS_PALETTE } from "../lib/palette";
import { makeFogTexture, makeGlowTexture, makePresenceTexture } from "../lib/materials";

// Ground fog: layered billboard puffs hugging the earth, drifting across the path.
// Pale presence: only ever seen through the fog, never in sharp focus.
export const FogVeil3D: React.FC<{ f: number }> = ({ f }) => {
  const s = computeMistisState(f);
  const texes = useMemo(() => [makeFogTexture(1), makeFogTexture(2), makeFogTexture(3)], []);
  const glow = useMemo(() => makeGlowTexture(), []);
  const presence = useMemo(() => makePresenceTexture(), []);
  const puffs = useMemo(() => {
    const rnd = mulberry32(2024);
    return Array.from({ length: 46 }, (_, i) => ({
      x: (rnd() - 0.5) * 12,
      y: 0.25 + rnd() * 0.9,
      z: 7 - rnd() * 18,
      w: 3 + rnd() * 4,
      speed: 0.12 + rnd() * 0.2,
      dir: rnd() < 0.5 ? -1 : 1,
      op: 0.22 + rnd() * 0.3,
      tex: i % 3,
    }));
  }, []);
  const motes = useMemo(() => {
    const rnd = mulberry32(77);
    return Array.from({ length: 34 }, () => ({ x: (rnd() - 0.5) * 7, y: 0.4 + rnd() * 2.2, z: 5 - rnd() * 11, ph: rnd() * 6.28 }));
  }, []);

  const wrap = (v: number) => ((((v + 7) % 14) + 14) % 14) - 7;

  // presence sits between the banyan roots and the path
  const pOp = s.apparition;
  return (
    <group>
      {puffs.map((p, i) => (
        <sprite key={i} position={[wrap(p.x + p.dir * p.speed * s.t), p.y, p.z]} scale={[p.w, p.w * 0.42, 1]}>
          <spriteMaterial map={texes[p.tex]} color="#7E92AC" transparent opacity={p.op * s.fogBuild} depthWrite={false} />
        </sprite>
      ))}

      {/* the pale presence (suggestive silhouette) */}
      <group position={[-0.85, 0, -3.3]}>
        {/* dark aura behind her so the pale gown separates from the bright fog */}
        <sprite position={[0, 1.15, -0.05]} scale={[1.9, 3.0, 1]} renderOrder={20}>
          <spriteMaterial map={glow} transparent opacity={0.85 * pOp} depthWrite={false} color="#000000" />
        </sprite>
        <mesh position={[0, 1.05, 0]} rotation={[0, 0.25, 0]} renderOrder={21}>
          <planeGeometry args={[1.05, 2.1]} />
          <meshBasicMaterial map={presence} transparent opacity={0.92 * pOp} depthWrite={false} fog={false} color="#EEF4FA" toneMapped={false} />
        </mesh>
        <sprite position={[0, 1.1, -0.1]} scale={[2.6, 3.2, 1]}>
          <spriteMaterial map={glow} color="#B4C8E4" transparent opacity={0.75 * pOp} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      </group>
      {/* a veil of fog always in front of her */}
      <sprite position={[-0.8, 0.3, -2.9]} scale={[3.4, 1.1, 1]} renderOrder={22}>
        <spriteMaterial map={texes[0]} color={MISTIS_PALETTE.fogVeil} transparent opacity={0.4 * s.fogBuild} depthWrite={false} />
      </sprite>

      {/* kunang-kunang: drifting fireflies */}
      {motes.map((m, i) => {
        const blink = 0.5 + 0.5 * Math.sin(s.t * 2.4 + m.ph * 3);
        return (
          <sprite key={i} position={[m.x + Math.sin(s.t * 0.5 + m.ph) * 0.4, m.y + Math.sin(s.t * 0.8 + m.ph) * 0.2, m.z]} scale={[0.12, 0.12, 1]}>
            <spriteMaterial map={glow} color="#D8F2A0" transparent opacity={0.9 * blink} depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
        );
      })}
    </group>
  );
};
