import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { BURST, DROP_HIT, MERGE, clamp01, computeBlobState, easeInOutCubic, lerp, mulberry32, win } from "../core/motion";
import { chromeMaterial } from "../lib/materials";

// Hero: a liquid-chrome blob (CPU-displaced sphere, recomputed per frame) that catches a falling
// drop, swallows three orbiting droplets, then snaps into a four-point chrome sparkle with an
// elastic overshoot. Chrome rings and mini sparkles orbit around it. No lettering anywhere.

export const BLOB_CENTER = new THREE.Vector3(0, 0.35, 0);
const SEG_W = 112;
const SEG_H = 80;

/** Superellipse four-point star radius for a direction angle (p < 1 → concave sides). */
const starRadius = (theta: number, p = 0.62) => {
  const c = Math.abs(Math.cos(theta));
  const s = Math.abs(Math.sin(theta));
  return Math.pow(Math.pow(c, p) + Math.pow(s, p), -1 / p);
};

const satellitePos = (i: number, t: number) => {
  const merge = MERGE[i];
  const pull = easeInOutCubic(win(t, merge - 1.2, merge));
  const a = t * (0.9 + i * 0.25) + (i * Math.PI * 2) / 3;
  const r = lerp(1.75 + i * 0.15, 0.2, pull);
  return new THREE.Vector3(Math.cos(a) * r, Math.sin(t * 1.3 + i) * 0.45 * (1 - pull), Math.sin(a) * r).add(BLOB_CENTER);
};

