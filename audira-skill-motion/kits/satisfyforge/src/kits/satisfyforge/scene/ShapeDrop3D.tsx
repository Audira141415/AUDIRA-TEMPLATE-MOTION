import React, { useMemo } from "react";
import * as THREE from "three";
import { DROP_TIMES, clamp01, easeInQuad, lerp, settle, win } from "../core/motion";
import { SATISFYFORGE_PALETTE as P } from "../lib/palette";
import { circleShape, squareShape, starShape, triangleShape } from "../lib/materials";
import { PLINTH_TOP, STATIONS } from "./StudioSweep3D";

// Loop 3 — four pastel pieces drop into four precisely matching holes. Each piece spins on the
// way down and its rotation reaches exactly zero at the moment it meets the hole: perfect fit.

const BOARD_T = 0.22;
const GAP = 0.03; // clearance hole vs piece
const SLOTS: { cx: number; cy: number; kind: "circle" | "square" | "triangle" | "star"; color: string }[] = [
  { cx: -0.4, cy: 0.3, kind: "circle", color: P.sky },
  { cx: 0.4, cy: 0.3, kind: "square", color: P.butter },
  { cx: -0.4, cy: -0.3, kind: "triangle", color: P.mint },
  { cx: 0.4, cy: -0.3, kind: "star", color: P.pink },
];

const outline = (kind: string, cx: number, cy: number, grow: number) => {
  switch (kind) {
    case "circle":
      return circleShape(0.2 + grow, cx, cy);
    case "square":
      return squareShape(0.17 + grow, cx, cy);
    case "triangle":
      return triangleShape(0.25 + grow * 1.8, cx, cy);
    default:
      return starShape(0.26 + grow * 1.6, 0.48, cx, cy);
  }
};

export const ShapeDrop3D: React.FC<{ t: number }> = ({ t }) => {
  const boardGeo = useMemo(() => {
    const sh = new THREE.Shape();
    const w = 0.85;
    const h = 0.68;
    const r = 0.12;
    sh.moveTo(-w + r, -h);
    sh.lineTo(w - r, -h);
    sh.quadraticCurveTo(w, -h, w, -h + r);
    sh.lineTo(w, h - r);
    sh.quadraticCurveTo(w, h, w - r, h);
    sh.lineTo(-w + r, h);
    sh.quadraticCurveTo(-w, h, -w, h - r);
    sh.lineTo(-w, -h + r);
    sh.quadraticCurveTo(-w, -h, -w + r, -h);
    SLOTS.forEach((s) => sh.holes.push(outline(s.kind, s.cx, s.cy, GAP)));
    const g = new THREE.ExtrudeGeometry(sh, { depth: BOARD_T, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 3, curveSegments: 40 });
    g.rotateX(-Math.PI / 2); // lie flat: shape y → -z, extrusion → +y
    return g;
  }, []);
  const pieceGeos = useMemo(
    () =>
      SLOTS.map((s) => {
        const g = new THREE.ExtrudeGeometry(outline(s.kind, 0, 0, 0), { depth: BOARD_T, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 3, curveSegments: 40 });
        g.rotateX(-Math.PI / 2);
        return g;
      }),
    [],
  );

  const boardY = PLINTH_TOP + 0.02;
  // payoff glow after the last piece seats
  const done = DROP_TIMES[DROP_TIMES.length - 1] + 0.42;
  const glow = clamp01((t - done) / 0.3) * (1 - clamp01((t - done - 0.9) / 0.8));

  return (
    <group position={[STATIONS[2], 0, 0]}>
      <mesh geometry={boardGeo} position={[0, boardY, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color={P.lilac} roughness={0.4} clearcoat={0.6} emissive={P.lilac} emissiveIntensity={glow * 0.35} />
      </mesh>
      {/* hole floors (so the pieces sit on something) */}
      <mesh position={[0, boardY + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.7, 1.36]} />
        <meshStandardMaterial color="#B9A6E6" roughness={0.9} />
      </mesh>
      {SLOTS.map((s, i) => {
        const td = DROP_TIMES[i];
        const fall = clamp01((t - (td - 0.75)) / 0.75);
        const seated = t > td + 0.42;
        // fall to the board top, then slide the last BOARD_T into the hole
        const yTop = boardY + BOARD_T + 0.02;
        const yIn = boardY + 0.002;
        const yAir = 2.6 + i * 0.15;
        let y = lerp(yAir, yTop, easeInQuad(fall));
        if (t > td) y = lerp(yTop, yIn, easeInQuad(win(t, td, td + 0.42)));
        if (seated) y = yIn + Math.abs(settle(t, td + 0.42, 0.018, 20, 9));
        const spin = (1 - fall) * (2.5 + i * 0.6);
        const visible = t > td - 1.1;
        return (
          <group key={i} position={[s.cx, y, -s.cy]} rotation={[0, spin, 0]} visible={visible}>
            <mesh geometry={pieceGeos[i]} castShadow receiveShadow>
              <meshPhysicalMaterial color={s.color} roughness={0.25} clearcoat={1} clearcoatRoughness={0.1} emissive={s.color} emissiveIntensity={seated ? glow * 0.4 : 0} />
            </mesh>
          </group>
        );
      })}
      {/* seat pulses */}
      {SLOTS.map((s, i) => {
        const a = t - DROP_TIMES[i] - 0.42;
        if (a < 0 || a > 0.7) return null;
        const r = 0.3 + a * 0.6;
        return (
          <mesh key={`p${i}`} position={[s.cx, boardY + BOARD_T + 0.03, -s.cy]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r, r + 0.025, 48]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={(1 - a / 0.7) * 0.85} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};
