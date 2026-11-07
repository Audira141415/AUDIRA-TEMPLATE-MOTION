import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ARCADE_PALETTE as P } from "../lib/palette";
import { canvasTex, makeCarpetTexture, makeGlowTexture } from "../lib/materials";
import { rng } from "../core/motion";

// Background cabinets (instanced: bodies, screens, marquees), cosmic carpet, back wall + neon sign.
const BG = (() => {
  const r = rng(12);
  const cols = [P.cyan, P.magenta, P.phosphorGreen, P.orange, P.yellow];
  const out: { x: number; z: number; rot: number; col: string; h: number }[] = [];
  for (const side of [-1, 1])
    for (let i = 0; i < 4; i++) out.push({ x: side * (1.55 + i * 1.3), z: -0.4 - i * 0.55 - r() * 0.2, rot: -side * (0.18 + i * 0.05), col: cols[(i + (side > 0 ? 2 : 0)) % cols.length], h: 2.2 + r() * 0.25 });
  for (let i = 0; i < 6; i++) out.push({ x: -4 + i * 1.6, z: -4.6, rot: 0, col: cols[(i * 3) % cols.length], h: 2.2 + r() * 0.2 });
  return out;
})();

export const ArcadeRoom3D: React.FC<{ t: number }> = ({ t }) => {
  const tex = useMemo(() => {
    const carpet = makeCarpetTexture();
    carpet.wrapS = carpet.wrapT = THREE.RepeatWrapping;
    carpet.repeat.set(6, 6);
    const sign = canvasTex(1024, 256, (ctx) => {
      ctx.clearRect(0, 0, 1024, 256);
      ctx.font = "italic 900 150px 'Arial Black', Impact, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = P.magenta;
      ctx.shadowBlur = 30;
      ctx.strokeStyle = P.magenta;
      ctx.lineWidth = 10;
      ctx.strokeText("PLAY ZONE", 512, 128);
      ctx.strokeStyle = "#FFD6EC";
      ctx.lineWidth = 4;
      ctx.strokeText("PLAY ZONE", 512, 128);
    });
    return { carpet, sign, glow: makeGlowTexture() };
  }, []);
  const body = useRef<THREE.InstancedMesh>(null);
  const screen = useRef<THREE.InstancedMesh>(null);
  const marquee = useRef<THREE.InstancedMesh>(null);
  const halo = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const c = new THREE.Color();
    BG.forEach((b, i) => {
      q.setFromEuler(new THREE.Euler(0, b.rot, 0));
      const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
      m.compose(new THREE.Vector3(b.x, b.h / 2, b.z), q, new THREE.Vector3(1.05, b.h, 0.95));
      body.current!.setMatrixAt(i, m);
      const flick = 0.75 + 0.25 * Math.sin(t * (3 + i) + i * 1.7);
      const sp = new THREE.Vector3(b.x, 1.55, b.z).addScaledVector(fwd, 0.48);
      m.compose(sp, q, new THREE.Vector3(0.62, 0.55, 1));
      screen.current!.setMatrixAt(i, m);
      screen.current!.setColorAt(i, c.set(b.col).multiplyScalar(flick));
      const mp = new THREE.Vector3(b.x, b.h - 0.16, b.z).addScaledVector(fwd, 0.48);
      m.compose(mp, q, new THREE.Vector3(0.9, 0.2, 1));
      marquee.current!.setMatrixAt(i, m);
      marquee.current!.setColorAt(i, c.set(b.col));
      m.compose(sp.clone().addScaledVector(fwd, 0.05), q, new THREE.Vector3(1.8, 1.6, 1));
      halo.current!.setMatrixAt(i, m);
      halo.current!.setColorAt(i, c.set(b.col).multiplyScalar(0.35 * flick));
    });
    for (const r of [body, screen, marquee, halo]) {
      r.current!.instanceMatrix.needsUpdate = true;
      if (r.current!.instanceColor) r.current!.instanceColor.needsUpdate = true;
    }
  });
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial map={tex.carpet} roughness={0.95} emissive="#FFFFFF" emissiveMap={tex.carpet} emissiveIntensity={0.12} />
      </mesh>
      <mesh position={[0, 4, -5.4]}>
        <planeGeometry args={[30, 8]} />
        <meshStandardMaterial color="#0D0B1C" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.6, -5.3]}>
        <planeGeometry args={[4.6, 1.15]} />
        <meshBasicMaterial map={tex.sign} transparent toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh position={[0, 3.6, -5.25]}>
        <planeGeometry args={[7, 3]} />
        <meshBasicMaterial map={tex.glow} color={P.magenta} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <instancedMesh ref={body} args={[undefined, undefined, BG.length]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#10132C" roughness={0.45} metalness={0.2} />
      </instancedMesh>
      <instancedMesh ref={screen} args={[undefined, undefined, BG.length]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={marquee} args={[undefined, undefined, BG.length]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={halo} args={[undefined, undefined, BG.length]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={tex.glow} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </instancedMesh>
      {/* coloured spill from the neighbour rows */}
      <pointLight position={[-3, 1.6, 0.6]} color={P.cyan} intensity={2.2} distance={6} decay={2} />
      <pointLight position={[3, 1.6, 0.6]} color={P.orange} intensity={2.0} distance={6} decay={2} />
      <pointLight position={[0, 3.4, -4.6]} color={P.magenta} intensity={3} distance={8} decay={2} />
    </group>
  );
};
