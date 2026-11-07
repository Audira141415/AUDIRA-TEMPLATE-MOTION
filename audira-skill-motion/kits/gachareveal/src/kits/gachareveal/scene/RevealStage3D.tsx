import React, { useMemo } from "react";
import * as THREE from "three";
import { BURST, flash, mulberry32, rarityColor, tierIndex } from "../core/motion";
import { GACHAREVEAL_PALETTE as P } from "../lib/palette";
import { makeBeamTexture, makeGlowTexture } from "../lib/materials";

// Summon stage: glossy indigo floor with concentric rarity rings, a hexagonal pedestal with a
// glowing rim, rotating rarity beams (one more per tier), a star field and a back-light bloom.

export const PEDESTAL_TOP = 0.55;

export const RevealStage3D: React.FC<{ t: number }> = ({ t }) => {
  const glow = useMemo(makeGlowTexture, []);
  const beamTex = useMemo(makeBeamTexture, []);
  const col = rarityColor(t);
  const fl = flash(t);
  const tier = tierIndex(t);
  const stars = useMemo(() => {
    const rnd = mulberry32(6511);
    return Array.from({ length: 70 }, () => {
      const a = rnd() * Math.PI * 2;
      const r = 9 + rnd() * 6;
      return { p: [Math.cos(a) * r, -1 + rnd() * 12, Math.sin(a) * r] as [number, number, number], s: 0.05 + rnd() * 0.14, ph: rnd() * 6.28 };
    });
  }, []);
  const beamCount = t >= BURST ? 12 : 3 + Math.max(0, tier) * 3;
  const beamOpacity = (t >= BURST ? 0.55 * Math.exp(-(t - BURST) * 0.5) + 0.12 : 0.22 + 0.12 * Math.max(0, tier)) + fl * 0.3;

  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[14, 96]} />
        <meshPhysicalMaterial color={P.floor} roughness={0.18} metalness={0.4} clearcoat={1} clearcoatRoughness={0.05} />
      </mesh>
      {[1.3, 2.0, 2.8, 3.7].map((r, i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 3 - i * 0.9);
        return (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005 + i * 0.001, 0]}>
            <ringGeometry args={[r, r + 0.035 + fl * 0.03, 128]} />
            <meshBasicMaterial color={col} transparent opacity={(0.25 + 0.5 * pulse) * (0.6 + fl)} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
        );
      })}
      {/* hex pedestal */}
      <mesh position={[0, PEDESTAL_TOP / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 1.1, PEDESTAL_TOP, 6]} />
        <meshPhysicalMaterial color={P.pedestal} roughness={0.25} metalness={0.7} clearcoat={1} />
      </mesh>
      <mesh position={[0, PEDESTAL_TOP + 0.005, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 6]}>
        <ringGeometry args={[0.78, 0.9, 6]} />
        <meshBasicMaterial color={col} toneMapped={false} />
      </mesh>
      {/* rarity beams */}
      {Array.from({ length: beamCount }, (_, i) => {
        const a = (i / beamCount) * Math.PI * 2 + t * 0.35;
        const r = 2.4 + (i % 3) * 0.6;
        return (
          <mesh key={i} position={[Math.cos(a) * r, 3.5, Math.sin(a) * r - 1]} rotation={[0, -a, 0]}>
            <planeGeometry args={[0.35 + (i % 2) * 0.25, 7]} />
            <meshBasicMaterial map={beamTex} color={col} transparent opacity={beamOpacity} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        );
      })}
      {/* back bloom + floor hotspot */}
      <sprite position={[0, 2.6, -4]} scale={[9 + fl * 4, 9 + fl * 4, 1]}>
        <spriteMaterial map={glow} color={col} transparent opacity={0.35 + fl * 0.35} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </sprite>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <circleGeometry args={[3.2, 64]} />
        <meshBasicMaterial map={glow} color={col} transparent opacity={0.35 + fl * 0.4} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      {stars.map((s, i) => (
        <sprite key={i} position={s.p} scale={[s.s, s.s, 1]}>
          <spriteMaterial map={glow} color="#DDE4FF" transparent opacity={0.5 + 0.5 * Math.sin(t * 2 + s.ph)} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </sprite>
      ))}
    </group>
  );
};
