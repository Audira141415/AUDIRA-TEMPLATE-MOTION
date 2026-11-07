import React, { useMemo } from "react";
import * as THREE from "three";
import { DREAM_PALETTE } from "../lib/palette";
import { makeGlowTexture } from "../lib/materials";

/**
 * A free-standing door frame (no wall), its leaf ajar, the doorway showing bright sky.
 * `open` is the leaf angle in radians; `glow` scales the light inside the doorway (HDR for bloom).
 */
export const FloatingDoor3D: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  open: number;
  glow: number;
  leaf?: string;
  frame?: string;
  scale?: number;
}> = ({ position, rotationY = 0, open, glow, leaf = DREAM_PALETTE.doorPink, frame = DREAM_PALETTE.tile, scale = 1 }) => {
  const glowTex = useMemo(() => makeGlowTexture(), []);
  const portal = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 32;
    c.height = 128;
    const g = c.getContext("2d")!;
    const gr = g.createLinearGradient(0, 0, 0, 128);
    gr.addColorStop(0, DREAM_PALETTE.skyZenith);
    gr.addColorStop(0.55, DREAM_PALETTE.skyMid);
    gr.addColorStop(1, DREAM_PALETTE.sunGlow);
    g.fillStyle = gr;
    g.fillRect(0, 0, 32, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({ color: frame, roughness: 0.35 }), [frame]);
  const leafMat = useMemo(() => new THREE.MeshStandardMaterial({ color: leaf, roughness: 0.45 }), [leaf]);
  const portalMat = useMemo(() => new THREE.MeshBasicMaterial({ map: portal, side: THREE.DoubleSide }), [portal]);
  portalMat.color.setScalar(0.9 + glow * 1.6);

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {/* frame */}
      <mesh material={frameMat} position={[-0.56, 1.15, 0]}>
        <boxGeometry args={[0.12, 2.42, 0.16]} />
      </mesh>
      <mesh material={frameMat} position={[0.56, 1.15, 0]}>
        <boxGeometry args={[0.12, 2.42, 0.16]} />
      </mesh>
      <mesh material={frameMat} position={[0, 2.36, 0]}>
        <boxGeometry args={[1.24, 0.14, 0.16]} />
      </mesh>
      {/* doorway: the sky is inside */}
      <mesh material={portalMat} position={[0, 1.12, -0.01]}>
        <planeGeometry args={[1.0, 2.24]} />
      </mesh>
      {/* leaf on its hinge */}
      <group position={[-0.5, 0, 0.04]} rotation={[0, -open, 0]}>
        <mesh material={leafMat} position={[0.5, 1.12, 0]}>
          <boxGeometry args={[1.0, 2.22, 0.06]} />
        </mesh>
        {[0.62, 1.55].map((y) => (
          <mesh key={y} material={leafMat} position={[0.5, y, 0.04]}>
            <boxGeometry args={[0.72, 0.7, 0.03]} />
          </mesh>
        ))}
        <mesh position={[0.88, 1.1, 0.07]}>
          <sphereGeometry args={[0.045, 16, 12]} />
          <meshStandardMaterial color="#F3D98B" metalness={1} roughness={0.25} />
        </mesh>
      </group>
      {/* light spilling onto the water */}
      <mesh position={[0, 0.02, 0.9]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.4, 2.2, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={glowTex} color={DREAM_PALETTE.sunGlow} transparent opacity={0.25 + glow * 0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
};
