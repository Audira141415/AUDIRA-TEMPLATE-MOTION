import React, { useMemo } from "react";
import * as THREE from "three";
import { ComicState, lerp } from "../core/motion";
import { ComicMats, InkBox, Inked } from "./Ink";
import { COMIC_PALETTE as P } from "../lib/palette";

// Original hero: "Skyline Guardian" — cyan suit, magenta cape, yellow bolt-star emblem, cowl mask.
// Local +z is the hero's front. The pivot sits at the hips so flight pitch rotates around the body centre.

const backInk = new THREE.MeshBasicMaterial({ color: P.ink, side: THREE.BackSide });

export const Hero3D: React.FC<{ s: ComicState; mats: ComicMats }> = ({ s, mats }) => {
  const g = useMemo(
    () => ({
      torso: new THREE.CapsuleGeometry(0.25, 0.42, 6, 16),
      head: new THREE.SphereGeometry(0.2, 20, 16),
      cowl: new THREE.SphereGeometry(0.212, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55),
      ear: new THREE.ConeGeometry(0.05, 0.16, 8),
      upper: new THREE.CapsuleGeometry(0.075, 0.3, 4, 10),
      fist: new THREE.SphereGeometry(0.1, 14, 12),
      leg: new THREE.CapsuleGeometry(0.095, 0.5, 4, 10),
      boot: new THREE.CapsuleGeometry(0.105, 0.16, 4, 10),
      belt: new THREE.CylinderGeometry(0.265, 0.265, 0.08, 20),
      eye: new THREE.SphereGeometry(0.045, 10, 8),
      emblem: (() => {
        const sh = new THREE.Shape();
        const pts = 5;
        for (let i = 0; i <= pts * 2; i++) {
          const a = (i / (pts * 2)) * Math.PI * 2 + Math.PI / 2;
          const r = i % 2 === 0 ? 0.15 : 0.065;
          const x = Math.cos(a) * r;
          const y = Math.sin(a) * r;
          if (i === 0) sh.moveTo(x, y);
          else sh.lineTo(x, y);
        }
        return new THREE.ExtrudeGeometry(sh, { depth: 0.03, bevelEnabled: false });
      })(),
    }),
    [],
  );

  const crouch = s.heroCrouch;
  const fly = Math.min(1, s.heroPitch / 1.15);
  const hipY = 0.98 - crouch * 0.32;
  // right arm: rises from a fist-on-hip pose, to forward flight, to the punch, then a victory raise
  const rArm = lerp(0.25, -2.95, Math.max(fly, s.punch)) - crouch * 0.6;
  const lArm = lerp(0.35, 0.55, fly) + crouch * 0.4;
  const legBend = crouch * 0.9;

  return (
    <group position={s.heroPos} rotation={[0, s.heroYaw, 0]}>
      <group position={[0, hipY, 0]} rotation={[s.heroPitch, 0, 0]}>
        {/* torso + belt + emblem */}
        <Inked geometry={g.torso} material={mats.suit} outline={mats.outline} position={[0, 0.36, 0]} />
        <Inked geometry={g.belt} material={mats.yellow} outline={mats.outlineThin} position={[0, 0.06, 0]} />
        <group position={[0, 0.48, 0.235]}>
          <mesh geometry={g.emblem} material={mats.yellow} />
          <mesh geometry={g.emblem} material={backInk} scale={1.25} position={[0, 0, -0.01]} />
        </group>
        {/* head with cowl, ears and white eye slits */}
        <group position={[0, 0.9, 0]}>
          <Inked geometry={g.head} material={mats.skin} outline={mats.outline} />
          <Inked geometry={g.cowl} material={mats.suit} outline={mats.outlineThin} rotation={[-0.35, 0, 0]} />
          <Inked geometry={g.ear} material={mats.suit} outline={mats.outlineThin} position={[-0.11, 0.2, -0.02]} rotation={[0, 0, 0.25]} />
          <Inked geometry={g.ear} material={mats.suit} outline={mats.outlineThin} position={[0.11, 0.2, -0.02]} rotation={[0, 0, -0.25]} />
          <mesh geometry={g.eye} material={mats.white} position={[-0.075, 0.05, 0.175]} scale={[1.3, 0.55, 0.5]} />
          <mesh geometry={g.eye} material={mats.white} position={[0.075, 0.05, 0.175]} scale={[1.3, 0.55, 0.5]} />
        </group>
        {/* right (punching) arm */}
        <group position={[0.33, 0.62, 0]} rotation={[rArm, 0, -0.12]}>
          <Inked geometry={g.upper} material={mats.suit} outline={mats.outline} position={[0, -0.22, 0]} />
          <Inked geometry={g.fist} material={mats.yellow} outline={mats.outline} position={[0, -0.48, 0]} scale={1 + s.punch * 0.35} />
        </group>
        {/* left arm */}
        <group position={[-0.33, 0.62, 0]} rotation={[lArm, 0, 0.18 + fly * 0.2]}>
          <Inked geometry={g.upper} material={mats.suit} outline={mats.outline} position={[0, -0.22, 0]} />
          <Inked geometry={g.fist} material={mats.yellow} outline={mats.outline} position={[0, -0.48, 0]} />
        </group>
        {/* legs */}
        {[-1, 1].map((side) => (
          <group key={side} position={[0.13 * side, -0.02, 0]} rotation={[side < 0 ? -legBend : -legBend * 0.4 + fly * 0.35 * (side > 0 ? 1 : 0), 0, side * 0.06]}>
            <Inked geometry={g.leg} material={mats.suit} outline={mats.outline} position={[0, -0.36, 0]} />
            <Inked geometry={g.boot} material={mats.cape} outline={mats.outline} position={[0, -0.72, 0.03]} />
          </group>
        ))}
        {/* cape: rigid hinge chain behind the shoulders */}
        <group position={[0, 0.7, -0.22]} rotation={[0.12 + fly * 0.15 + s.capeFlutter * 0.08, 0, 0]}>
          <InkBox size={[0.7, 0.5, 0.025]} position={[0, -0.25, 0]} material={mats.cape} ink={backInk} t={0.025} />
          <group position={[0, -0.5, 0]} rotation={[0.08 + fly * 0.3 + s.capeFlutter * 0.16, 0, 0]}>
            <InkBox size={[0.8, 0.5, 0.025]} position={[0, -0.25, 0]} material={mats.cape} ink={backInk} t={0.025} />
            <group position={[0, -0.5, 0]} rotation={[0.06 + fly * 0.25 + s.capeFlutter * 0.26, 0, s.capeFlutter * 0.05]}>
              <InkBox size={[0.92, 0.48, 0.025]} position={[0, -0.24, 0]} material={mats.cape} ink={backInk} t={0.025} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};
