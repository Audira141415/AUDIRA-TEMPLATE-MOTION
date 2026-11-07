// DISASTERSIM — the coastal town model on the hill: instanced houses + roofs + trees, a marching
// evacuation route to the high-ground assembly point, a green beacon, and foreground lab dust.
import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { DISASTER_PALETTE as P } from "../lib/palette";
import { makeGlow } from "../lib/materials";
import { EVENT, prng, seg, surfaceY } from "../core/motion";

const HOUSES = 44;
const TREES = 80;
const ROUTE = 34;
const DUST = 140;

const ROUTE_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(2.75, 0, 1.2),
  new THREE.Vector3(3.1, 0, 0.6),
  new THREE.Vector3(3.35, 0, -0.2),
  new THREE.Vector3(3.7, 0, -0.9),
  new THREE.Vector3(3.85, 0, -1.3),
]);
export const ASSEMBLY: [number, number] = [3.85, -1.3];

export const CoastalTown3D: React.FC<{ t: number }> = ({ t }) => {
  const houseRef = useRef<THREE.InstancedMesh>(null);
  const roofRef = useRef<THREE.InstancedMesh>(null);
  const treeRef = useRef<THREE.InstancedMesh>(null);
  const routeRef = useRef<THREE.InstancedMesh>(null);
  const dustRef = useRef<THREE.InstancedMesh>(null);
  const glow = useMemo(() => makeGlow(), []);

  const layout = useMemo(() => {
    const r = prng(4848);
    const houses: { x: number; z: number; s: number; ry: number; c: string }[] = [];
    let guard = 0;
    while (houses.length < HOUSES && guard++ < 2000) {
      const x = 2.6 + r() * 1.25;
      const z = -1.6 + r() * 3.2;
      if (houses.some((h) => Math.hypot(h.x - x, h.z - z) < 0.2)) continue;
      houses.push({ x, z, s: 0.8 + r() * 0.5, ry: (r() - 0.5) * 0.5, c: ["#F2EEE6", "#E8DCC8", "#DCE6EA", "#F0E2D0"][Math.floor(r() * 4)] });
    }
    const trees: { x: number; z: number; s: number }[] = [];
    guard = 0;
    while (trees.length < TREES && guard++ < 4000) {
      const x = 2.2 + r() * 1.75;
      const z = -1.7 + r() * 3.4;
      if (houses.some((h) => Math.hypot(h.x - x, h.z - z) < 0.14)) continue;
      trees.push({ x, z, s: 0.6 + r() * 0.7 });
    }
    const dust = Array.from({ length: DUST }, () => ({ x: -5 + r() * 12, y: -3 + r() * 6, z: 2.4 + r() * 4, ph: r() * 6.28, s: 0.5 + r() }));
    return { houses, trees, dust };
  }, []);

  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    const c = new THREE.Color();
    const hm = houseRef.current!;
    const rm = roofRef.current!;
    layout.houses.forEach((h, i) => {
      const y = surfaceY(h.x);
      o.position.set(h.x, y + 0.045 * h.s, h.z);
      o.rotation.set(0, h.ry, 0);
      o.scale.set(h.s, h.s, h.s);
      o.updateMatrix();
      hm.setMatrixAt(i, o.matrix);
      hm.setColorAt(i, c.set(h.c));
      o.position.set(h.x, y + 0.09 * h.s + 0.035 * h.s, h.z);
      o.rotation.set(0, h.ry + Math.PI / 4, 0);
      o.updateMatrix();
      rm.setMatrixAt(i, o.matrix);
    });
    hm.instanceMatrix.needsUpdate = true;
    rm.instanceMatrix.needsUpdate = true;
    if (hm.instanceColor) hm.instanceColor.needsUpdate = true;
    const tm = treeRef.current!;
    layout.trees.forEach((tr, i) => {
      o.position.set(tr.x, surfaceY(tr.x) + 0.09 * tr.s, tr.z);
      o.rotation.set(0, 0, Math.sin(t * 1.4 + i) * 0.03);
      o.scale.setScalar(tr.s);
      o.updateMatrix();
      tm.setMatrixAt(i, o.matrix);
    });
    tm.instanceMatrix.needsUpdate = true;
    // evacuation route: dots march uphill, reveal from the town outward
    const reveal = seg(t, EVENT.routeOn, EVENT.routeOn + 1.4);
    const rmesh = routeRef.current!;
    for (let i = 0; i < ROUTE; i++) {
      const u = ((i / ROUTE + t * 0.12) % 1);
      const p = ROUTE_CURVE.getPoint(u);
      o.position.set(p.x, surfaceY(p.x) + 0.03, p.z);
      o.rotation.set(0, 0, 0);
      o.scale.setScalar(u < reveal ? 1 : 0.0001);
      o.updateMatrix();
      rmesh.setMatrixAt(i, o.matrix);
    }
    rmesh.instanceMatrix.needsUpdate = true;
    // foreground dust
    const dm = dustRef.current!;
    layout.dust.forEach((d, i) => {
      o.position.set(d.x + Math.sin(t * 0.3 + d.ph) * 0.2, d.y + ((t * 0.05 + d.ph) % 1) * 0.3, d.z);
      o.scale.setScalar(0.012 * d.s);
      o.updateMatrix();
      dm.setMatrixAt(i, o.matrix);
    });
    dm.instanceMatrix.needsUpdate = true;
  }, [t, layout]);

  const beacon = seg(t, EVENT.routeOn + 0.8, EVENT.routeOn + 1.8);
  const pulse = 0.75 + 0.25 * Math.sin(t * 5);
  const ay = surfaceY(ASSEMBLY[0]);

  return (
    <group>
      <instancedMesh ref={houseRef} args={[undefined, undefined, HOUSES]} castShadow receiveShadow>
        <boxGeometry args={[0.11, 0.09, 0.09]} />
        <meshStandardMaterial roughness={0.7} />
      </instancedMesh>
      <instancedMesh ref={roofRef} args={[undefined, undefined, HOUSES]} castShadow>
        <coneGeometry args={[0.085, 0.07, 4]} />
        <meshStandardMaterial color={P.roof} roughness={0.75} />
      </instancedMesh>
      <instancedMesh ref={treeRef} args={[undefined, undefined, TREES]} castShadow>
        <coneGeometry args={[0.05, 0.18, 7]} />
        <meshStandardMaterial color={P.tree} roughness={0.85} />
      </instancedMesh>
      <instancedMesh ref={routeRef} args={[undefined, undefined, ROUTE]}>
        <sphereGeometry args={[0.022, 10, 8]} />
        <meshBasicMaterial color={P.route} toneMapped={false} />
      </instancedMesh>

      {/* high-ground assembly beacon */}
      {beacon > 0 && (
        <group position={[ASSEMBLY[0], ay, ASSEMBLY[1]]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.035, 0.07, 1.0, 16, 1, true]} />
            <meshBasicMaterial color={P.route} transparent opacity={0.35 * beacon} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} scale={beacon * pulse}>
            <ringGeometry args={[0.12, 0.16, 48]} />
            <meshBasicMaterial color={P.route} transparent opacity={beacon} toneMapped={false} />
          </mesh>
          <sprite position={[0, 0.15, 0]} scale={[0.9 * beacon, 0.9 * beacon, 1]}>
            <spriteMaterial map={glow} color={P.route} transparent opacity={0.6 * pulse} depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
        </group>
      )}

      <instancedMesh ref={dustRef} args={[undefined, undefined, DUST]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#CFE6F2" transparent opacity={0.35} depthWrite={false} />
      </instancedMesh>
    </group>
  );
};
