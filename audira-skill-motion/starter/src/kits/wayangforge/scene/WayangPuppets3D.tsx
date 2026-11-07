import React, { useMemo } from "react";
import * as THREE from "three";
import { PuppetPose, computeWayangState, projectToKelir } from "../core/motion";
import { WAYANG_PALETTE as P } from "../lib/palette";
import { PuppetKind, makePuppetTextures } from "../lib/materials";

interface PuppetProps {
  kind: PuppetKind;
  pose: PuppetPose;
  height: number;
  castShadow?: boolean;
}

/**
 * A carved leather puppet (colour side) + its fake projected shadow on both faces of the kelir.
 * Shadows are planes placed by projecting from the blencong (see `projectToKelir`), so the shadow
 * grows and softens as the puppet moves toward the lamp, with zero shadow-map cost.
 */
const Puppet: React.FC<PuppetProps> = ({ kind, pose, height, castShadow = true }) => {
  const tex = useMemo(() => makePuppetTextures(kind), [kind]);
  const h = height * pose.scale;
  const w = h / 2;
  const [x, y, z] = pose.pos;
  const proj = projectToKelir(pose.pos);
  const squash = Math.max(0.04, Math.abs(Math.cos(pose.rotY)));
  const softness = THREE.MathUtils.clamp(1 - (proj.k - 1) * 0.28, 0.55, 1);
  const rodLen = y - h / 2 - 0.5;

  return (
    <group>
      <group position={[x, y, z]} rotation={[0, pose.rotY, pose.rotZ]}>
        <mesh>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial map={tex.color} alphaTest={0.45} side={THREE.DoubleSide} roughness={0.5} metalness={0.2} envMapIntensity={0.6} />
        </mesh>
        {/* cempurit: horn rod through the body into the gedebog */}
        <mesh position={[0, -h / 2 - rodLen / 2 + h * 0.35, 0.01]}>
          <cylinderGeometry args={[0.012, 0.016, rodLen + h * 0.7, 6]} />
          <meshStandardMaterial color={P.hornRod} roughness={0.4} />
        </mesh>
      </group>
      {castShadow && (
        <>
          <mesh position={[proj.x, proj.y, 0.007]} rotation={[0, 0, pose.rotZ]} scale={[w * proj.k * squash, h * proj.k, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={tex.shadow} transparent opacity={0.6 * softness} depthWrite={false} color="#000000" />
          </mesh>
          <mesh position={[proj.x, proj.y, -0.008]} rotation={[0, 0, pose.rotZ]} scale={[w * proj.k * squash, h * proj.k, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={tex.shadow} transparent opacity={0.95 * softness} depthWrite={false} side={THREE.DoubleSide} color="#000000" />
          </mesh>
        </>
      )}
    </group>
  );
};

/** Simpingan: puppets planted in the gedebog beside the screen. */
const SIMPINGAN: { kind: PuppetKind; x: number; tilt: number }[] = [
  { kind: "kesatria", x: -2.95, tilt: 0.05 },
  { kind: "raksasa", x: -3.35, tilt: -0.04 },
  { kind: "kesatria", x: -3.75, tilt: 0.08 },
  { kind: "raksasa", x: 2.95, tilt: -0.05 },
  { kind: "kesatria", x: 3.35, tilt: 0.04 },
  { kind: "raksasa", x: 3.75, tilt: -0.07 },
];

export const WayangPuppets3D: React.FC<{ f: number }> = ({ f }) => {
  const s = computeWayangState(f);
  return (
    <group>
      <Puppet kind="gunungan" pose={s.gunungan} height={1.9} />
      <Puppet kind="kesatria" pose={s.kesatria} height={1.5} />
      <Puppet kind="raksasa" pose={s.raksasa} height={1.5} />
      {SIMPINGAN.map((p, i) => (
        <Puppet key={i} kind={p.kind} castShadow={false} height={1.15} pose={{ pos: [p.x, 1.25, 0.3], rotZ: p.tilt, rotY: p.x < 0 ? 0.35 : -0.35, scale: 1 }} />
      ))}
    </group>
  );
};
