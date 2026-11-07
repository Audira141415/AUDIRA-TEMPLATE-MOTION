// TERRARIUM — the garden inside: gravel / charcoal / soil bands, displaced soil top, moss cushions, pebbles,
// three ferns of instanced leaflets (gentle sway), tiny mushrooms that glow at night, a pool with ripples, fireflies.
import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { TERRA_PALETTE as P } from "../lib/palette";
import { makeSpeckleTexture } from "../lib/materials";
import { dayState, JAR, POOL, prng, soilY, SOIL_BASE } from "../core/motion";

const MOSS = 1300;
const PEBBLES = 28;
const FERNS: { x: number; z: number; fronds: number; size: number }[] = [
  { x: -0.34, z: -0.26, fronds: 9, size: 0.95 },
  { x: 0.45, z: -0.42, fronds: 7, size: 0.7 },
  { x: -0.58, z: 0.38, fronds: 7, size: 0.62 },
];
const LEAFLETS = 20;
const LEAF_TOTAL = FERNS.reduce((n, f) => n + f.fronds, 0) * LEAFLETS * 2;
const MUSHROOMS: { x: number; z: number; h: number; r: number; c: string }[] = [
  { x: 0.08, z: 0.02, h: 0.15, r: 0.065, c: P.capOrange },
  { x: 0.16, z: 0.08, h: 0.1, r: 0.045, c: P.capOrange },
  { x: 0.02, z: 0.12, h: 0.07, r: 0.032, c: P.capCream },
  { x: -0.7, z: -0.05, h: 0.12, r: 0.05, c: P.capCream },
  { x: -0.62, z: 0.02, h: 0.08, r: 0.035, c: P.capOrange },
  { x: 0.62, z: 0.05, h: 0.09, r: 0.04, c: P.capCream },
];
const FLIES = 18;

