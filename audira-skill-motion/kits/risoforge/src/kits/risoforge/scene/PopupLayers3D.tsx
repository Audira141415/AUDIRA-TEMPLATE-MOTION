import React, { useMemo } from "react";
import * as THREE from "three";
import { DRUM } from "../lib/palette";
import { RisoState, misregister, rng, smooth, ramp } from "../core/motion";
import { RisoInks } from "./inks";

// Pop-up layers: each is a flat ink cut-out hinged on the floor page at depth z. Lift 0 = lying flat
// (printed, pointing back toward the spine), lift 1 = standing. Inks multiply, so layers overprint.

type Geo = THREE.BufferGeometry;

const skyline = (seed: number, x0: number, x1: number, minH: number, maxH: number): Geo[] => {
  const r = rng(seed);
  const out: Geo[] = [];
  let x = x0;
  while (x < x1 - 0.2) {
    const w = Math.min(x1 - x, 0.32 + r() * 0.5);
    const h = minH + r() * (maxH - minH);
    const s = new THREE.Shape();
    s.moveTo(x, 0);
    s.lineTo(x + w, 0);
    s.lineTo(x + w, h);
    const roof = r();
    if (roof < 0.3) {
      s.lineTo(x + w / 2, h + w * 0.55); // gable
    } else if (roof < 0.5) {
      s.lineTo(x + w * 0.62, h);
      s.lineTo(x + w * 0.62, h + 0.35); // antenna block
      s.lineTo(x + w * 0.5, h + 0.35);
      s.lineTo(x + w * 0.5, h);
    }
    s.lineTo(x, h);
    s.lineTo(x, 0);
    // window holes knock out the ink so layers behind show through
    const cols = Math.max(1, Math.floor((w - 0.08) / 0.14));
    const rows = Math.floor((h - 0.25) / 0.2);
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        if (r() < 0.45) continue;
        const wx = x + 0.06 + i * ((w - 0.12) / cols) + 0.02;
        const wy = 0.18 + j * 0.2;
        const hw = (w - 0.12) / cols - 0.05;
        const hole = new THREE.Path();
        hole.moveTo(wx, wy);
        hole.lineTo(wx, wy + 0.1);
        hole.lineTo(wx + hw, wy + 0.1);
        hole.lineTo(wx + hw, wy);
        hole.lineTo(wx, wy);
        s.holes.push(hole);
      }
    out.push(new THREE.ShapeGeometry(s));
    x += w;
  }
  return out;
};

const hills = (seed: number, x0: number, x1: number, h: number) => {
  const r = rng(seed);
  const s = new THREE.Shape();
  s.moveTo(x0, 0);
  const n = 40;
  const ph = r() * 6;
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    s.lineTo(x, h * (0.55 + 0.3 * Math.sin(x * 1.7 + ph) + 0.15 * Math.sin(x * 4.1)));
  }
  s.lineTo(x1, 0);
  s.lineTo(x0, 0);
  return new THREE.ShapeGeometry(s);
};

const leaf = (len: number, wid: number) => {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(-wid, len * 0.25, -wid * 0.9, len * 0.85, 0, len);
  s.bezierCurveTo(wid * 0.9, len * 0.85, wid, len * 0.25, 0, 0);
  // monstera splits
  for (let k = 0; k < 3; k++) {
    const y = len * (0.32 + k * 0.18);
    const side = k % 2 ? 1 : -1;
    const h = new THREE.Path();
    h.moveTo(side * wid * 0.25, y);
    h.lineTo(side * wid * 0.62, y + len * 0.05);
    h.lineTo(side * wid * 0.6, y + len * 0.09);
    h.lineTo(side * wid * 0.22, y + len * 0.05);
    h.lineTo(side * wid * 0.25, y);
    s.holes.push(h);
  }
  return new THREE.ShapeGeometry(s, 16);
};

const grass = (seed: number, x0: number, x1: number) => {
  const r = rng(seed);
  const s = new THREE.Shape();
  s.moveTo(x0, 0);
  let x = x0;
  while (x < x1) {
    const w = 0.06 + r() * 0.08;
    s.lineTo(x + w * 0.5, 0.18 + r() * 0.42);
    s.lineTo(x + w, 0.02);
    x += w;
  }
  s.lineTo(x1, 0);
  s.lineTo(x0, 0);
  return new THREE.ShapeGeometry(s);
};

const Layer: React.FC<{ z: number; lift: number; drum: number; t: number; children: React.ReactNode }> = ({ z, lift, drum, t, children }) => {
  const [dx, dy] = misregister(t, drum);
  return (
    <group position={[0, 0.004, z]} rotation={[-(Math.PI / 2) * (1 - lift), 0, 0]}>
      <group position={[dx, dy, 0]}>{children}</group>
    </group>
  );
};

