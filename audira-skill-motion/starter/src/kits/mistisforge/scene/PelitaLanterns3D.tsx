import React, { useMemo } from "react";
import * as THREE from "three";
import { computeMistisState, pelitaFlicker } from "../core/motion";
import { MISTIS_PALETTE } from "../lib/palette";
import { makeGlowTexture } from "../lib/materials";

// Pelita: a small tin oil lamp with a glass chimney, hung on a bamboo pole by the path.
export const PELITA_POSITIONS: [number, number, number][] = [
  [1.15, 0, 6.2],
  [-1.05, 0, 1.6],
  [1.05, 0, -2.6],
];

const Pelita: React.FC<{ pos: [number, number, number]; power: number; t: number; seed: number; glow: THREE.Texture }> = ({
  pos,
  power,
  t,
  seed,
  glow,
}) => {
  const swing = Math.sin(t * 1.4 + seed) * 0.06;
  const flameH = 0.07 * (0.8 + 0.4 * power);
  return (
    <group position={pos}>
      {/* bamboo pole + arm */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 1.8, 6]} />
        <meshStandardMaterial color="#6A6A44" roughness={0.8} />
      </mesh>
      <mesh position={[pos[0] > 0 ? -0.18 : 0.18, 1.78, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.4, 5]} />
        <meshStandardMaterial color="#6A6A44" roughness={0.8} />
      </mesh>
      <group position={[pos[0] > 0 ? -0.34 : 0.34, 1.76, 0]} rotation={[swing, 0, swing * 0.6]}>
        {/* hanging wire */}
        <mesh position={[0, -0.08, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.16, 4]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        {/* tin reservoir */}
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.045, 0.06, 0.07, 14]} />
          <meshStandardMaterial color="#9C8256" metalness={0.7} roughness={0.35} emissive="#4A2A0A" emissiveIntensity={0.6} />
        </mesh>
        {/* glass chimney */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.05, 0.065, 0.18, 14, 1, true]} />
          <meshStandardMaterial color="#FFD9A0" transparent opacity={0.25} roughness={0.1} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        {/* flame */}
        <mesh position={[0, -0.22, 0]} scale={[1, flameH / 0.07, 1]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshBasicMaterial color={MISTIS_PALETTE.flameCore} toneMapped={false} />
        </mesh>
        <sprite position={[0, -0.22, 0]} scale={[2.2 * power, 2.2 * power, 1]}>
          <spriteMaterial map={glow} color={MISTIS_PALETTE.lanternAmber} transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
        <pointLight position={[0, -0.22, 0.05]} color={MISTIS_PALETTE.lanternAmber} intensity={5.5 * power} distance={9} decay={1.6} />
      </group>
    </group>
  );
};

export const PelitaLanterns3D: React.FC<{ f: number }> = ({ f }) => {
  const s = computeMistisState(f);
  const glow = useMemo(() => makeGlowTexture(), []);
  return (
    <group>
      {PELITA_POSITIONS.map((p, i) => (
        <Pelita key={i} pos={p} seed={i * 11 + 1} t={s.t} glow={glow} power={pelitaFlicker(s.t, i * 11 + 1) * s.lanternGutter} />
      ))}
    </group>
  );
};
