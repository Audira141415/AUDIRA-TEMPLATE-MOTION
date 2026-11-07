// ANATOMIX — the imaging suite around the heart: backdrop dome, hologram projector floor and light cone,
// rotating clinical rings, a scanning slice plane, and foreground dust motes.
import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ANATOMY_PALETTE as P } from "../lib/palette";
import { makeBackdropTexture, makeGlow, makeProjectorTexture } from "../lib/materials";
import { beat, prng, seg, TL } from "../core/motion";

const MOTES = 120;

export const HoloSuite3D: React.FC<{ t: number }> = ({ t }) => {
  const back = useMemo(() => makeBackdropTexture(), []);
  const proj = useMemo(() => makeProjectorTexture(), []);
  const glow = useMemo(() => makeGlow(), []);
  const moteRef = useRef<THREE.InstancedMesh>(null);
  const motes = useMemo(() => {
    const r = prng(5656);
    return Array.from({ length: MOTES }, () => {
      const a = r() * Math.PI * 2;
      const rad = 2.2 + r() * 3.5;
      return { a, rad, y: -2 + r() * 4.5, ph: r() * 6.28, s: 0.5 + r() };
    });
  }, []);
  useLayoutEffect(() => {
    const m = moteRef.current;
    if (!m) return;
    const o = new THREE.Object3D();
    motes.forEach((d, i) => {
      const a = d.a + t * 0.04;
      o.position.set(Math.cos(a) * d.rad, d.y + Math.sin(t * 0.5 + d.ph) * 0.08, Math.sin(a) * d.rad);
      o.scale.setScalar(0.012 * d.s);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [t, motes]);

  const b = beat(t);
  const pay = seg(t, TL.payoff, TL.payoff + 1.2);
  const scanY = -1.5 + ((t * 0.32) % 1) * 3.6;
  const pulseR = (t * 1.2) % 1;

  return (
    <group>
      {/* backdrop dome */}
      <mesh>
        <sphereGeometry args={[30, 48, 24]} />
        <meshBasicMaterial map={back} side={THREE.BackSide} fog={false} />
      </mesh>

      {/* projector floor + rim + light cone */}
      <mesh position={[0, -1.95, 0]} rotation={[-Math.PI / 2, 0, t * 0.1]}>
        <planeGeometry args={[4.4, 4.4]} />
        <meshBasicMaterial map={proj} transparent opacity={0.45} blending={THREE.AdditiveBlending} depthWrite={false} color={P.holo} />
      </mesh>
      <mesh position={[0, -2.02, 0]}>
        <cylinderGeometry args={[2.25, 2.4, 0.12, 96]} />
        <meshStandardMaterial color="#0B2228" metalness={0.3} roughness={0.75} />
      </mesh>
      <mesh position={[0, -1.25, 0]}>
        <cylinderGeometry args={[1.5, 1.95, 1.4, 64, 1, true]} />
        <meshBasicMaterial color={P.holo} transparent opacity={0.05 + 0.03 * b.lub} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* heartbeat pulse ring on the floor */}
      <mesh position={[0, -1.94, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.6 + pulseR * 1.3}>
        <ringGeometry args={[0.95, 1, 96]} />
        <meshBasicMaterial color={P.holoSoft} transparent opacity={(1 - pulseR) * 0.45} toneMapped={false} depthWrite={false} />
      </mesh>

      {/* clinical rings */}
      {[
        { r: 1.75, tilt: [1.35, 0, 0.2], sp: 0.25 },
        { r: 1.95, tilt: [1.1, 0.4, -0.3], sp: -0.18 },
        { r: 2.15, tilt: [1.6, -0.5, 0.1], sp: 0.12 },
      ].map((ring, i) => (
        <group key={i} rotation={ring.tilt as [number, number, number]}>
          <mesh rotation={[0, 0, t * ring.sp]} scale={1 + pay * 0.08 * (i + 1)}>
            <torusGeometry args={[ring.r, 0.006 + pay * 0.004, 8, 180, Math.PI * (1.4 + 0.2 * i)]} />
            <meshBasicMaterial color={P.holo} transparent opacity={0.55 + pay * 0.35} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* scanning slice */}
      <group position={[0, scanY, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.38, 1.42, 128]} />
          <meshBasicMaterial color={P.holoSoft} transparent opacity={0.7} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.38, 96]} />
          <meshBasicMaterial color={P.holo} transparent opacity={0.035} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* payoff halo behind the heart */}
      <sprite position={[0, 0.2, -1.2]} scale={[5 + pay * 1.5, 5 + pay * 1.5, 1]}>
        <spriteMaterial map={glow} color={P.holo} transparent opacity={0.12 + 0.18 * pay} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>

      <instancedMesh ref={moteRef} args={[undefined, undefined, MOTES]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color={P.holoSoft} transparent opacity={0.4} depthWrite={false} />
      </instancedMesh>
    </group>
  );
};
