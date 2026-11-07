import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SKETCH_PALETTE as P } from "../lib/palette";
import { SketchState, V3, clamp01, flatten, lerp3, ramp, smooth } from "../core/motion";
import { Stroke, buildStrokes } from "../core/house";

const Y = new THREE.Vector3(0, 1, 0);
const tmpM = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();
const tmpS = new THREE.Vector3();
const tmpP = new THREE.Vector3();
const tmpD = new THREE.Vector3();

/** Write one round "graphite" segment into an instanced mesh (unit cylinder along +Y). */
const setSeg = (mesh: THREE.InstancedMesh, i: number, a: V3, b: V3, r: number) => {
  tmpD.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const len = tmpD.length();
  if (len < 1e-5 || r <= 0) {
    tmpM.makeScale(0, 0, 0);
    mesh.setMatrixAt(i, tmpM);
    return;
  }
  tmpD.divideScalar(len);
  tmpQ.setFromUnitVectors(Y, tmpD);
  tmpP.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
  tmpS.set(r, len, r);
  tmpM.compose(tmpP, tmpQ, tmpS);
  mesh.setMatrixAt(i, tmpM);
};

const extend = (a: V3, b: V3, e: number): [V3, V3] => {
  const d = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) || 1;
  const u: V3 = [(b[0] - a[0]) / d, (b[1] - a[1]) / d, (b[2] - a[2]) / d];
  return [
    [a[0] - u[0] * e, a[1] - u[1] * e, a[2] - u[2] * e],
    [b[0] + u[0] * e, b[1] + u[1] * e, b[2] + u[2] * e],
  ];
};

const visible = (st: Stroke, draw: number) => clamp01((draw - st.start) / Math.max(1e-4, st.end - st.start));

/** Current pencil tip on the page (end of the stroke being drawn). */
export const pencilTip = (strokes: Stroke[], draw: number): V3 => {
  let cur = strokes[strokes.length - 1];
  for (const st of strokes) if (draw >= st.start && draw < st.end) cur = st;
  const v = visible(cur, draw);
  const [a, b] = extend(flatten(cur.a), flatten(cur.b), 0.05);
  return lerp3(a, b, v);
};

export const useStrokes = () => useMemo(buildStrokes, []);

/** The drawing that stays on the page (construction, edges in two sketchy passes, hatching). */
export const FlatSketch: React.FC<{ s: SketchState; strokes: Stroke[]; unit: number }> = ({ s, strokes, unit }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = strokes.length * 2;
  useLayoutEffect(() => {
    const m = ref.current!;
    const c = new THREE.Color();
    strokes.forEach((st, i) => {
      const v = visible(st, s.draw);
      const [a, b] = extend(flatten(st.a), flatten(st.b), st.kind === "hatch" ? 0 : 0.06);
      const end = lerp3(a, b, v);
      const w = st.kind === "edge" ? 0.013 : st.kind === "cons" ? 0.007 : 0.006;
      // construction lines get lighter as the object lifts (erased softly)
      const fade = st.kind === "cons" ? 1 - 0.55 * smooth(s.extrude) : 1;
      setSeg(m, i * 2, a, end, w * unit * (v > 0 ? 1 : 0));
      c.set(st.kind === "edge" ? P.graphite : st.kind === "cons" ? P.graphiteSoft : P.graphiteMid).lerp(new THREE.Color(P.paper), 1 - fade);
      m.setColorAt(i * 2, c);
      // second sketchy pass on edges, slightly offset, drawn a beat later
      const v2 = st.kind === "edge" ? clamp01(v * 1.4 - 0.4) : 0;
      const j = st.jitter;
      setSeg(m, i * 2 + 1, [a[0] + j[0], a[1], a[2] + j[2]], lerp3([a[0] + j[0], a[1], a[2] + j[2]], [b[0] - j[2], b[1], b[2] + j[0]], v2), 0.007 * unit * (v2 > 0 ? 1 : 0));
      m.setColorAt(i * 2 + 1, c.set(P.graphiteMid));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <cylinderGeometry args={[1, 1, 1, 5]} />
      <meshBasicMaterial color="#FFFFFF" />
    </instancedMesh>
  );
};

/** The edges that peel off the page and extrude into a 3D wireframe (in house-local space). */
export const LiftWire: React.FC<{ s: SketchState; strokes: Stroke[]; unit: number }> = ({ s, strokes, unit }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const edges = useMemo(() => strokes.filter((st) => st.kind === "edge"), [strokes]);
  useLayoutEffect(() => {
    const m = ref.current!;
    const on = s.extrude > 0 ? 1 : 0;
    edges.forEach((st, i) => {
      const k = smooth(ramp(s.extrude, st.liftDelay, st.liftDelay + 0.45));
      const a = lerp3(flatten(st.a), st.a, k);
      const b = lerp3(flatten(st.b), st.b, k);
      // lines peel up with a slight arc so they read as lifting off the paper, not sliding
      const arc = Math.sin(k * Math.PI) * 0.25;
      a[1] += arc;
      b[1] += arc;
      const [ea, eb] = extend(a, b, 0.03 * (1 - k));
      setSeg(m, i, ea, eb, 0.012 * unit * on * (0.15 + 0.85 * s.wire));
    });
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, edges.length]} frustumCulled={false} castShadow>
      <cylinderGeometry args={[1, 1, 1, 6]} />
      <meshStandardMaterial color={P.graphite} roughness={0.45} metalness={0.35} />
    </instancedMesh>
  );
};