export const PopupLayers3D: React.FC<{ s: RisoState; inks: RisoInks }> = ({ s, inks }) => {
  const g = useMemo(
    () => ({
      far: skyline(531, -2.1, 2.1, 1.1, 3.0),
      near: skyline(77, -2.05, 2.05, 0.6, 1.9),
      hills: hills(9, -2.2, 2.2, 0.85),
      leafA: leaf(1.0, 0.42),
      leafB: leaf(0.8, 0.36),
      stem: new THREE.PlaneGeometry(0.05, 1.6),
      pot: (() => {
        const sh = new THREE.Shape();
        sh.moveTo(-0.38, 0.5);
        sh.lineTo(0.38, 0.5);
        sh.lineTo(0.3, 0);
        sh.lineTo(-0.3, 0);
        sh.lineTo(-0.38, 0.5);
        return new THREE.ShapeGeometry(sh);
      })(),
      grassA: grass(4, -2.25, 2.25),
      grassB: grass(8, -2.25, 2.25),
      flower: new THREE.CircleGeometry(0.07, 12),
    }),
    [],
  );
  const L = s.lifts;
  const t = s.t;
  // plant: leaves unfurl after the layer stands (scale + rotation around the stem tip)
  const leaves = [
    { a: 0.75, y: 0.95, l: g.leafA },
    { a: -0.6, y: 1.15, l: g.leafA },
    { a: 0.25, y: 1.5, l: g.leafB },
    { a: -1.1, y: 0.7, l: g.leafB },
    { a: 1.25, y: 0.55, l: g.leafB },
  ];
  const leafK = (i: number) => 0.45 + 0.55 * smooth(ramp(s.plantGrow, i * 0.12, 0.5 + i * 0.12));

  return (
    <group>
      {/* 0 — far skyline, blue */}
      <Layer z={3.4} lift={L[0]} drum={DRUM.blue} t={t}>
        {g.far.map((geo, i) => (
          <mesh key={i} geometry={geo} material={inks.blueDense} castShadow renderOrder={4} />
        ))}
      </Layer>
      {/* 1 — near skyline, fluorescent pink (overprints the blue into violet) */}
      <Layer z={4.15} lift={L[1]} drum={DRUM.pink} t={t}>
        {g.near.map((geo, i) => (
          <mesh key={i} geometry={geo} material={inks.pinkSolid} castShadow renderOrder={4} />
        ))}
      </Layer>
      {/* 2 — rolling hills, yellow halftone */}
      <Layer z={4.85} lift={L[2]} drum={DRUM.yellow} t={t}>
        <mesh geometry={g.hills} material={inks.yellowHalf} castShadow renderOrder={4} />
      </Layer>
      {/* 3 — plant, blue leaves */}
      <group position={[0.8, 0, 0]}>
        <Layer z={5.6} lift={L[3]} drum={DRUM.blue} t={t}>
          <mesh geometry={g.stem} material={inks.blueSolid} position={[0, 0.8 + 0.5, 0]} renderOrder={4} />
          {leaves.slice(0, 3).map((lf, i) => (
            <mesh key={i} geometry={lf.l} material={inks.blueSolid} position={[0, lf.y + 0.5, 0]} rotation={[0, 0, lf.a * leafK(i)]} scale={leafK(i)} castShadow renderOrder={4} />
          ))}
          <mesh geometry={g.pot} material={inks.pinkSolid} renderOrder={4} />
        </Layer>
        {/* 4 — plant, yellow leaves offset so blue × yellow prints green where they overlap */}
        <Layer z={5.66} lift={L[4]} drum={DRUM.yellow} t={t}>
          {leaves.map((lf, i) => (
            <mesh key={i} geometry={lf.l} material={inks.yellowSolid} position={[0.08, lf.y + 0.42, 0]} rotation={[0, 0, (lf.a + 0.25) * leafK(i + 1)]} scale={leafK(i + 1) * 0.95} castShadow renderOrder={4} />
          ))}
        </Layer>
      </group>
      {/* 5 — foreground grass + pink flowers */}
      <Layer z={6.45} lift={L[5]} drum={DRUM.blue} t={t}>
        <mesh geometry={g.grassA} material={inks.blueDense} castShadow renderOrder={4} />
      </Layer>
      <Layer z={6.55} lift={L[5]} drum={DRUM.pink} t={t}>
        <mesh geometry={g.grassB} material={inks.pinkHalf} position={[0.07, 0, 0]} renderOrder={4} />
        {[-1.7, -0.9, -0.2, 0.6, 1.5].map((x, i) => (
          <mesh key={i} geometry={g.flower} material={inks.pinkSolid} position={[x, 0.42 + (i % 2) * 0.12, 0]} renderOrder={4} />
        ))}
      </Layer>
    </group>
  );
};
