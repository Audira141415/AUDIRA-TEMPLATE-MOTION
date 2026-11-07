// DISASTERSIM — the sliced earth block: continental crust, subducting oceanic slab, glowing mantle,
// locked fault that loads and slips, seismic rings, convergence chevrons and floating labels.
import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { DISASTER_PALETTE as P } from "../lib/palette";
import { makeBasaltTexture, makeCrustTexture, makeLabel, makeMantleTexture } from "../lib/materials";
import { BLOCK, clamp, EVENT, rebound, seg, SLAB_THICK, slabTop, stress, surfaceY } from "../core/motion";

const D = BLOCK.halfD * 2;
const FRONT = BLOCK.halfD;

const extrude = (pts: [number, number][]) => {
  const s = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  const g = new THREE.ExtrudeGeometry(s, { depth: D, bevelEnabled: false, curveSegments: 1 });
  g.translate(0, 0, -BLOCK.halfD);
  g.computeVertexNormals();
  return g;
};

const range = (a: number, b: number, step: number) => {
  const out: number[] = [];
  for (let x = a; x <= b + 1e-6; x += step) out.push(x);
  return out;
};

export const HYPO: [number, number] = [1.0, slabTop(1.0) - 0.05];

const Label: React.FC<{ text: string; accent: string; pos: [number, number, number]; o: number }> = ({ text, accent, pos, o }) => {
  const l = useMemo(() => makeLabel(text, accent), [text, accent]);
  if (o <= 0.01) return null;
  const h = 0.24;
  return (
    <sprite position={pos} scale={[h * l.aspect, h, 1]} center={new THREE.Vector2(0, 0.5)} renderOrder={10}>
      <spriteMaterial map={l.tex} transparent opacity={o} depthTest={false} />
    </sprite>
  );
};

/** Instanced chevrons sliding down-dip along the slab: shows convergence direction. */
const Chevrons: React.FC<{ t: number }> = ({ t }) => {
  const N = 9;
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    for (let i = 0; i < N; i++) {
      const u = ((i / N + t * 0.05) % 1) * 7.2 - 3.6; // x from -3.6 to 3.6
      const y = slabTop(u) - SLAB_THICK / 2;
      const dy = slabTop(u + 0.05) - slabTop(u - 0.05);
      o.position.set(u, y, FRONT + 0.012);
      o.rotation.set(0, 0, Math.atan2(dy, 0.1) - Math.PI / 2);
      const edge = Math.min(1, (u + 3.6) / 0.6, (3.6 - u) / 0.6);
      o.scale.setScalar(Math.max(0.0001, edge));
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [t]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, N]}>
      <circleGeometry args={[0.1, 3]} />
      <meshBasicMaterial color="#C9D6E2" transparent opacity={0.55} toneMapped={false} />
    </instancedMesh>
  );
};

