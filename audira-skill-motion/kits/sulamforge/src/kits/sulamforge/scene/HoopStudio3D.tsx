import React, { useMemo } from "react";
import * as THREE from "three";
import { SULAM_PALETTE as P } from "../lib/palette";
import { goldThreadMaterial, makeLinenTextures, makeSongketTextures, makeSpoolTexture } from "../lib/materials";

export const FAB_Y = 0.1;

const Spool: React.FC<{ position: [number, number, number]; color: string; seed: number; rotY?: number }> = ({ position, color, seed, rotY = 0 }) => {
  const tex = useMemo(() => makeSpoolTexture(color, seed), [color, seed]);
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <mesh position={[0, 0.13, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.2, 32]} />
        <meshPhysicalMaterial map={tex} roughness={0.45} sheen={1} sheenRoughness={0.4} sheenColor="#ffffff" />
      </mesh>
      {[0.015, 0.245].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.03, 32]} />
          <meshStandardMaterial color="#B98A5A" roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
};

/** Songket base cloth, embroidery hoop with stretched linen, thread spools and a loose gold thread. */
export const HoopStudio3D: React.FC<{ f: number }> = () => {
  const linen = useMemo(() => makeLinenTextures(), []);
  const songket = useMemo(() => makeSongketTextures(), []);
  const goldMat = useMemo(() => goldThreadMaterial(), []);
  const clothGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(10, 10, 80, 80);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const r = Math.hypot(x, y);
      // soft folds away from the hoop, flat under it
      const fold = Math.max(0, r - 1.3) * 0.06 * (Math.sin(x * 1.7 + y * 0.6) + 0.6 * Math.sin(y * 2.3 - x * 0.4));
      pos.setZ(i, fold);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  const looseThread = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.4, 0.03, -0.2),
      new THREE.Vector3(-1.7, 0.03, 0.4),
      new THREE.Vector3(-1.5, 0.04, 1.1),
      new THREE.Vector3(-0.9, 0.03, 1.5),
      new THREE.Vector3(-0.2, 0.03, 1.9),
      new THREE.Vector3(0.6, 0.03, 2.6),
    ]);
    return new THREE.TubeGeometry(curve, 120, 0.008, 6, false);
  }, []);

  return (
    <group>
      <mesh geometry={clothGeo} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial map={songket.map} metalnessMap={songket.metalness} metalness={1} roughness={0.42} envMapIntensity={1.3} />
      </mesh>

      {/* linen stretched in the hoop */}
      <mesh position={[0, FAB_Y, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.0, 96]} />
        <meshStandardMaterial map={linen.map} bumpMap={linen.bump} bumpScale={0.6} roughness={0.88} />
      </mesh>
      {/* inner and outer beech rings */}
      <mesh position={[0, FAB_Y - 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[1.0, 0.035, 20, 160]} />
        <meshStandardMaterial color={P.hoopBeech} roughness={0.45} />
      </mesh>
      <mesh position={[0, FAB_Y, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 1.5]} castShadow receiveShadow>
        <torusGeometry args={[1.045, 0.038, 20, 160]} />
        <meshStandardMaterial color="#C99C6C" roughness={0.4} />
      </mesh>
      {/* brass tension clamp */}
      <group position={[0, FAB_Y, -1.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.14, 0.12, 0.1]} />
          <meshStandardMaterial color={P.brass} metalness={1} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, -0.08]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.14, 16]} />
          <meshStandardMaterial color={P.brass} metalness={1} roughness={0.3} />
        </mesh>
      </group>

      <Spool position={[1.35, 0, 1.0]} color={P.threadVermilion} seed={1} />
      <Spool position={[1.75, 0, 0.45]} color={P.threadLeaf} seed={2} />
      <Spool position={[-1.45, 0, -0.9]} color={P.gold} seed={3} />
      <mesh geometry={looseThread} material={goldMat} castShadow />
    </group>
  );
};