const Blob: React.FC<{ t: number }> = ({ t }) => {
  const st = computeBlobState(t * 60);
  const geo = useMemo(() => new THREE.SphereGeometry(1, SEG_W, SEG_H), []);
  const base = useMemo(() => Float32Array.from(geo.attributes.position.array as Float32Array), [geo]);
  const mat = useMemo(chromeMaterial, []);

  useLayoutEffect(() => {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const sats = MERGE.map((_, i) => satellitePos(i, t).sub(BLOB_CENTER));
    const grow = MERGE.reduce((acc, m) => acc + 0.07 * easeInOutCubic(win(t, m - 0.2, m + 0.4)), 0);
    const R = 0.85 + grow;
    const sq = st.squash;
    for (let i = 0; i < arr.length; i += 3) {
      const x = base[i];
      const y = base[i + 1];
      const z = base[i + 2];
      // liquid wobble: a few travelling sine lobes
      const n =
        Math.sin(x * 3.1 + t * 2.3) * Math.sin(y * 2.7 - t * 1.7) +
        0.6 * Math.sin(z * 3.7 + t * 2.9 + x * 1.3) +
        0.4 * Math.sin((x + y + z) * 4.3 - t * 3.1);
      let r = R * (1 + st.wobble * n);
      // bulge toward approaching satellites (metaball feel)
      for (const s of sats) {
        const d = s.length();
        if (d < 1.6) {
          const dot = (x * s.x + y * s.y + z * s.z) / d;
          r += Math.max(0, dot) ** 6 * (1.6 - d) * 0.35;
        }
      }
      let px = x * r * (1 - sq * 0.5);
      let py = y * r * (1 + sq);
      let pz = z * r * (1 - sq * 0.5);
      // morph to a flattened four-point sparkle star
      if (st.morph > 0) {
        const theta = Math.atan2(y, x);
        const rs = starRadius(theta) * 1.18;
        const rho = Math.sqrt(x * x + y * y);
        const tx = Math.cos(theta) * rs * rho;
        const ty = Math.sin(theta) * rs * rho;
        const tz = z * 0.42 * (0.5 + 0.5 * rho);
        px = lerp(px, tx, st.morph);
        py = lerp(py, ty, st.morph);
        pz = lerp(pz, tz, st.morph);
      }
      arr[i] = px;
      arr[i + 1] = py;
      arr[i + 2] = pz;
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  const spin = st.morph > 0 ? (1 - clamp01(st.morph)) * 2.5 + Math.sin(t * 0.8) * 0.25 : t * 0.35;
  return <mesh geometry={geo} material={mat} position={[BLOB_CENTER.x, BLOB_CENTER.y + st.bounceY, BLOB_CENTER.z]} rotation={[0, spin, 0]} />;
};

const DropAndSatellites: React.FC<{ t: number }> = ({ t }) => {
  const mat = useMemo(chromeMaterial, []);
  const fall = win(t, 0, DROP_HIT);
  const dropY = lerp(4.2, BLOB_CENTER.y + 0.8, fall * fall);
  const stretch = 1 + fall * 0.9;
  return (
    <group>
      {t < DROP_HIT && (
        <mesh material={mat} position={[0, dropY, 0]} scale={[0.22 / Math.sqrt(stretch), 0.22 * stretch, 0.22 / Math.sqrt(stretch)]}>
          <sphereGeometry args={[1, 48, 32]} />
        </mesh>
      )}
      {/* splash crown droplets at impact */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = t - DROP_HIT;
        if (a < 0 || a > 0.7) return null;
        const ang = (i / 8) * Math.PI * 2;
        const r = 0.9 + a * 1.2;
        const y = BLOB_CENTER.y + 0.75 + a * 2.2 - a * a * 5;
        const s = 0.07 * (1 - a / 0.7);
        return (
          <mesh key={i} material={mat} position={[Math.cos(ang) * r * 0.6, y, Math.sin(ang) * r * 0.6]} scale={s}>
            <sphereGeometry args={[1, 20, 14]} />
          </mesh>
        );
      })}
      {MERGE.map((m, i) => {
        if (t > m + 0.05) return null;
        const p = satellitePos(i, t);
        const s = lerp(0.24 - i * 0.03, 0.05, easeInOutCubic(win(t, m - 0.5, m)));
        return (
          <mesh key={`s${i}`} material={mat} position={p} scale={s}>
            <sphereGeometry args={[1, 40, 28]} />
          </mesh>
        );
      })}
    </group>
  );
};

const RingsAndSparkles: React.FC<{ t: number }> = ({ t }) => {
  const mat = useMemo(chromeMaterial, []);
  const mini = useMemo(() => {
    const sh = new THREE.Shape();
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      const r = starRadius(a) * 0.22;
      if (i === 0) sh.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else sh.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.05, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.04, bevelSegments: 6, curveSegments: 8 });
    g.center();
    return g;
  }, []);
  const minis = useMemo(() => {
    const rnd = mulberry32(5422);
    return Array.from({ length: 7 }, () => ({ r: 1.9 + rnd() * 1.2, y: -0.8 + rnd() * 2.6, ph: rnd() * 6.28, sp: 0.25 + rnd() * 0.35, s: 0.6 + rnd() * 0.7 }));
  }, []);
  const expand = easeInOutCubic(win(t, BURST - 0.3, BURST + 0.9));
  return (
    <group position={BLOB_CENTER}>
      <mesh material={mat} rotation={[1.15 + Math.sin(t * 0.6) * 0.15, t * 0.5, 0.3]} scale={1 + expand * 0.35}>
        <torusGeometry args={[1.55, 0.055, 24, 160]} />
      </mesh>
      <mesh material={mat} rotation={[0.35, -t * 0.4, -0.9 + Math.sin(t * 0.5) * 0.2]} scale={1 + expand * 0.55}>
        <torusGeometry args={[1.9, 0.035, 20, 180]} />
      </mesh>
      {minis.map((m, i) => {
        const a = m.ph + t * m.sp;
        const bounce = Math.abs(Math.sin(t * 2.4 + i)) * 0.18;
        return (
          <mesh key={i} geometry={mini} material={mat} position={[Math.cos(a) * m.r, m.y + bounce, Math.sin(a) * m.r]} rotation={[0, a * 2, Math.sin(t + i) * 0.4]} scale={m.s}>
          </mesh>
        );
      })}
    </group>
  );
};

export const ChromeBlob3D: React.FC<{ t: number }> = ({ t }) => (
  <group>
    <Blob t={t} />
    <DropAndSatellites t={t} />
    <RingsAndSparkles t={t} />
  </group>
);
