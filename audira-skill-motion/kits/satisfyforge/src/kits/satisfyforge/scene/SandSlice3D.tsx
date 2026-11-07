import React, { useMemo } from "react";
import { SLICE_TIMES, clamp01, easeInOutCubic, easeInQuad, lerp, settle, win } from "../core/motion";
import { SATISFYFORGE_PALETTE as P } from "../lib/palette";
import { makeSandGrain, sandMaterial } from "../lib/materials";
import { PLINTH_TOP, STATIONS } from "./StudioSweep3D";

// Loop 1 — kinetic sand block with four pastel strata, sliced right-to-left by a chrome blade.
// Each slice flips over its bottom-right edge and lands flat on top of the previous slices,
// building a neat striped stack (slice k rests at height k·W).

const N = SLICE_TIMES.length;
const W = 0.15; // slice thickness (x)
const H = 0.6; // block height
const D = 0.8; // block depth
const LAYERS = [P.lilac, P.mint, P.butter, P.pink]; // bottom → top
const HALF = (N * W) / 2;

export const SandSlice3D: React.FC<{ t: number }> = ({ t }) => {
  const grain = useMemo(makeSandGrain, []);
  const mats = useMemo(() => LAYERS.map((c) => sandMaterial(c, grain)), [grain]);
  const x0 = STATIONS[0] - 0.35;

  // blade: hovers above the next cut line, plunges, lifts
  let bladeX = HALF - W;
  let bladeY = H + 0.35;
  for (let k = 0; k < N; k++) {
    const ts = SLICE_TIMES[k];
    const cutX = HALF - (k + 1) * W;
    if (t >= ts - 0.4) {
      bladeX = cutX;
      const down = win(t, ts - 0.3, ts - 0.04);
      const up = win(t, ts + 0.02, ts + 0.22);
      bladeY = lerp(H + 0.35, -0.02, easeInQuad(down) * (1 - up)) + 0.0;
    }
  }
  const bladeOut = win(t, SLICE_TIMES[N - 1] + 0.3, SLICE_TIMES[N - 1] + 0.9);

  return (
    <group position={[x0, PLINTH_TOP, 0]}>
      {Array.from({ length: N }, (_, k) => {
        const ts = SLICE_TIMES[k];
        // pivot: bottom-right edge of slice k
        const px = HALF - k * W;
        const fall = clamp01((t - ts - 0.02) / 0.42);
        const e = easeInOutCubic(fall);
        const ang = -(Math.PI / 2) * e;
        const bump = fall >= 1 ? Math.abs(settle(t, ts + 0.44, 0.025, 22, 9)) : 0;
        return (
          <group key={k} position={[px + k * W * e, k * W * e + bump + Math.sin(Math.PI * e) * 0.12, 0]} rotation={[0, 0, ang]}>
            {LAYERS.map((_, li) => (
              <mesh key={li} material={mats[li]} position={[-W / 2, H / 8 + (li * H) / 4, 0]} castShadow receiveShadow>
                <boxGeometry args={[W - 0.002, H / 4, D]} />
              </mesh>
            ))}
          </group>
        );
      })}
      {/* chrome blade */}
      <group position={[bladeX, bladeY + 0.3, 0]} visible={bladeOut < 1}>
        <group position={[0, bladeOut * 1.5, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.012, 0.6, D + 0.3]} />
            <meshPhysicalMaterial color={P.chrome} metalness={1} roughness={0.12} />
          </mesh>
          <mesh position={[0, 0.38, 0]} castShadow>
            <boxGeometry args={[0.07, 0.16, D + 0.36]} />
            <meshPhysicalMaterial color={P.handle} roughness={0.3} clearcoat={0.8} />
          </mesh>
        </group>
      </group>
      {/* faint fresh-cut sand dust at each cut */}
      {SLICE_TIMES.map((ts, k) => {
        const a = t - ts;
        if (a < 0 || a > 0.6) return null;
        const r = 0.08 + a * 0.5;
        return (
          <mesh key={`d${k}`} position={[HALF - (k + 1) * W, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r, r + 0.03, 40]} />
            <meshBasicMaterial color={LAYERS[k % 4]} transparent opacity={(1 - a / 0.6) * 0.7} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};
