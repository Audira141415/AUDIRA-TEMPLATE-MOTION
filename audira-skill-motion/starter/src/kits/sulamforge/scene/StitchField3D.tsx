import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { computeSulamState, stitchGrow } from "../core/motion";
import { THREAD_COLORS, goldThreadMaterial, silkMaterial } from "../lib/materials";
import { SULAM_PALETTE as P } from "../lib/palette";
import { ThreadGroup, activeStitch, buildPattern } from "../lib/pattern";
import { FAB_Y } from "./HoopStudio3D";

const GROUPS: ThreadGroup[] = ["crimson", "vermilion", "blush", "leaf", "moss", "gold"];
const dummy = new THREE.Object3D();

/** Instanced satin/fishbone/stem stitches that grow one by one, plus needle and live thread. */
export const StitchField3D: React.FC<{ f: number }> = ({ f }) => {
  const s = computeSulamState(f);
  const t = s.t;
  const pattern = useMemo(() => buildPattern(), []);
  const byGroup = useMemo(() => GROUPS.map((g) => pattern.stitches.filter((st) => st.group === g)), [pattern]);
  const materials = useMemo(() => GROUPS.map((g) => (g === "gold" ? goldThreadMaterial() : silkMaterial(THREAD_COLORS[g]))), []);
  const threadGeo = useMemo(() => new THREE.CylinderGeometry(1, 1, 1, 8).rotateZ(Math.PI / 2), []);
  const refs = useRef<(THREE.InstancedMesh | null)[]>([]);
  const knotRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    byGroup.forEach((list, gi) => {
      const m = refs.current[gi];
      if (!m) return;
      list.forEach((st, i) => {
        const g = stitchGrow(t, st.start);
        const dx = st.b[0] - st.a[0];
        const dz = st.b[1] - st.a[1];
        const len = Math.hypot(dx, dz);
        const ang = Math.atan2(dz, dx);
        const cur = len * g;
        dummy.position.set(st.a[0] + Math.cos(ang) * cur * 0.5, FAB_Y + st.r * 0.7, st.a[1] + Math.sin(ang) * cur * 0.5);
        dummy.rotation.set(0, -ang, 0);
        dummy.scale.set(Math.max(1e-4, cur), g > 0 ? st.r * 0.75 : 1e-4, g > 0 ? st.r : 1e-4);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
      });
      m.instanceMatrix.needsUpdate = true;
    });
    const km = knotRef.current;
    if (km) {
      pattern.knots.forEach((k, i) => {
        const g = stitchGrow(t, k.start);
        dummy.position.set(k.p[0], FAB_Y + 0.008, k.p[1]);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(Math.max(1e-4, 0.016 * g));
        dummy.updateMatrix();
        km.setMatrixAt(i, dummy.matrix);
      });
      km.instanceMatrix.needsUpdate = true;
    }
  }, [byGroup, pattern, t]);

  // Needle follows the stitch currently being laid
  const act = activeStitch(pattern.stitches, t);
  const g = stitchGrow(t, act.start);
  const done = t > 10.7;
  const tip = new THREE.Vector3(act.a[0] + (act.b[0] - act.a[0]) * g, FAB_Y + 0.015 + 0.09 * Math.sin(Math.PI * g), act.a[1] + (act.b[1] - act.a[1]) * g);
  if (done) tip.set(0.75, FAB_Y + 0.25 + (t - 10.7) * 0.3, 0.55);
  const dir = new THREE.Vector3(0.35, 0.85, 0.4).normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  const NEEDLE = 0.42;
  const eye = tip.clone().addScaledVector(dir, NEEDLE * 0.95);

  const liveThread = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      eye.clone(),
      eye.clone().add(new THREE.Vector3(0.04, 0.12, 0.05)),
      eye.clone().add(new THREE.Vector3(0.2, 0.45, 0.35)),
      new THREE.Vector3(1.4, 1.9, 2.2),
    ]);
    return new THREE.TubeGeometry(curve, 48, 0.0045, 6, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eye.x, eye.y, eye.z]);
  const liveMat = useMemo(() => GROUPS.map((gname) => (gname === "gold" ? goldThreadMaterial() : silkMaterial(THREAD_COLORS[gname]))), []);

  return (
    <group>
      {byGroup.map((list, gi) => (
        <instancedMesh
          key={GROUPS[gi]}
          ref={(el) => {
            refs.current[gi] = el;
          }}
          args={[threadGeo, materials[gi], list.length]}
          frustumCulled={false}
        />
      ))}
      <instancedMesh ref={knotRef} args={[undefined, undefined, pattern.knots.length]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 2]} />
        <meshPhysicalMaterial color={P.threadSaffron} roughness={0.5} sheen={1} sheenColor="#FFE8A0" />
      </instancedMesh>

      {/* steel needle */}
      <group position={tip} quaternion={quat}>
        <mesh position={[0, NEEDLE / 2 + 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.0055, 0.0055, NEEDLE, 10]} />
          <meshStandardMaterial color={P.needleSteel} metalness={1} roughness={0.15} envMapIntensity={2} />
        </mesh>
        <mesh position={[0, 0.01, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.0055, 0.04, 10]} />
          <meshStandardMaterial color={P.needleSteel} metalness={1} roughness={0.15} envMapIntensity={2} />
        </mesh>
        <mesh position={[0, NEEDLE * 0.95, 0]}>
          <torusGeometry args={[0.008, 0.0022, 6, 14]} />
          <meshStandardMaterial color={P.needleSteel} metalness={1} roughness={0.15} />
        </mesh>
      </group>
      <mesh geometry={liveThread} material={liveMat[GROUPS.indexOf(act.group)]} />
    </group>
  );
};
