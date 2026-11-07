import React, { useMemo } from "react";
import * as THREE from "three";
import { BURST, TIERS, clamp01, easeOutCubic, flash, mulberry32, rarityColor, shake, tierIndex } from "../core/motion";
import { GACHAREVEAL_PALETTE as P } from "../lib/palette";
import { makeGlowTexture } from "../lib/materials";
import { PEDESTAL_TOP } from "./RevealStage3D";

// The capsule: translucent top dome over a glossy base, a glowing core inside, light cracks that
// multiply with each rarity tier, a jittering shake, and at BURST the halves fly apart with a
// shockwave ring and a flash.

const R = 0.62;
export const CAPSULE_CENTER = new THREE.Vector3(0, PEDESTAL_TOP + R * 1.28 + 0.05, 0);

export const Capsule3D: React.FC<{ t: number }> = ({ t }) => {
  const glow = useMemo(makeGlowTexture, []);
  const cracks = useMemo(() => {
    const rnd = mulberry32(6521);
    return Array.from({ length: 18 }, () => ({ th: rnd() * Math.PI * 2, ph: 0.25 + rnd() * 1.1, len: 0.15 + rnd() * 0.25, rot: rnd() * Math.PI }));
  }, []);
  const col = rarityColor(t);
  const fl = flash(t);
  const tier = tierIndex(t);
  const sh = shake(t);
  const a = t - BURST;
  const open = a > 0 ? easeOutCubic(clamp01(a / 0.9)) : 0;
  const visibleCracks = t >= BURST ? 0 : Math.min(cracks.length, (tier + 1) * 5 + Math.floor(clamp01((t - 0.6) / 1.2) * 3));
  const breath = 1 + Math.sin(t * 8) * 0.01 * (tier + 1);

  return (
    <group>
      <group position={[CAPSULE_CENTER.x + sh.x, CAPSULE_CENTER.y, CAPSULE_CENTER.z + sh.z]} rotation={[0, t * 0.6, sh.rz]} scale={[breath, breath * 1.28, breath]}>
        {/* top dome (flies up/back) */}
        <group position={[0, open * 2.4, -open * 1.2]} rotation={[-open * 2.2, open * 1.5, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[R, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhysicalMaterial color={P.capsuleShell} transparent opacity={0.42} roughness={0.05} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} emissive={col} emissiveIntensity={0.15 + fl * 0.5} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[R + 0.012, R + 0.012, 0.07, 48, 1, true]} />
            <meshPhysicalMaterial color={P.capsuleBand} roughness={0.2} metalness={1} clearcoat={1} side={THREE.DoubleSide} />
          </mesh>
        </group>
        {/* bottom cup (drops and slides forward-left) */}
        <group position={[-open * 1.4, -open * 0.3, open * 0.9]} rotation={[open * 1.2, 0, open * 1.6]}>
          <mesh castShadow>
            <sphereGeometry args={[R, 48, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
            <meshPhysicalMaterial color={P.capsuleBase} roughness={0.2} metalness={0.6} clearcoat={1} clearcoatRoughness={0.05} iridescence={0.7} iridescenceIOR={1.4} side={THREE.DoubleSide} />
          </mesh>
        </group>
        {/* core */}
        {t < BURST + 0.4 && (
          <>
            <mesh scale={0.26 + fl * 0.08}>
              <icosahedronGeometry args={[1, 2]} />
              <meshBasicMaterial color={col} toneMapped={false} />
            </mesh>
            <sprite scale={[1.6 + fl * 1.5, 1.6 + fl * 1.5, 1]}>
              <spriteMaterial map={glow} color={col} transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
            </sprite>
          </>
        )}
        {/* light cracks */}
        {cracks.slice(0, visibleCracks).map((c, i) => {
          const n = new THREE.Vector3(Math.sin(c.ph) * Math.cos(c.th), Math.cos(c.ph), Math.sin(c.ph) * Math.sin(c.th));
          const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
          const e = new THREE.Euler().setFromQuaternion(q);
          return (
            <mesh key={i} position={n.clone().multiplyScalar(R + 0.004)} rotation={e}>
              <planeGeometry args={[c.len, 0.018]} />
              <meshBasicMaterial color={col} toneMapped={false} side={THREE.DoubleSide} />
            </mesh>
          );
        })}
      </group>
      {/* tier-up and burst shockwaves */}
      {[...TIERS.map((x) => x.at), BURST].map((at, i) => {
        const k = t - at;
        if (k < 0 || k > 0.8) return null;
        const r = 0.5 + k * (i === 3 ? 7 : 3.5);
        return (
          <mesh key={i} position={[0, PEDESTAL_TOP + 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r, r + 0.08 + (i === 3 ? 0.12 : 0), 96]} />
            <meshBasicMaterial color={col} transparent opacity={(1 - k / 0.8) * 0.9} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};
