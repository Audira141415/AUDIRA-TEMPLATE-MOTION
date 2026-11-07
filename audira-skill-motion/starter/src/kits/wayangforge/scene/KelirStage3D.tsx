import React, { useMemo } from "react";
import * as THREE from "three";
import { BLENCONG, KELIR, computeWayangState } from "../core/motion";
import { WAYANG_PALETTE as P } from "../lib/palette";
import { makeGlowTexture, makeKawungTexture, makeKelirGlowTexture, makeParangTexture, makeWoodTexture } from "../lib/materials";

const Bronze: React.FC<{ color?: string }> = ({ color = P.bronze }) => (
  <meshStandardMaterial color={color} metalness={0.85} roughness={0.32} envMapIntensity={1.2} />
);

/** Hanging gong with a raised boss. */
const Gong: React.FC<{ position: [number, number, number]; r: number; rotY?: number; t: number }> = ({ position, r, rotY = 0, t }) => (
  <group position={position} rotation={[Math.sin(t * 0.9) * 0.02, rotY, 0]}>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[r, r, 0.08, 40]} />
      <Bronze />
    </mesh>
    <mesh position={[0, 0, 0.06]}>
      <sphereGeometry args={[r * 0.22, 20, 12]} />
      <Bronze color="#C8924A" />
    </mesh>
    <mesh position={[0, r + 0.35, 0]}>
      <cylinderGeometry args={[0.01, 0.01, 0.7, 4]} />
      <meshStandardMaterial color="#2A1A10" />
    </mesh>
  </group>
);

/** Rack of kettle gongs (bonang / kenong style pots). */
const PotRack: React.FC<{ position: [number, number, number]; rotY: number; wood: THREE.Texture }> = ({ position, rotY, wood }) => (
  <group position={position} rotation={[0, rotY, 0]}>
    <mesh position={[0, 0.35, 0]}>
      <boxGeometry args={[1.5, 0.7, 0.55]} />
      <meshStandardMaterial map={wood} color="#9A6A44" roughness={0.7} />
    </mesh>
    {[-0.5, 0, 0.5].map((x, i) =>
      [-0.12, 0.12].map((z, j) => (
        <group key={`${i}-${j}`} position={[x, 0.78, z]}>
          <mesh>
            <cylinderGeometry args={[0.16, 0.12, 0.14, 24]} />
            <Bronze />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.05, 12, 8]} />
            <Bronze color="#D29B52" />
          </mesh>
        </group>
      )),
    )}
  </group>
);

