import React, { useMemo } from "react";
import * as THREE from "three";
import { INK_LINES, LECTERN, LINE_W, LINE_X0, computeManuscriptState, lineProgress, lineY } from "../core/motion";
import { makeFeatherTexture, makeInitialAlpha, makeInkLineTexture, makeLeftPageTexture, makeRightPageTexture, makeWoodTexture } from "../lib/materials";

export const INITIAL_POS: [number, number] = [-0.455, 0.265];

/** The pen point on the right page at time t (lectern-local XY). */
export const quillPoint = (t: number): [number, number, number] => {
  let line = 0;
  for (let i = 0; i < INK_LINES; i++) if (lineProgress(t, i) > 0) line = i;
  const p = lineProgress(t, line);
  return [LINE_X0 + LINE_W * p, lineY(line), p];
};

/** Writing desk, slanted lectern, open codex with gold-leaf initial, ink being written, quill and ink pot. */
export const CodexLectern3D: React.FC<{ f: number }> = ({ f }) => {
  const s = computeManuscriptState(f);
  const t = s.t;
  const tex = useMemo(
    () => ({
      left: makeLeftPageTexture(),
      right: makeRightPageTexture(),
      initial: makeInitialAlpha(),
      feather: makeFeatherTexture(),
      desk: (() => {
        const w = makeWoodTexture(5);
        w.repeat.set(2, 1);
        return w;
      })(),
      lectern: makeWoodTexture(8, "#4A2C18"),
      lines: Array.from({ length: INK_LINES }, (_, i) => makeInkLineTexture(500 + i, i === 6)),
    }),
    [],
  );

  const [qx, qy, qp] = quillPoint(t);
  const writing = t > 1.8 && t < 8.6;
  const lift = writing ? 0.004 * Math.abs(Math.sin(t * 38)) : Math.min(0.12, Math.max(0, t - 8.6) * 0.1);

  return (
    <group>
      {/* walnut writing desk + back wall */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[4.2, 0.1, 2.6]} />
        <meshStandardMaterial map={tex.desk} roughness={0.55} color="#B88A66" />
      </mesh>
      <mesh position={[0, 1.4, -1.5]}>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color="#2A1C12" roughness={1} />
      </mesh>

      {/* lectern support */}
      <mesh position={[0, 0.22, -0.32]} rotation={[-0.5, 0, 0]} castShadow>
        <boxGeometry args={[0.9, 0.5, 0.06]} />
        <meshStandardMaterial map={tex.lectern} roughness={0.6} />
      </mesh>

      <group position={LECTERN.pos} rotation={[LECTERN.tilt, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.0, 0.04]} />
          <meshStandardMaterial map={tex.lectern} roughness={0.55} />
        </mesh>
        <mesh position={[0, -0.52, 0.04]}>
          <boxGeometry args={[1.5, 0.04, 0.06]} />
          <meshStandardMaterial map={tex.lectern} roughness={0.55} />
        </mesh>
        {/* leather binding + page blocks */}
        <mesh position={[0, 0, 0.026]} castShadow>
          <boxGeometry args={[1.36, 0.92, 0.012]} />
          <meshStandardMaterial color="#5A1A12" roughness={0.6} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.33, 0, 0.04]} rotation={[0, side * -0.06, 0]}>
            <boxGeometry args={[0.62, 0.86, 0.02]} />
            <meshStandardMaterial color="#E2CFA4" roughness={0.9} />
          </mesh>
        ))}

        {/* left page with finished text and the raised gold-leaf initial */}
        <group rotation={[0, 0.06, 0]}>
          <mesh position={[-0.33, 0, 0.051]} receiveShadow>
            <planeGeometry args={[0.62, 0.86]} />
            <meshStandardMaterial map={tex.left} roughness={0.85} />
          </mesh>
          <mesh position={[INITIAL_POS[0], INITIAL_POS[1], 0.054]}>
            <planeGeometry args={[0.19, 0.19]} />
            <meshStandardMaterial
              color="#B8801C"
              alphaMap={tex.initial}
              transparent
              alphaTest={0.3}
              metalness={0.9}
              roughness={0.3}
              envMapIntensity={0.7}
              emissive="#7A5010"
              emissiveIntensity={0.1 + 0.6 * s.gleamPower}
            />
          </mesh>
        </group>

        {/* right page: ruled, the ink is written line by line */}
        <group rotation={[0, -0.06, 0]}>
          <mesh position={[0.33, 0, 0.051]} receiveShadow>
            <planeGeometry args={[0.62, 0.86]} />
            <meshStandardMaterial map={tex.right} roughness={0.85} />
          </mesh>
          {tex.lines.map((lt, i) => {
            const p = lineProgress(t, i);
            if (p <= 0) return null;
            lt.repeat.set(p, 1);
            return (
              <mesh key={i} position={[LINE_X0 + (LINE_W * p) / 2, lineY(i), 0.053]} scale={[LINE_W * p, 0.032, 1]}>
                <planeGeometry args={[1, 1]} />
                <meshStandardMaterial map={lt} transparent alphaTest={0.2} roughness={0.35} />
              </mesh>
            );
          })}
          {/* quill: nib on the writing point, feather leaning out toward the scribe */}
          <group position={[qx, qy + 0.012, 0.056 + lift]} rotation={[0.85, 0, -0.55 + Math.sin(qp * Math.PI * 6) * 0.03]}>
            <mesh position={[0, 0.24, 0]}>
              <planeGeometry args={[0.1, 0.42]} />
              <meshStandardMaterial map={tex.feather} transparent alphaTest={0.3} side={THREE.DoubleSide} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.004, 0.0015, 0.07, 6]} />
              <meshStandardMaterial color="#2A1A10" roughness={0.3} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ink pot */}
      <group position={[0.62, 0.0, 0.32]}>
        <mesh position={[0, 0.06, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 0.12, 24]} />
          <meshPhysicalMaterial color="#1A1410" roughness={0.1} metalness={0} clearcoat={1} />
        </mesh>
        <mesh position={[0, 0.121, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.035, 20]} />
          <meshStandardMaterial color="#050302" roughness={0.05} />
        </mesh>
      </group>
    </group>
  );
};
