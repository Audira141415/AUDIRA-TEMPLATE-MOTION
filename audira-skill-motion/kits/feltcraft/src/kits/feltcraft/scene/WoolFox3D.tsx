import React, { useMemo } from "react";
import * as THREE from "three";
import { computeFoxPose, poseJitter } from "../core/motion";
import { FELTCRAFT_PALETTE as P } from "../lib/palette";
import { beadMaterial, feltMaterial } from "../lib/materials";
import { CONE, CYL, Fuzzy, SPHERE } from "./Fuzzy";

// Original character "Kopi", a round needle-felted fox kit: wool body and fluffy tail with fuzz
// shells, glossy bead eyes and nose, felt cheeks, and a stitched teal scarf. Poses on twos.

/** Local point where the apple is held: chest height, raised above the head as armLift → 1. */
export const foxHandLocal = (armLift: number) => new THREE.Vector3(0, 0.62 + armLift * 0.85, 0.44 - armLift * 0.22);

export const WoolFox3D: React.FC<{ f: number; children?: React.ReactNode }> = ({ f, children }) => {
  const p = computeFoxPose(f);
  const j = poseJitter(f / 60, 7);
  const bead = useMemo(beadMaterial, []);
  const scarfMat = useMemo(() => feltMaterial(P.scarf, 3), []);
  const cheekMat = useMemo(() => feltMaterial(P.cheek, 1), []);
  const sq = p.squash;
  const arm = p.armLift;

  return (
    <group position={[p.x + j[0], p.y + j[1], p.z]} rotation={[0, p.yaw + j[2] * 4, 0]}>
      <group scale={[1 + sq * 0.5, 1 - sq, 1 + sq * 0.5]}>
        {/* body */}
        <Fuzzy geometry={SPHERE} color={P.foxOrange} position={[0, 0.42, 0]} scale={[0.36, 0.4, 0.33]} spacing={0.035} />
        <Fuzzy geometry={SPHERE} color={P.foxCream} position={[0, 0.38, 0.17]} scale={[0.24, 0.29, 0.18]} shells={3} spacing={0.04} />
        {/* feet */}
        {[-1, 1].map((s) => (
          <Fuzzy key={s} geometry={SPHERE} color={P.foxDark} position={[s * 0.16, 0.07, 0.08]} scale={[0.1, 0.07, 0.13]} shells={2} spacing={0.05} />
        ))}
        {/* arms: rotate up when holding */}
        {[-1, 1].map((s) => (
          <group key={`a${s}`} position={[s * 0.27, 0.55, 0.06]} rotation={[-arm * 2.3, 0, s * (0.35 + arm * 0.25)]}>
            <Fuzzy geometry={SPHERE} color={P.foxDark} position={[0, -0.13, 0]} scale={[0.075, 0.16, 0.075]} shells={2} spacing={0.05} />
          </group>
        ))}
        {/* tail: big curl behind */}
        <group position={[-0.22, 0.32, -0.28]} rotation={[0.5, 0.4, 0.9 + Math.sin(f * 0.05) * 0.06]}>
          <Fuzzy geometry={SPHERE} color={P.foxOrange} position={[0, 0.18, 0]} scale={[0.18, 0.34, 0.18]} spacing={0.045} />
          <Fuzzy geometry={SPHERE} color={P.foxCream} position={[0, 0.48, 0]} scale={[0.13, 0.14, 0.13]} shells={3} spacing={0.05} />
        </group>
        {/* scarf */}
        <mesh position={[0, 0.7, 0.02]} rotation={[Math.PI / 2 + 0.1, 0, 0]} material={scarfMat} castShadow>
          <torusGeometry args={[0.24, 0.06, 14, 40]} />
        </mesh>
        <mesh position={[0.14, 0.58, 0.24]} rotation={[0.2, 0, -0.3]} material={scarfMat} castShadow>
          <boxGeometry args={[0.1, 0.22, 0.04]} />
        </mesh>
        {/* scarf stitches */}
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <mesh key={`st${i}`} position={[Math.cos(a) * 0.24, 0.7 + 0.02, Math.sin(a) * 0.24 + 0.02]} rotation={[0, -a, Math.PI / 2]}>
              <capsuleGeometry args={[0.008, 0.05, 3, 6]} />
              <meshStandardMaterial color={P.stitchCream} roughness={1} />
            </mesh>
          );
        })}
        {/* head */}
        <group position={[0, 0.98, 0.02]} rotation={[0.05, 0, Math.sin(f * 0.03) * 0.05]}>
          <Fuzzy geometry={SPHERE} color={P.foxOrange} scale={[0.33, 0.29, 0.29]} spacing={0.035} />
          {/* muzzle */}
          <Fuzzy geometry={SPHERE} color={P.foxCream} position={[0, -0.07, 0.2]} scale={[0.17, 0.12, 0.14]} shells={3} spacing={0.05} />
          <mesh geometry={SPHERE} material={bead} position={[0, -0.03, 0.335]} scale={[0.04, 0.032, 0.03]} />
          {/* eyes */}
          {[-1, 1].map((s) => (
            <group key={`e${s}`}>
              <mesh geometry={SPHERE} material={bead} position={[s * 0.12, 0.05, 0.25]} scale={0.042} />
              <mesh position={[s * 0.12 + 0.012, 0.065, 0.288]} scale={0.011}>
                <sphereGeometry args={[1, 10, 8]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>
              <mesh material={cheekMat} position={[s * 0.2, -0.06, 0.2]} rotation={[0, s * 0.6, 0]} scale={[0.05, 0.035, 0.01]} geometry={SPHERE} />
            </group>
          ))}
          {/* ears */}
          {[-1, 1].map((s) => (
            <group key={`r${s}`} position={[s * 0.17, 0.25, -0.02]} rotation={[0, 0, s * (-0.35 + (s > 0 ? p.earTwitch : 0))]}>
              <Fuzzy geometry={CONE} color={P.foxOrange} scale={[0.1, 0.24, 0.06]} position={[0, 0.06, 0]} shells={2} spacing={0.05} />
              <Fuzzy geometry={CONE} color={P.foxDark} scale={[0.05, 0.09, 0.04]} position={[0, 0.16, 0.005]} shells={1} spacing={0.06} />
              <mesh geometry={CONE} position={[0, 0.04, 0.035]} scale={[0.055, 0.14, 0.02]}>
                <meshStandardMaterial color={P.foxCream} roughness={1} />
              </mesh>
            </group>
          ))}
        </group>
        {/* held prop slot (the apple after the catch) */}
        <group position={foxHandLocal(p.armLift)}>{p.holding ? children : null}</group>
      </group>
      {/* soft contact shadow disc */}
      <mesh geometry={CYL} position={[0, -p.y + 0.012, 0]} scale={[0.36 * (1 - p.y * 0.4), 0.002, 0.3 * (1 - p.y * 0.4)]}>
        <meshBasicMaterial color="#3B2A1A" transparent opacity={0.25} depthWrite={false} />
      </mesh>
    </group>
  );
};
