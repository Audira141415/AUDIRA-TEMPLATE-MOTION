// TACTICBOARD — telestrator layer: passing lanes that draw on, dashed run arrows, ball + trail, golden replay path.
import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { TACTIC_PALETTE as P } from "../lib/palette";
import { ballPos, BEATS, clamp, LANES, playerPos, idx, seg, type V2 } from "../core/motion";

const sampleCurve = (a: number, b: number, n: number, yLift = 0.03) => {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= n; i++) {
    const p = ballPos(a + ((b - a) * i) / n);
    pts.push(new THREE.Vector3(p[0], p[1] + yLift, p[2]));
  }
  return new THREE.CatmullRomCurve3(pts);
};

/** Tube whose visible length is driven by drawRange (indices are ordered along the path). */
const DrawTube: React.FC<{ curve: THREE.Curve<THREE.Vector3>; radius: number; draw: number; opacity: number; color: string }> = ({
  curve,
  radius,
  draw,
  opacity,
  color,
}) => {
  const SEG = 96;
  const RAD = 8;
  const geo = useMemo(() => new THREE.TubeGeometry(curve, SEG, radius, RAD, false), [curve, radius]);
  geo.setDrawRange(0, Math.floor(clamp(draw) * SEG) * RAD * 6);
  if (opacity <= 0.01 || draw <= 0.001) return null;
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} depthWrite={false} />
    </mesh>
  );
};

/** Dashed run arrow: instanced dashes along a curve + cone head; grows with `draw`. */
const RunArrow: React.FC<{ from: V2; to: V2; bend: number; draw: number; opacity: number }> = ({ from, to, bend, draw, opacity }) => {
  const N = 26;
  const ref = useRef<THREE.InstancedMesh>(null);
  const curve = useMemo(() => {
    const a = new THREE.Vector3(from[0], 0.03, from[1]);
    const c = new THREE.Vector3(to[0], 0.03, to[1]);
    const mid = a.clone().lerp(c, 0.5);
    const n = new THREE.Vector3(-(c.z - a.z), 0, c.x - a.x).normalize().multiplyScalar(bend);
    return new THREE.QuadraticBezierCurve3(a, mid.add(n), c);
  }, [from, to, bend]);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    for (let i = 0; i < N; i++) {
      const u = i / N;
      const on = u < draw * 0.94;
      const p = curve.getPoint(u);
      const tan = curve.getTangent(u);
      o.position.copy(p);
      o.rotation.set(0, Math.atan2(tan.x, tan.z), 0);
      o.scale.setScalar(on ? 1 : 0.0001);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [curve, draw]);
  const head = curve.getPoint(clamp(draw));
  const ht = curve.getTangent(clamp(draw, 0.01, 1));
  if (opacity <= 0.01 || draw <= 0.001) return null;
  return (
    <group>
      <instancedMesh ref={ref} args={[undefined, undefined, N]}>
        <boxGeometry args={[0.05, 0.012, 0.09]} />
        <meshBasicMaterial color={P.run} transparent opacity={opacity} toneMapped={false} />
      </instancedMesh>
      <mesh position={[head.x, 0.035, head.z]} rotation={[0, Math.atan2(ht.x, ht.z), 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <coneGeometry args={[0.08, 0.18, 3]} />
            <meshBasicMaterial color={P.run} transparent opacity={opacity} toneMapped={false} />
          </mesh>
        </group>
      </mesh>
    </group>
  );
};

const Trail: React.FC<{ t: number }> = ({ t }) => {
  const N = 22;
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    for (let i = 0; i < N; i++) {
      const tt = t - (i + 1) * 0.028;
      const p = ballPos(Math.max(0, tt));
      const moving = Math.hypot(...ballPos(tt).map((v, j) => v - ballPos(tt - 0.02)[j])) > 0.004;
      o.position.set(p[0], p[1], p[2]);
      o.scale.setScalar(moving ? 0.05 * (1 - i / N) : 0.0001);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [t]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, N]}>
      <sphereGeometry args={[1, 10, 8]} />
      <meshBasicMaterial color={P.lane} transparent opacity={0.55} toneMapped={false} depthWrite={false} />
    </instancedMesh>
  );
};

export const PlayLines3D: React.FC<{ t: number }> = ({ t }) => {
  const lanes = useMemo(() => LANES.map((l) => sampleCurve(l.win[0], l.win[1], 24)), []);
  const replay = useMemo(() => sampleCurve(BEATS.pass1[0], BEATS.goal, 160, 0.05), []);
  const b = ballPos(t);
  const spin = t * 9;

  const rb = idx(0, 2);
  const st = idx(0, 9);
  const replayOn = seg(t, 8.4, 10.3);

  return (
    <group>
      {/* passing lanes: draw on 0.6 s before the pass, fade 0.8 s after */}
      {LANES.map((l, i) => {
        const draw = seg(t, l.win[0] - 0.6, l.win[0]);
        const fade = 1 - seg(t, l.win[1] + 0.2, l.win[1] + 1.0);
        return <DrawTube key={i} curve={lanes[i]} radius={0.022} draw={draw} opacity={0.85 * fade} color={P.lane} />;
      })}

      {/* run arrows: RB overlap, ST near-post dart */}
      <RunArrow
        from={playerPos(rb, 2.6)}
        to={[3.0, -3.7]}
        bend={-0.35}
        draw={seg(t, 2.4, 3.6)}
        opacity={1 - seg(t, 5.8, 6.4)}
      />
      <RunArrow
        from={playerPos(st, 5.0)}
        to={[0.5, -4.2]}
        bend={0.3}
        draw={seg(t, 4.9, 5.8)}
        opacity={1 - seg(t, 7.2, 7.8)}
      />

      {/* golden replay of the full move */}
      <DrawTube curve={replay} radius={0.03} draw={replayOn} opacity={0.95 * replayOn} color={P.goalGold} />

      <Trail t={t} />
      <mesh position={b} rotation={[spin, spin * 0.3, 0]} castShadow>
        <icosahedronGeometry args={[0.055, 2]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} emissive="#FFFFFF" emissiveIntensity={0.15} flatShading />
      </mesh>
    </group>
  );
};
