import React, { useMemo } from "react";
import * as THREE from "three";
import { mulberry32 } from "../core/motion";
import { SATISFYFORGE_PALETTE as P } from "../lib/palette";

// Seamless pastel cyclorama (floor curving into the wall, no horizon line), three round
// plinths (one per loop station), soft geometric decor in the background and out-of-focus
// candy spheres in the foreground.

export const STATIONS = [-3.2, 0, 3.2];
export const PLINTH_TOP = 0.14;

const makeSweep = () => {
  const W = 26;
  const segV = 80;
  const geo = new THREE.PlaneGeometry(W, 1, 1, segV);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors: number[] = [];
  const floor = new THREE.Color(P.sweepFloor);
  const wall = new THREE.Color(P.sweepWall);
  const R = 2.6;
  const floorLen = 8; // from z = +6 to z = -2
  const arc = (Math.PI / 2) * R;
  const wallLen = 9;
  const total = floorLen + arc + wallLen;
  for (let i = 0; i < pos.count; i++) {
    const v = pos.getY(i) + 0.5; // 0..1
    const s = v * total;
    let y = 0;
    let z = 0;
    if (s < floorLen) {
      z = 6 - s;
    } else if (s < floorLen + arc) {
      const a = (s - floorLen) / R;
      z = -2 - Math.sin(a) * R;
      y = R - Math.cos(a) * R;
    } else {
      z = -2 - R;
      y = R + (s - floorLen - arc);
    }
    pos.setXYZ(i, pos.getX(i), y, z);
    const k = THREE.MathUtils.smoothstep(s, floorLen - 1, floorLen + arc + 2);
    const c = floor.clone().lerp(wall, k);
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
};

const Decor: React.FC<{ t: number }> = ({ t }) => {
  const items = useMemo(() => {
    const rnd = mulberry32(5021);
    const cols = [P.pink, P.mint, P.butter, P.lilac, P.sky, P.peach];
    return Array.from({ length: 11 }, (_, i) => ({
      x: -7 + i * 1.4 + (rnd() - 0.5) * 0.5,
      z: -3.2 - rnd() * 0.9,
      kind: i % 3,
      s: 0.35 + rnd() * 0.4,
      c: cols[i % cols.length],
      ph: rnd() * 6.28,
    }));
  }, []);
  return (
    <group>
      {items.map((d, i) => (
        <mesh key={i} position={[d.x, d.s * (d.kind === 1 ? 1 : 0.5) + 0.02, d.z]} rotation={[0, t * 0.15 + d.ph, 0]} castShadow receiveShadow>
          {d.kind === 0 && <sphereGeometry args={[d.s * 0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />}
          {d.kind === 1 && <coneGeometry args={[d.s * 0.45, d.s * 1.4, 4]} />}
          {d.kind === 2 && <torusGeometry args={[d.s * 0.4, d.s * 0.16, 16, 40]} />}
          <meshPhysicalMaterial color={d.c} roughness={0.5} clearcoat={0.4} />
        </mesh>
      ))}
    </group>
  );
};

const ForegroundCandy: React.FC<{ t: number }> = ({ t }) => {
  const balls = useMemo(() => {
    const rnd = mulberry32(5033);
    const cols = [P.pink, P.mint, P.lilac, P.butter, P.sky];
    return Array.from({ length: 9 }, (_, i) => ({
      x: -5 + i * 1.35 + (rnd() - 0.5) * 0.6,
      z: 2.2 + rnd() * 0.8,
      r: 0.14 + rnd() * 0.12,
      c: cols[i % cols.length],
      ph: rnd() * 6.28,
    }));
  }, []);
  return (
    <group>
      {balls.map((b, i) => (
        <mesh key={i} position={[b.x + Math.sin(t * 0.5 + b.ph) * 0.12, b.r, b.z]} castShadow>
          <sphereGeometry args={[b.r, 32, 24]} />
          <meshPhysicalMaterial color={b.c} roughness={0.15} clearcoat={1} />
        </mesh>
      ))}
    </group>
  );
};

export const StudioSweep3D: React.FC<{ t: number }> = ({ t }) => {
  const sweep = useMemo(makeSweep, []);
  return (
    <group>
      <mesh geometry={sweep} receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.92} side={THREE.DoubleSide} />
      </mesh>
      {STATIONS.map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, PLINTH_TOP / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.05, 1.08, PLINTH_TOP, 72]} />
            <meshPhysicalMaterial color={P.plinth} roughness={0.35} clearcoat={0.5} />
          </mesh>
          <mesh position={[0, PLINTH_TOP + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.98, 1.0, 72]} />
            <meshBasicMaterial color={[P.pink, P.lilac, P.mint][i]} />
          </mesh>
        </group>
      ))}
      <Decor t={t} />
      <ForegroundCandy t={t} />
    </group>
  );
};