export const KelirStage3D: React.FC<{ f: number }> = ({ f }) => {
  const s = computeWayangState(f);
  const kawung = useMemo(() => makeKawungTexture(), []);
  const floorBatik = useMemo(() => {
    const t = makeKawungTexture("#2A1B3D", "#B48A5A", "#120C1E");
    t.repeat.set(10, 10);
    return t;
  }, []);
  const parang = useMemo(() => makeParangTexture(), []);
  const glowFront = useMemo(() => makeKelirGlowTexture(false), []);
  const glowBack = useMemo(() => makeKelirGlowTexture(true), []);
  const glow = useMemo(() => makeGlowTexture(), []);
  const wood = useMemo(() => makeWoodTexture(3), []);
  const panel = useMemo(() => {
    const t = makeKawungTexture();
    t.repeat.set(9, 1);
    return t;
  }, []);

  const { width: W, height: H, centerY: CY } = KELIR;
  const flame = s.flame;
  const border = 0.11;

  return (
    <group>
      {/* batik floor carpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial map={floorBatik} roughness={0.92} color="#9B8CA8" />
      </mesh>

      {/* the kelir: front (dalang side) lit cloth, back (audience side) glowing cloth */}
      <mesh position={[0, CY, 0]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial map={glowFront} roughness={0.95} emissive="#7A5428" emissiveMap={glowFront} emissiveIntensity={0.35 * flame} />
      </mesh>
      <mesh position={[0, CY, -0.002]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial map={glowBack} color={new THREE.Color(1, 1, 1).multiplyScalar(0.8 + 0.25 * flame)} />
      </mesh>
      {/* batik border band around the cloth, both faces */}
      {[
        [0, CY + H / 2 - border / 2, W, border],
        [0, CY - H / 2 + border / 2, W, border],
      ].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <boxGeometry args={[w, h, 0.012]} />
          <meshStandardMaterial map={parang} roughness={0.85} />
        </mesh>
      ))}

      {/* carved wooden frame (gawangan) */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (W / 2 + 0.13), 0, 0]}>
          <mesh position={[0, 1.95, 0]}>
            <boxGeometry args={[0.24, 3.9, 0.24]} />
            <meshStandardMaterial map={wood} roughness={0.6} color="#B07850" />
          </mesh>
          <mesh position={[0, 4.05, 0]}>
            <coneGeometry args={[0.16, 0.42, 8]} />
            <meshStandardMaterial color={P.pradaGold} metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 3.32, 0]}>
        <boxGeometry args={[W + 0.6, 0.22, 0.26]} />
        <meshStandardMaterial map={wood} roughness={0.6} color="#B07850" />
      </mesh>
      <mesh position={[0, 3.72, 0]}>
        <boxGeometry args={[W + 0.6, 0.55, 0.1]} />
        <meshStandardMaterial map={panel} roughness={0.75} />
      </mesh>
      <mesh position={[0, 4.02, 0]}>
        <boxGeometry args={[W + 0.7, 0.07, 0.14]} />
        <meshStandardMaterial color={P.pradaGold} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* gedebog: banana trunks that hold the puppets */}
      {[0.22, 0.48].map((z, i) => (
        <mesh key={i} position={[0, 0.5 + i * 0.07, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 7.8, 20]} />
          <meshStandardMaterial color={P.gedebog} roughness={0.75} />
        </mesh>
      ))}

      {/* blencong oil lamp */}
      <group position={BLENCONG}>
        <mesh position={[0, -0.14, 0.14]} scale={[1, 0.6, 1.5]}>
          <sphereGeometry args={[0.08, 24, 16]} />
          <meshStandardMaterial color="#C08A44" metalness={0.7} roughness={0.35} emissive="#6A3A12" emissiveIntensity={0.9} />
        </mesh>
        <mesh position={[0, -0.08, 0.28]} rotation={[0.6, 0, 0]}>
          <torusGeometry args={[0.05, 0.014, 8, 20]} />
          <Bronze />
        </mesh>
        <mesh position={[0, 0.85, 0.16]}>
          <cylinderGeometry args={[0.008, 0.008, 1.6, 4]} />
          <meshStandardMaterial color="#1A120C" />
        </mesh>
        {/* teardrop flame: orange body + hot core */}
        <mesh position={[0, 0.03 * flame, 0]} scale={[1, 1.8 * flame, 1]}>
          <sphereGeometry args={[0.035, 12, 10]} />
          <meshBasicMaterial color="#FF8A2A" toneMapped={false} transparent opacity={0.85} />
        </mesh>
        <mesh position={[0, 0.015, 0]} scale={[1, 1.5 * flame, 1]}>
          <sphereGeometry args={[0.018, 10, 8]} />
          <meshBasicMaterial color={P.blencongFlame} toneMapped={false} />
        </mesh>
        <sprite scale={[1.5 * flame, 1.5 * flame, 1]}>
          <spriteMaterial map={glow} color={P.blencongAmber} transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
        <pointLight color={P.blencongAmber} intensity={9 * flame} distance={14} decay={1.5} />
      </group>

      {/* gamelan and pendopo pillars for depth on both sides */}
      <Gong position={[-2.15, 1.55, 2.4]} r={0.42} rotY={0.5} t={s.t} />
      <Gong position={[-2.75, 1.7, 1.6]} r={0.3} rotY={0.6} t={s.t + 1} />
      <PotRack position={[2.3, 0, 2.3]} rotY={-0.6} wood={wood} />
      {[
        [-4.2, -3.2],
        [4.2, -3.2],
        [-4.2, 3.4],
        [4.2, 3.4],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 2.6, 0]}>
            <cylinderGeometry args={[0.2, 0.22, 5.2, 16]} />
            <meshStandardMaterial map={wood} color="#8A5A38" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.6, 0.5, 0.6]} />
            <meshStandardMaterial map={kawung} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
