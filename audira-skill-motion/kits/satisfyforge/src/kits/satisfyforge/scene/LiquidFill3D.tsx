import React, { useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FILL_LAYERS, clamp01, easeInOutCubic, settle, win } from "../core/motion";
import { SATISFYFORGE_PALETTE as P } from "../lib/palette";
import { heartShape } from "../lib/materials";
import { PLINTH_TOP, STATIONS } from "./StudioSweep3D";

// Loop 2 — an upright glass heart fills with three pastel layers, each stopping exactly on its
// line. The liquid is the heart's inner volume cut by two world-space clipping planes per layer.

const HEART_SCALE = 1.25;
const BASE_Y = PLINTH_TOP + 0.62; // heart centre height
const BOTTOM = BASE_Y - 0.5 * HEART_SCALE;
const TOP = BASE_Y + 0.52 * HEART_SCALE;
const COLORS = [P.pink, P.lilac, P.mint];

export const LiquidFill3D: React.FC<{ t: number }> = ({ t }) => {
  const { gl } = useThree();
  useLayoutEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);

  const glassGeo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(heartShape(HEART_SCALE), { depth: 0.42, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 4, curveSegments: 48 });
    g.translate(0, 0, -0.21);
    return g;
  }, []);
  const liquidGeo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(heartShape(HEART_SCALE * 0.94), { depth: 0.34, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 3, curveSegments: 48 });
    g.translate(0, 0.01, -0.17);
    return g;
  }, []);

  const layers = useMemo(
    () =>
      COLORS.map((c) => {
        const lo = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const hi = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
        const mat = new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.12, clearcoat: 1, clippingPlanes: [lo, hi], side: THREE.DoubleSide, sheen: 0.4, sheenColor: new THREE.Color("#ffffff") });
        return { lo, hi, mat };
      }),
    [],
  );

  const span = TOP - BOTTOM;
  const bounds = [0, 0.36, 0.68, 1.0].map((k) => BOTTOM + k * span);
  let streamTop = 0;
  let streamBottom = 0;
  let streamColor = COLORS[0];
  let streamOn = false;
  layers.forEach((L, i) => {
    const { a, b } = FILL_LAYERS[i];
    const p = easeInOutCubic(win(t, a, b));
    const lo = bounds[i];
    const hi = bounds[i] + (bounds[i + 1] - bounds[i]) * p + (p >= 1 ? settle(t, b, 0.006, 14, 6) : 0);
    L.lo.constant = -lo + 0.0005;
    L.hi.constant = hi;
    L.mat.visible = p > 0;
    if (t > a - 0.15 && t < b + 0.05) {
      streamOn = true;
      streamColor = COLORS[i];
      streamBottom = hi;
    }
  });
  streamTop = TOP + 0.95;
  const streamIn = clamp01((t - (FILL_LAYERS[0].a - 0.3)) / 0.3) * (1 - win(t, FILL_LAYERS[2].b + 0.1, FILL_LAYERS[2].b + 0.5));

  return (
    <group position={[STATIONS[1], 0, 0]}>
      <group position={[0, BASE_Y, 0]}>
        {layers.map((L, i) => (
          <mesh key={i} geometry={liquidGeo} material={L.mat} castShadow />
        ))}
      </group>
      {/* glass mould, drawn after the liquid */}
      <mesh geometry={glassGeo} position={[0, BASE_Y, 0]} renderOrder={2}>
        <meshPhysicalMaterial color="#FFFFFF" transparent opacity={0.32} roughness={0.04} emissive="#ffffff" emissiveIntensity={0.05} clearcoat={1} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {/* base cradle */}
      <mesh position={[0, PLINTH_TOP + 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.12, 0.6]} />
        <meshPhysicalMaterial color={P.butter} roughness={0.4} clearcoat={0.5} />
      </mesh>
      {/* nozzle and stream */}
      <group position={[0, streamTop + (1 - streamIn) * 1.2, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.07, 0.04, 0.22, 24]} />
          <meshPhysicalMaterial color={P.chrome} metalness={1} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.3, 32]} />
          <meshPhysicalMaterial color={P.handle} roughness={0.3} clearcoat={0.8} />
        </mesh>
      </group>
      {streamOn && streamIn > 0.9 && (
        <mesh position={[0, (streamTop - 0.11 + streamBottom) / 2, 0]} castShadow>
          <cylinderGeometry args={[0.028, 0.028, Math.max(0.01, streamTop - 0.11 - streamBottom), 16]} />
          <meshPhysicalMaterial color={streamColor} roughness={0.08} clearcoat={1} />
        </mesh>
      )}
    </group>
  );
};
