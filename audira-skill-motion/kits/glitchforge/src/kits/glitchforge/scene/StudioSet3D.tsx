import React, { useMemo } from "react";
import * as THREE from "three";
import { GLITCH_PALETTE as P } from "../lib/palette";

// Seamless white cyclorama (floor + coved wall), a turned plinth, and a broadcast test card on a stand
// in the background — the clean "product shot" that the glitch will tear apart.
const testCard = () => {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 384;
  const ctx = c.getContext("2d")!;
  const bars = ["#E6E6E6", "#E6E61A", "#1AE6E6", "#1AE61A", "#E61AE6", "#E61A1A", "#1A1AE6"];
  bars.forEach((b, i) => {
    ctx.fillStyle = b;
    ctx.fillRect((i * 512) / 7, 0, 512 / 7 + 1, 260);
  });
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = `rgb(${i * 32},${i * 32},${i * 32})`;
    ctx.fillRect((i * 512) / 8, 260, 512 / 8 + 1, 60);
  }
  ctx.fillStyle = P.ink;
  ctx.fillRect(0, 320, 512, 64);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 34px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText("FEED 68 // CAL", 256, 364);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

export const StudioSet3D: React.FC = () => {
  const res = useMemo(() => {
    // coved cyclorama: quarter-cylinder joining floor to wall
    const cove = new THREE.CylinderGeometry(4, 4, 30, 32, 1, true, Math.PI, Math.PI / 2);
    cove.rotateZ(Math.PI / 2);
    return { cove, card: testCard() };
  }, []);
  const mat = <meshStandardMaterial color={P.studio} roughness={0.85} />;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2]} receiveShadow>
        <planeGeometry args={[30, 16]} />
        {mat}
      </mesh>
      <mesh geometry={res.cove} position={[0, 4, -6]} receiveShadow>
        {mat}
      </mesh>
      <mesh position={[0, 12, -10]} receiveShadow>
        <planeGeometry args={[30, 16]} />
        {mat}
      </mesh>
      {/* plinth */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.05, 1.15, 0.9, 64]} />
        <meshPhysicalMaterial color={P.plinth} roughness={0.25} clearcoat={0.6} />
      </mesh>
      <mesh position={[0, 0.91, 0]}>
        <torusGeometry args={[1.05, 0.012, 8, 96]} />
        <meshBasicMaterial color={P.cyan} toneMapped={false} />
      </mesh>
      {/* test card on a stand, back left */}
      <group position={[-2.6, 0, -3.2]} rotation={[0, 0.45, 0]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.8, 8]} />
          <meshStandardMaterial color="#888C96" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 2.05, 0.03]} castShadow>
          <boxGeometry args={[1.6, 1.2, 0.04]} />
          <meshStandardMaterial color="#1A1B20" />
        </mesh>
        <mesh position={[0, 2.05, 0.055]}>
          <planeGeometry args={[1.5, 1.1]} />
          <meshBasicMaterial map={res.card} toneMapped={false} />
        </mesh>
      </group>
      {/* light stand silhouette, back right */}
      <group position={[3.0, 0, -2.6]}>
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.025, 0.04, 2.8, 8]} />
          <meshStandardMaterial color="#2A2C33" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 2.95, 0.1]} rotation={[0.5, -0.6, 0]}>
          <boxGeometry args={[0.9, 0.6, 0.12]} />
          <meshStandardMaterial color="#2A2C33" metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[-0.03, 2.93, 0.17]} rotation={[0.5, -0.6, 0]}>
          <planeGeometry args={[0.82, 0.52]} />
          <meshBasicMaterial color="#FFFFFF" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};
