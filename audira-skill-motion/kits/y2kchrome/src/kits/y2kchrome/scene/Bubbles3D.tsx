import React, { useMemo } from "react";
import * as THREE from "three";
import { BURST, MORPH_B, clamp01, mulberry32 } from "../core/motion";
import { bubbleMaterial, makeSparkleTexture } from "../lib/materials";
import { BLOB_CENTER } from "./ChromeBlob3D";

// Foreground + FX: glossy iridescent soap bubbles rising on loops (some very close to the lens),
// twinkling four-point lens sparkles, and the payoff flare + bubble pop.

export const Bubbles3D: React.FC<{ t: number }> = ({ t }) => {
  const mat = useMemo(bubbleMaterial, []);
  const sparkle = useMemo(makeSparkleTexture, []);
  const bubbles = useMemo(() => {
    const rnd = mulberry32(5433);
    return Array.from({ length: 24 }, (_, i) => ({
      x: (rnd() - 0.5) * 6,
      z: i < 5 ? 2.2 + rnd() * 1.3 : (rnd() - 0.5) * 5 - 1,
      r: i < 5 ? 0.35 + rnd() * 0.25 : 0.1 + rnd() * 0.3,
      period: 7 + rnd() * 5,
      phase: rnd(),
      wob: rnd() * 6.28,
      pops: rnd() > 0.5,
    }));
  }, []);
  const sparks = useMemo(() => {
    const rnd = mulberry32(5444);
    return Array.from({ length: 14 }, () => ({ x: (rnd() - 0.5) * 5, y: -1 + rnd() * 4.5, z: (rnd() - 0.5) * 3, s: 0.25 + rnd() * 0.45, ph: rnd() * 6.28, sp: 1.5 + rnd() * 2.5 }));
  }, []);
  const flare = clamp01(1 - Math.abs(t - (MORPH_B + 0.15)) / 0.6);

  return (
    <group>
      {bubbles.map((b, i) => {
        const u = (t / b.period + b.phase) % 1;
        const y = -3 + u * 7.5;
        const popA = t - BURST - (i % 5) * 0.06;
        const popping = b.pops && popA > 0;
        if (popping && popA > 0.25) return null;
        const s = b.r * (popping ? 1 + popA * 3 : 1) * (1 + Math.sin(t * 3 + b.wob) * 0.03);
        return (
          <mesh key={i} material={mat} position={[b.x + Math.sin(t * 0.8 + b.wob) * 0.25, y, b.z]} scale={[s, s * (1 + Math.sin(t * 4 + b.wob) * 0.04), s]} renderOrder={3}>
            <sphereGeometry args={[1, 40, 28]} />
          </mesh>
        );
      })}
      {sparks.map((p, i) => {
        const tw = Math.pow(Math.max(0, Math.sin(t * p.sp + p.ph)), 6);
        return (
          <sprite key={i} position={[p.x, p.y, p.z]} scale={[p.s * (0.5 + tw), p.s * (0.5 + tw), 1]} renderOrder={4}>
            <spriteMaterial map={sparkle} transparent opacity={tw} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} rotation={t * 0.3} />
          </sprite>
        );
      })}
      {/* payoff flare on the sparkle tip */}
      {flare > 0 && (
        <sprite position={[BLOB_CENTER.x, BLOB_CENTER.y + 1.15, 0.5]} scale={[3.2 * flare, 3.2 * flare, 1]} renderOrder={5}>
          <spriteMaterial map={sparkle} transparent opacity={flare} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} rotation={0.2} />
        </sprite>
      )}
    </group>
  );
};
