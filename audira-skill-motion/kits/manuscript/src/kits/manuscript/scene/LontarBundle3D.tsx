import React, { useMemo } from "react";
import * as THREE from "three";
import { computeManuscriptState } from "../core/motion";
import { MANUSCRIPT_PALETTE as P } from "../lib/palette";
import { makeLontarTexture, makeWoodTexture } from "../lib/materials";

export const LONTAR_POS: [number, number, number] = [0.98, 0, 0.42];
const N = 18;

/**
 * Balinese-style lontar: palm-leaf strips with incised pseudo-script, strung on a cord through
 * the centre hole between two carved wooden covers (kropak). The top cover lifts away, then
 * the leaves fan open around the cord.
 */
export const LontarBundle3D: React.FC<{ f: number }> = ({ f }) => {
  const s = computeManuscriptState(f);
  const texes = useMemo(() => [makeLontarTexture(1), makeLontarTexture(2), makeLontarTexture(3)], []);
  const wood = useMemo(() => makeWoodTexture(21, "#5A3A1E"), []);
  const leafMats = useMemo(
    () =>
      texes.map((map) => {
        const side = new THREE.MeshStandardMaterial({ color: P.lontarFibre, roughness: 0.8 });
        const top = new THREE.MeshStandardMaterial({ map, roughness: 0.62 });
        // box faces: +x, -x, +y (top), -y, +z, -z
        return [side, side, top, top, side, side];
      }),
    [texes],
  );
  const cord = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.0, 0),
      new THREE.Vector3(0, 0.16, 0),
      new THREE.Vector3(0.04, 0.17, 0.08),
      new THREE.Vector3(0.18, 0.01, 0.22),
      new THREE.Vector3(0.38, 0.006, 0.3),
    ]);
    return new THREE.TubeGeometry(curve, 60, 0.005, 6, false);
  }, []);

  const fan = s.fan;
  return (
    <group position={LONTAR_POS} rotation={[0, -0.3, 0]} scale={1.3}>
      {/* bottom cover */}
      <mesh position={[0, 0.011, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.86, 0.022, 0.085]} />
        <meshStandardMaterial map={wood} roughness={0.5} />
      </mesh>
      {Array.from({ length: N }, (_, i) => {
        const k = i / (N - 1);
        const ang = fan * (k - 0.15) * 1.6;
        const y = 0.025 + i * (0.0045 + fan * 0.0025);
        return (
          <mesh key={i} position={[0, y, 0]} rotation={[0, ang, 0]} material={leafMats[i % 3]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 0.004, 0.066]} />
          </mesh>
        );
      })}
      {/* top cover lifts and swings aside */}
      <group position={[s.coverLift * 0.1, 0.025 + N * 0.0045 + 0.012 - s.coverLift * 0.1, -s.coverLift * 0.3]} rotation={[0, -s.coverLift * 0.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.86, 0.022, 0.085]} />
          <meshStandardMaterial map={wood} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.012, 0]}>
          <boxGeometry args={[0.6, 0.004, 0.03]} />
          <meshStandardMaterial color={P.goldLeaf} metalness={1} roughness={0.3} />
        </mesh>
      </group>
      <mesh geometry={cord}>
        <meshStandardMaterial color={P.cord} roughness={0.7} />
      </mesh>
      {/* old coin tied at the cord end (generic, no inscription) */}
      <mesh position={[0.4, 0.006, 0.31]}>
        <cylinderGeometry args={[0.028, 0.028, 0.006, 24]} />
        <meshStandardMaterial color="#8A6A3A" metalness={0.9} roughness={0.45} />
      </mesh>
    </group>
  );
};
