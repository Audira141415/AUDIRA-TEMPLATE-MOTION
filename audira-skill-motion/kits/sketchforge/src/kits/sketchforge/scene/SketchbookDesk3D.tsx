import React, { useMemo } from "react";
import * as THREE from "three";
import { SKETCH_PALETTE as P } from "../lib/palette";
import { makeDeskTexture, makeSketchPaper } from "../lib/materials";
import { SketchState, V3, rng, smooth, ramp, BEAT } from "../core/motion";

export const PAGE = { w: 5.4, d: 7.2, cz: -0.4 };

export const SketchbookDesk3D: React.FC = () => {
  const tex = useMemo(() => ({ paper: makeSketchPaper(), desk: makeDeskTexture() }), []);
  const rings = useMemo(() => Array.from({ length: 15 }, (_, i) => -PAGE.w / 2 + 0.35 + (i * (PAGE.w - 0.7)) / 14), []);
  const shavings = useMemo(() => {
    const r = rng(3);
    return Array.from({ length: 16 }, () => ({ p: [3.1 + r() * 1.2, 0.01, 1.2 + r() * 1.4] as V3, rot: r() * 6, s: 0.05 + r() * 0.08 }));
  }, []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial map={tex.desk} roughness={0.7} metalness={0.05} />
      </mesh>
      {/* hard cover + page block */}
      <mesh position={[0.06, -0.07, PAGE.cz + 0.05]} receiveShadow castShadow>
        <boxGeometry args={[PAGE.w + 0.25, 0.05, PAGE.d + 0.25]} />
        <meshStandardMaterial color={P.graphite} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.025, PAGE.cz]} receiveShadow>
        <boxGeometry args={[PAGE.w, 0.045, PAGE.d]} />
        <meshStandardMaterial color={P.paperShade} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, PAGE.cz]} receiveShadow>
        <planeGeometry args={[PAGE.w, PAGE.d]} />
        <meshStandardMaterial map={tex.paper} roughness={1} />
      </mesh>
      {/* spiral binding */}
      {rings.map((x) => (
        <mesh key={x} position={[x, 0.02, PAGE.cz - PAGE.d / 2 - 0.02]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <torusGeometry args={[0.12, 0.018, 8, 20]} />
          <meshStandardMaterial color="#9EA0A6" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
      {/* eraser with accent sleeve */}
      <group position={[3.4, 0.08, -1.0]} rotation={[0, 0.5, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.22, 0.42]} />
          <meshStandardMaterial color={P.paperWhite} roughness={0.9} />
        </mesh>
        <mesh position={[0.18, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 0.235, 0.435]} />
          <meshStandardMaterial color={P.accent} roughness={0.6} />
        </mesh>
      </group>
      {/* pencil shavings */}
      {shavings.map((sh, i) => (
        <mesh key={i} position={sh.p} rotation={[-Math.PI / 2, 0, sh.rot]} scale={sh.s}>
          <circleGeometry args={[1, 10, 0, 4]} />
          <meshStandardMaterial color={i % 3 === 0 ? P.accent : P.wood} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

/** Pencil: draws along the stroke tip, then is set down beside the book. Tip is the group origin. */
export const Pencil3D: React.FC<{ s: SketchState; tip: V3 }> = ({ s, tip }) => {
  const q = useMemo(() => {
    const drawQ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0.45, 0.82, 0.5).normalize());
    const restQ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0.02, 0.35).normalize());
    return { drawQ, restQ };
  }, []);
  const away = smooth(ramp(s.t, BEAT.draw[1], BEAT.draw[1] + 0.9));
  const rest: V3 = [2.55, 0.07, 2.0];
  const hover = Math.sin(s.t * 40) * 0.006 * (1 - away);
  const pos: V3 = [tip[0] + (rest[0] - tip[0]) * away, tip[1] + hover + (rest[1] - tip[1]) * away + Math.sin(away * Math.PI) * 0.8, tip[2] + (rest[2] - tip[2]) * away];
  const quat = q.drawQ.clone().slerp(q.restQ, away);
  return (
    <group position={pos} quaternion={quat}>
      <mesh position={[0, 0.03, 0]} castShadow>
        <coneGeometry args={[0.012, 0.06, 6]} />
        <meshStandardMaterial color={P.graphite} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.055, 0.14, 6]} />
        <meshStandardMaterial color={P.wood} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 1.5, 6]} />
        <meshStandardMaterial color={P.accent} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.74, 0]} castShadow>
        <cylinderGeometry args={[0.057, 0.057, 0.08, 12]} />
        <meshStandardMaterial color="#B9BBC0" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.83, 0]} castShadow>
        <cylinderGeometry args={[0.054, 0.054, 0.12, 12]} />
        <meshStandardMaterial color={P.paperWhite} roughness={0.9} />
      </mesh>
    </group>
  );
};
