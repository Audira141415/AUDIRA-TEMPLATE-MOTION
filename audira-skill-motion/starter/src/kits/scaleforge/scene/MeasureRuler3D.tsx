// SCALEFORGE — the measuring layer: a ground ruler whose ticks re-decade as you zoom (major 10^k, minor 10^(k-1)),
// and a height bracket + order-of-magnitude label for whichever subject currently fills the frame.
import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SCALE_PALETTE as P } from "../lib/palette";
import { makeMeasureLabel } from "../lib/materials";
import { clamp, fmtLen, OBJECTS, order, spaceMix, sup, toRender, zoomAt } from "../core/motion";

type Z = ReturnType<typeof zoomAt>;
const MAX_TICKS = 640;
const SPAN = 14; // render units each side

export const MeasureRuler3D: React.FC<{ z: Z; t: number }> = ({ z, t }) => {
  const majRef = useRef<THREE.InstancedMesh>(null);
  const minRef = useRef<THREE.InstancedMesh>(null);
  const labels = useMemo(
    () => OBJECTS.map((o, i) => makeMeasureLabel(`10${sup(order(o.size))} m`, `${o.name} · ${fmtLen(o.size)}`, i >= 4)),
    [],
  );
  const groundY = toRender([0, 0], z)[1];
  const sm = spaceMix(z.e);
  const ink = new THREE.Color(P.ink).lerp(new THREE.Color(P.inkLight), sm);

  // decade selection: major spacing in render units lies in [0.5, 5)
  const k = Math.ceil(Math.log10(z.S) - 0.3);
  const major = Math.pow(10, k) / z.S;
  const minor = major / 10;
  const minorAlpha = clamp((minor - 0.06) / 0.12);

  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    const place = (m: THREE.InstancedMesh, step: number, realStep: number, h: number) => {
      const first = Math.ceil((z.c[0] - SPAN * z.S) / realStep);
      let n = 0;
      for (let j = first; n < MAX_TICKS; j++) {
        const x = (j * realStep - z.c[0]) / z.S;
        if (x > SPAN) break;
        const isTen = Math.abs(j % 10) === 0;
        o.position.set(x, groundY + 0.004, 1.25);
        o.scale.set(1, 1, isTen && step < major ? 0.0001 : h);
        o.updateMatrix();
        m.setMatrixAt(n++, o.matrix);
      }
      for (let r = n; r < MAX_TICKS; r++) {
        o.scale.setScalar(0.0001);
        o.updateMatrix();
        m.setMatrixAt(r, o.matrix);
      }
      m.instanceMatrix.needsUpdate = true;
    };
    if (majRef.current) place(majRef.current, major, Math.pow(10, k), 1);
    if (minRef.current) place(minRef.current, minor, Math.pow(10, k - 1), 0.45);
  }, [z, groundY, k, major, minor]);

  // the subject that fills the frame gets the bracket + label
  const subjects = OBJECTS.map((o, i) => {
    const h = o.height / z.S;
    const win = clamp((h - 0.7) / 0.6) * clamp((9 - h) / 2.5);
    return { o, i, h, win };
  }).filter((s) => s.win > 0.02);

  // tiny-Earth marker during the Sun reveal
  const earth = OBJECTS[4];
  const eh = earth.height / z.S;
  const ePos = toRender(earth.pos, z);
  const eWin = clamp((0.5 - eh) / 0.2) * clamp((eh - 0.006) / 0.01);

  return (
    <group>
      {eWin > 0.01 && (
        <group position={[ePos[0], ePos[1], 0.2]}>
          <mesh>
            <ringGeometry args={[0.11, 0.13, 48]} />
            <meshBasicMaterial color={P.accentCool} transparent opacity={eWin} toneMapped={false} depthTest={false} />
          </mesh>
          <sprite position={[-0.2, 0.5, 0]} scale={[1.3, 0.41, 1]}>
            <spriteMaterial fog={false} map={labels[4]} transparent opacity={eWin} depthTest={false} />
          </sprite>
        </group>
      )}
      {/* ruler bar */}
      <mesh position={[0, groundY + 0.002, 1.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[SPAN * 2, 0.36]} />
        <meshBasicMaterial color={sm > 0.5 ? "#0C1322" : "#FFFFFF"} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, groundY + 0.004, 1.53]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[SPAN * 2, 0.02]} />
        <meshBasicMaterial color={P.accent} toneMapped={false} />
      </mesh>
      <instancedMesh ref={majRef} args={[undefined, undefined, MAX_TICKS]}>
        <boxGeometry args={[0.018, 0.004, 0.3]} />
        <meshBasicMaterial color={ink} />
      </instancedMesh>
      <instancedMesh ref={minRef} args={[undefined, undefined, MAX_TICKS]}>
        <boxGeometry args={[0.01, 0.004, 0.3]} />
        <meshBasicMaterial color={ink} transparent opacity={minorAlpha} />
      </instancedMesh>

      {subjects.map(({ o, i, h, win }) => {
        const [cx] = toRender([o.pos[0] + o.size / 2, 0], z);
        const [mid] = toRender([o.pos[0], 0], z);
        const x = cx + 0.18;
        const top = groundY + h;
        const breathe = 1 + Math.sin(t * 2 + i) * 0.01;
        return (
          <group key={o.key}>
            <mesh position={[x, groundY + h / 2, 0.6]}>
              <boxGeometry args={[0.022, h, 0.022]} />
              <meshBasicMaterial color={P.accent} transparent opacity={win} toneMapped={false} />
            </mesh>
            {[groundY, top].map((y, j) => (
              <mesh key={j} position={[x, y, 0.6]}>
                <boxGeometry args={[0.22, 0.022, 0.022]} />
                <meshBasicMaterial color={P.accent} transparent opacity={win} toneMapped={false} />
              </mesh>
            ))}
            <sprite
              position={[Math.max(-1.1, Math.min(mid, 1.1)), Math.min(top + 0.45, 1.2), 0.9]}
              scale={[1.6 * breathe, 0.5 * breathe, 1]}
            >
              <spriteMaterial fog={false} map={labels[i]} transparent opacity={win} depthTest={false} />
            </sprite>
          </group>
        );
      })}
    </group>
  );
};
