import React, { useMemo } from "react";
import * as THREE from "three";
import { FLIP, RISE, easeInOutCubic, easeOutBack, easeOutCubic, lerp, win } from "../core/motion";
import { makeCardBack, makeCardFront, makeFoilTexture, makeGlowTexture } from "../lib/materials";
import { CAPSULE_CENTER } from "./Capsule3D";

// The reward card: rises out of the burst back-first while spinning, decelerates, then flips
// to reveal the original creature art. Holographic foil = iridescent physical front plus an
// additive rainbow band overlay whose UV offset scrolls with time and the card's angle.

export const CARD_REST = new THREE.Vector3(0, 2.05, 0.4);
const CW = 1.2;
const CH = 1.7;

export const cardPose = (t: number) => {
  const rise = easeOutCubic(win(t, RISE[0], RISE[1]));
  const pos = new THREE.Vector3(0, CAPSULE_CENTER.y, 0).lerp(CARD_REST, rise);
  pos.y += Math.sin(t * 1.6) * 0.04 * rise;
  // spin (back facing) decelerating, then flip π → 0
  const spin = (1 - rise) * 9 + Math.PI;
  const flip = easeOutBack(win(t, FLIP[0], FLIP[1]), 1.3);
  const yaw = lerp(spin, 0, flip) + Math.sin(t * 0.9) * 0.08 * flip;
  const scale = lerp(0.15, 1, easeInOutCubic(win(t, RISE[0], RISE[0] + 0.8)));
  return { pos, yaw, scale, visible: t >= RISE[0], tilt: Math.sin(t * 1.2) * 0.05 };
};

export const HoloCard3D: React.FC<{ t: number }> = ({ t }) => {
  const front = useMemo(makeCardFront, []);
  const back = useMemo(makeCardBack, []);
  const foil = useMemo(makeFoilTexture, []);
  const glow = useMemo(makeGlowTexture, []);
  const p = cardPose(t);
  if (!p.visible) return null;
  foil.offset.set(t * 0.12 + p.yaw * 0.25, t * 0.05);
  const revealed = win(t, FLIP[0] + 0.3, FLIP[1] + 0.4);

  return (
    <group position={p.pos} rotation={[p.tilt, p.yaw, 0]} scale={p.scale}>
      {/* aura */}
      <sprite position={[0, 0, -0.1]} scale={[3.4, 3.8, 1]}>
        <spriteMaterial map={glow} color="#FFD36A" transparent opacity={0.35 + revealed * 0.35} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </sprite>
      {/* card body edge */}
      <mesh castShadow>
        <boxGeometry args={[CW, CH, 0.025]} />
        <meshPhysicalMaterial color="#C48A1E" metalness={0.9} roughness={0.25} />
      </mesh>
      {/* front art */}
      <mesh position={[0, 0, 0.0135]}>
        <planeGeometry args={[CW, CH]} />
        <meshPhysicalMaterial
          map={front}
          emissiveMap={front}
          emissive="#ffffff"
          emissiveIntensity={0.55}
          roughness={0.22}
          metalness={0.25}
          clearcoat={1}
          iridescence={0.8}
          iridescenceIOR={1.5}
          iridescenceThicknessRange={[250, 700]}
        />
      </mesh>
      {/* holo foil overlay */}
      <mesh position={[0, 0, 0.015]}>
        <planeGeometry args={[CW, CH]} />
        <meshBasicMaterial map={foil} transparent opacity={0.16 + 0.12 * Math.sin(t * 2.2) ** 2} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* back */}
      <mesh position={[0, 0, -0.0135]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[CW, CH]} />
        <meshPhysicalMaterial map={back} emissiveMap={back} emissive="#ffffff" emissiveIntensity={0.4} roughness={0.3} metalness={0.3} clearcoat={1} />
      </mesh>
    </group>
  );
};