export const JarGarden3D: React.FC<{ t: number }> = ({ t }) => {
  const mossRef = useRef<THREE.InstancedMesh>(null);
  const pebRef = useRef<THREE.InstancedMesh>(null);
  const leafRef = useRef<THREE.InstancedMesh>(null);
  const flyRef = useRef<THREE.InstancedMesh>(null);
  const tex = useMemo(
    () => ({
      gravel: makeSpeckleTexture("#7C766C", ["#A8A194", "#5B564F", "#C9C2B4", "#6F6A60"], 1, 6),
      charcoal: makeSpeckleTexture(P.charcoal, ["#2E2C2B", "#0E0D0D"], 2, 6),
      soil: makeSpeckleTexture(P.soil, ["#4E3826", "#2A1D14", "#5D4632"], 3, 6),
    }),
    [],
  );

  const soilTop = useMemo(() => {
    const g = new THREE.PlaneGeometry(2, 2, 96, 96);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const cols: number[] = [];
    const c = new THREE.Color();
    const r = prng(9);
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let z = pos.getZ(i);
      const d = Math.hypot(x, z);
      if (d > JAR.inner) {
        x *= JAR.inner / d;
        z *= JAR.inner / d;
      }
      pos.setXYZ(i, x, soilY(x, z), z);
      c.set(P.soilTop).lerp(new THREE.Color(P.soil), r() * 0.6);
      cols.push(c.r, c.g, c.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    g.computeVertexNormals();
    return g;
  }, []);

  const layout = useMemo(() => {
    const r = prng(6201);
    const centers = Array.from({ length: 16 }, () => {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r()) * 0.82;
      return [Math.cos(a) * d, Math.sin(a) * d] as [number, number];
    });
    const moss = [] as { x: number; z: number; s: number; c: string }[];
    while (moss.length < MOSS) {
      const c = centers[Math.floor(r() * centers.length)];
      const x = c[0] + (r() - 0.5) * 0.36;
      const z = c[1] + (r() - 0.5) * 0.36;
      if (Math.hypot(x, z) > 0.9 || Math.hypot(x - POOL[0], z - POOL[1]) < 0.2) continue;
      moss.push({ x, z, s: 0.022 + r() * 0.03, c: [P.mossA, P.mossB, P.mossC][Math.floor(r() * 3)] });
    }
    const pebbles = Array.from({ length: PEBBLES }, (_, i) => {
      const a = i < 12 ? (i / 12) * Math.PI * 2 : r() * Math.PI * 2;
      const d = i < 12 ? 0.21 : 0.3 + r() * 0.55;
      const x = i < 12 ? POOL[0] + Math.cos(a) * d : Math.cos(a) * d;
      const z = i < 12 ? POOL[1] + Math.sin(a) * d : Math.sin(a) * d;
      return { x, z, s: 0.03 + r() * 0.05, ry: r() * 6, c: r() > 0.5 ? P.pebble : "#8F8A80" };
    });
    const fronds = FERNS.flatMap((f, fi) =>
      Array.from({ length: f.fronds }, (_, k) => ({ f, fi, a: (k / f.fronds) * Math.PI * 2 + r() * 0.5, lean: 0.55 + r() * 0.35, len: f.size * (0.7 + r() * 0.35) })),
    );
    const flies = Array.from({ length: FLIES }, () => ({ a: r() * 6.28, rad: 0.2 + r() * 0.6, y: 0.8 + r() * 1.2, sp: 0.2 + r() * 0.4, ph: r() * 6.28 }));
    return { moss, pebbles, fronds, flies };
  }, []);

  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    const col = new THREE.Color();
    const mm = mossRef.current!;
    layout.moss.forEach((m, i) => {
      o.position.set(m.x, soilY(m.x, m.z) + m.s * 0.35, m.z);
      o.rotation.set(0, i, 0);
      o.scale.set(m.s, m.s * 0.7, m.s);
      o.updateMatrix();
      mm.setMatrixAt(i, o.matrix);
      mm.setColorAt(i, col.set(m.c));
    });
    mm.instanceMatrix.needsUpdate = true;
    if (mm.instanceColor) mm.instanceColor.needsUpdate = true;

    const pm = pebRef.current!;
    layout.pebbles.forEach((p, i) => {
      o.position.set(p.x, soilY(p.x, p.z) + p.s * 0.3, p.z);
      o.rotation.set(0.3, p.ry, 0.2);
      o.scale.set(p.s, p.s * 0.55, p.s * 0.85);
      o.updateMatrix();
      pm.setMatrixAt(i, o.matrix);
      pm.setColorAt(i, col.set(p.c));
    });
    pm.instanceMatrix.needsUpdate = true;
    if (pm.instanceColor) pm.instanceColor.needsUpdate = true;

    // fern leaflets: each frond rises then arches outward; leaflets pair along it and taper to the tip
    const lm = leafRef.current!;
    const up = new THREE.Vector3(0, 1, 0);
    const zAxis = new THREE.Vector3(0, 0, 1);
    let n = 0;
    layout.fronds.forEach((fr, k) => {
      const sway = Math.sin(t * 1.1 + k * 0.7) * 0.04;
      const dir = new THREE.Vector3(Math.cos(fr.a + sway), 0, Math.sin(fr.a + sway));
      const base = new THREE.Vector3(fr.f.x, soilY(fr.f.x, fr.f.z), fr.f.z);
      const at = (s: number) =>
        base
          .clone()
          .addScaledVector(dir, fr.len * fr.lean * s)
          .addScaledVector(up, fr.len * (Math.sin(s * Math.PI * 0.62) * 0.8 - s * s * 0.2));
      for (let j = 0; j < LEAFLETS; j++) {
        const s = 0.12 + (j / LEAFLETS) * 0.86;
        const p = at(s);
        const tan = at(s + 0.01).sub(p).normalize();
        const side = new THREE.Vector3().crossVectors(tan, up).normalize();
        const L = 0.075 * fr.f.size * (1 - s * 0.75);
        for (const sg of [1, -1]) {
          const d = side.clone().multiplyScalar(sg);
          const tilt = d.clone().addScaledVector(tan, 0.45).normalize();
          o.position.copy(p).addScaledVector(tilt, L * 0.5);
          o.quaternion.setFromUnitVectors(zAxis, tilt);
          o.scale.set(0.014 * fr.f.size, 0.004, L * 0.55);
          o.updateMatrix();
          lm.setMatrixAt(n, o.matrix);
          lm.setColorAt(n, col.set(P.fern).lerp(new THREE.Color(P.fernTip), s));
          n++;
        }
      }
    });
    lm.instanceMatrix.needsUpdate = true;
    if (lm.instanceColor) lm.instanceColor.needsUpdate = true;

    const night = dayState(t).night;
    const fm = flyRef.current!;
    layout.flies.forEach((f, i) => {
      const a = f.a + t * f.sp;
      const blink = 0.5 + 0.5 * Math.sin(t * 3 + f.ph);
      o.position.set(Math.cos(a) * f.rad, f.y + Math.sin(t * 0.8 + f.ph) * 0.12, Math.sin(a) * f.rad);
      o.rotation.set(0, 0, 0);
      o.scale.setScalar(0.012 * night * (0.4 + 0.6 * blink) + 0.0001);
      o.updateMatrix();
      fm.setMatrixAt(i, o.matrix);
    });
    fm.instanceMatrix.needsUpdate = true;
  }, [t, layout]);

  const day = dayState(t);
  const poolY = soilY(POOL[0], POOL[1]) + 0.04;
  const ripples = [5.3, 8.1].map((t0) => {
    const d = t - t0;
    return d < 0 || d > 1.6 ? null : { r: 0.02 + d * 0.11, o: (1 - d / 1.6) * 0.8 };
  });

  return (
    <group>
      {/* substrate bands seen through the glass */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[0.97, 0.96, 0.2, 96]} />
        <meshStandardMaterial map={tex.gravel} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.235, 0]}>
        <cylinderGeometry args={[0.975, 0.97, 0.07, 96]} />
        <meshStandardMaterial map={tex.charcoal} roughness={0.95} />
      </mesh>
      <mesh position={[0, (0.27 + SOIL_BASE) / 2, 0]}>
        <cylinderGeometry args={[0.978, 0.975, SOIL_BASE - 0.27, 96]} />
        <meshStandardMaterial map={tex.soil} roughness={0.95} />
      </mesh>
      <mesh geometry={soilTop} receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.95} />
      </mesh>

      <instancedMesh ref={mossRef} args={[undefined, undefined, MOSS]} castShadow receiveShadow>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={0.95} />
      </instancedMesh>
      <instancedMesh ref={pebRef} args={[undefined, undefined, PEBBLES]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={0.6} />
      </instancedMesh>
      <instancedMesh ref={leafRef} args={[undefined, undefined, LEAF_TOTAL]} castShadow>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial roughness={0.6} side={THREE.DoubleSide} />
      </instancedMesh>

      {/* mushrooms: stems + caps; caps glow after dusk */}
      {MUSHROOMS.map((m, i) => {
        const y = soilY(m.x, m.z);
        return (
          <group key={i} position={[m.x, y, m.z]} rotation={[0, 0, Math.sin(i * 2.1) * 0.12]}>
            <mesh position={[0, m.h / 2, 0]} castShadow>
              <cylinderGeometry args={[m.r * 0.22, m.r * 0.32, m.h, 12]} />
              <meshStandardMaterial color={P.stem} roughness={0.7} emissive={P.glow} emissiveIntensity={day.night * 0.4} />
            </mesh>
            <mesh position={[0, m.h, 0]} scale={[1, 0.62, 1]} castShadow>
              <sphereGeometry args={[m.r, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={m.c} roughness={0.45} emissive={P.glow} emissiveIntensity={day.night * 1.6} />
            </mesh>
          </group>
        );
      })}
      <pointLight position={[0.05, 0.75, 0.1]} intensity={day.night * 1.6} distance={1.6} color={P.glow} />

      {/* pool */}
      <mesh position={[POOL[0], poolY, POOL[1]]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.17, 48]} />
        <meshPhysicalMaterial color={P.water} roughness={0.04} metalness={0.2} clearcoat={1} transparent opacity={0.88} />
      </mesh>
      {ripples.map((r, i) =>
        r ? (
          <mesh key={i} position={[POOL[0] - 0.03, poolY + 0.002, POOL[1] + 0.02]} rotation={[-Math.PI / 2, 0, 0]} scale={r.r}>
            <ringGeometry args={[0.85, 1, 48]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={r.o} depthWrite={false} />
          </mesh>
        ) : null,
      )}

      <instancedMesh ref={flyRef} args={[undefined, undefined, FLIES]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshBasicMaterial color={P.firefly} toneMapped={false} />
      </instancedMesh>
    </group>
  );
};