export const EarthBlock3D: React.FC<{ t: number }> = ({ t }) => {
  const tex = useMemo(() => ({ crust: makeCrustTexture(), basalt: makeBasaltTexture(), mantle: makeMantleTexture() }), []);

  const geo = useMemo(() => {
    const land = range(0, 4, 0.05).map((x) => [x, surfaceY(x)] as [number, number]);
    const slabFwd = range(-4, 4, 0.1).map((x) => [x, slabTop(x)] as [number, number]);
    const slabBot = range(-4, 4, 0.1).map((x) => [x, slabTop(x) - SLAB_THICK] as [number, number]);
    const crustPts: [number, number][] = [...land, ...range(0.1, 4, 0.1).reverse().map((x) => [x, slabTop(x)] as [number, number])];
    const slabPts: [number, number][] = [...slabFwd, ...slabBot.slice().reverse()];
    const mantlePts: [number, number][] = [...slabBot, [4, BLOCK.bottom], [-4, BLOCK.bottom]];
    // land / seafloor skin with vertex colours (sand at the coast, green uphill, dark shelf underwater)
    const skin = new THREE.PlaneGeometry(4, D, 100, 8);
    skin.rotateX(-Math.PI / 2);
    skin.translate(2, 0, 0);
    const pos = skin.attributes.position as THREE.BufferAttribute;
    const cols: number[] = [];
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = surfaceY(x);
      pos.setY(i, y + 0.004);
      if (y < -0.05) c.set("#56606A");
      else if (y < 0.12) c.set(P.sand);
      else c.set(P.land).lerp(new THREE.Color("#4F7444"), clamp((y - 0.3) / 0.6));
      cols.push(c.r, c.g, c.b);
    }
    skin.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    skin.computeVertexNormals();
    // fault interface curve (locked zone)
    const fault = new THREE.CatmullRomCurve3(range(-0.3, 2.2, 0.1).map((x) => new THREE.Vector3(x, slabTop(x), FRONT + 0.015)));
    return {
      crust: extrude(crustPts),
      slab: extrude(slabPts),
      mantle: extrude(mantlePts),
      skin,
      fault: new THREE.TubeGeometry(fault, 64, 0.022, 8, false),
      faultGlow: new THREE.TubeGeometry(fault, 64, 0.07, 8, false),
    };
  }, []);

  const rb = rebound(t);
  const s = stress(t);
  const flash = Math.exp(-Math.max(0, t - EVENT.slip) * 4) * (t >= EVENT.slip ? 1 : 0);
  const faultCol = new THREE.Color(P.lvlAdvisory).lerp(new THREE.Color(P.lvlEvac), s).lerp(new THREE.Color("#FFFFFF"), flash);

  // seismic rings on the cut face (start at the rupture)
  const rings = [0, 1, 2, 3].map((k) => {
    const d = t - EVENT.slip - k * 0.32;
    return d < 0 || d > 2.6 ? null : { r: 0.15 + d * 1.5, o: (1 - d / 2.6) * 0.9 };
  });
  // surface rings on the sea above the epicentre
  const surf = [0, 1, 2].map((k) => {
    const d = t - EVENT.slip - 0.2 - k * 0.45;
    return d < 0 || d > 3 ? null : { r: 0.1 + d * 0.9, o: (1 - d / 3) * 0.7 };
  });

  const lab = (a: number) => seg(t, a, a + 0.5) * (1 - seg(t, 4.4, 4.9));

  return (
    <group>
      {/* plinth + lab floor */}
      <mesh position={[0, BLOCK.bottom - 0.12, 0]} receiveShadow>
        <boxGeometry args={[8.5, 0.24, D + 0.5]} />
        <meshStandardMaterial color={P.plinth} roughness={0.5} metalness={0.4} />
      </mesh>
      <gridHelper args={[60, 60, P.grid, P.grid]} position={[0, BLOCK.bottom - 0.25, 0]} />

      {/* mantle (self-lit) */}
      <mesh geometry={geo.mantle}>
        <meshStandardMaterial
          attach="material-0"
          map={tex.mantle}
          emissiveMap={tex.mantle}
          emissive="#FFFFFF"
          emissiveIntensity={0.28}
          roughness={0.8}
        />
        <meshStandardMaterial attach="material-1" color={P.mantleDeep} emissive={P.mantleHot} emissiveIntensity={0.25} roughness={0.8} />
      </mesh>

      {/* subducting oceanic slab */}
      <mesh geometry={geo.slab} castShadow receiveShadow>
        <meshStandardMaterial attach="material-0" map={tex.basalt} roughness={0.75} />
        <meshStandardMaterial attach="material-1" color={P.basaltTop} roughness={0.85} />
      </mesh>

      {/* continental crust with elastic rebound at the slip */}
      <group position={[rb.x, rb.y, 0]}>
        <mesh geometry={geo.crust} castShadow receiveShadow>
          <meshStandardMaterial attach="material-0" map={tex.crust} roughness={0.85} />
          <meshStandardMaterial attach="material-1" color={P.granite} roughness={0.9} />
        </mesh>
        <mesh geometry={geo.skin} receiveShadow>
          <meshStandardMaterial vertexColors roughness={0.9} />
        </mesh>
      </group>

      {/* locked fault: loads (amber -> red), flashes white on rupture */}
      <mesh geometry={geo.fault}>
        <meshBasicMaterial color={faultCol} toneMapped={false} transparent opacity={0.35 + 0.65 * Math.max(s, flash)} />
      </mesh>
      <mesh geometry={geo.faultGlow}>
        <meshBasicMaterial color={faultCol} toneMapped={false} transparent opacity={0.22 * Math.max(s, flash)} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* hypocentre + rings on the cut face */}
      <group position={[HYPO[0], HYPO[1], FRONT + 0.02]}>
        <mesh>
          <circleGeometry args={[0.07 + 0.05 * flash, 32]} />
          <meshBasicMaterial color={t >= EVENT.slip ? "#FFFFFF" : P.fault} toneMapped={false} transparent opacity={0.4 + 0.6 * Math.max(s, flash)} />
        </mesh>
        {rings.map((r, i) =>
          r ? (
            <mesh key={i} scale={r.r}>
              <ringGeometry args={[0.96, 1, 96]} />
              <meshBasicMaterial color={P.ring} toneMapped={false} transparent opacity={r.o} depthWrite={false} />
            </mesh>
          ) : null,
        )}
      </group>
      {surf.map((r, i) =>
        r ? (
          <mesh key={`s${i}`} position={[HYPO[0], 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={r.r}>
            <ringGeometry args={[0.94, 1, 96]} />
            <meshBasicMaterial color={P.ring} toneMapped={false} transparent opacity={r.o} depthWrite={false} />
          </mesh>
        ) : null,
      )}

      <Chevrons t={t} />

      {/* floating labels (sprites, always face the lens) */}
      <Label text="OCEANIC PLATE" accent={P.basalt} pos={[-3.2, -1.2, FRONT + 0.1]} o={lab(0.3)} />
      <Label text="CONTINENTAL PLATE" accent={P.sediment} pos={[2.2, -1.0, FRONT + 0.1]} o={lab(0.6)} />
      <Label text="MANTLE" accent={P.mantleHot} pos={[-1.6, -3.4, FRONT + 0.1]} o={lab(0.9)} />
      <Label text="HYPOCENTRE · 25 KM" accent={P.lvlEvac} pos={[HYPO[0] + 0.18, HYPO[1] - 0.3, FRONT + 0.1]} o={seg(t, EVENT.slip + 0.2, EVENT.slip + 0.7) * (1 - seg(t, 5.4, 5.9))} />
      <Label text="COASTAL TOWN" accent={P.route} pos={[3.0, 0.95, 0.9]} o={seg(t, 8.4, 9.0)} />
    </group>
  );
};
