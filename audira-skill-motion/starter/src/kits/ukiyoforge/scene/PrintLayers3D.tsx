import React, { useMemo } from "react";
import { computeUkiyoState, lerp } from "../core/motion";
import {
  makeBirdTexture,
  makeBoatTexture,
  makeCloudTexture,
  makeMountainTexture,
  makeSkyTexture,
  makeSunTexture,
  makeWaveRowTexture,
} from "../lib/materials";
import { PrintLayer } from "./PrintLayer";

/** Background-to-midground paper sheets: sky, sun, clouds, mountain, wave rows, boats, birds. */
export const PrintLayers3D: React.FC<{ f: number }> = ({ f }) => {
  const s = computeUkiyoState(f);
  const tex = useMemo(
    () => ({
      sky: makeSkyTexture(),
      sun: makeSunTexture(),
      cloudA: makeCloudTexture(4),
      cloudB: makeCloudTexture(9),
      mountain: makeMountainTexture(),
      far: makeWaveRowTexture(1, 9, 28),
      w1: makeWaveRowTexture(2, 6, 55),
      w2: makeWaveRowTexture(3, 4, 85),
      w3: makeWaveRowTexture(4, 3, 105),
      w4: makeWaveRowTexture(5, 2.4, 120),
      boatA: makeBoatTexture(11),
      boatB: makeBoatTexture(12),
      bird: makeBirdTexture(),
    }),
    [],
  );
  const t = s.t;
  const h = s.heave;
  const slide = (k: number, sp: number) => Math.sin(t * sp + k) * 0.12;

  return (
    <group>
      <PrintLayer tex={tex.sky} u={0} v={1.2} w={10} h={11} z={-11} castShadow={false} />
      <PrintLayer tex={tex.sun} u={-0.9} v={lerp(0.7, 2.0, s.sunRise)} w={0.95} h={0.95} z={-10.6} />
      <PrintLayer tex={tex.cloudA} u={-0.2 + t * 0.03} v={2.55} w={3.8} h={0.6} z={-10} />
      <PrintLayer tex={tex.cloudB} u={0.9 - t * 0.025} v={1.25} w={3.0} h={0.47} z={-9.5} />
      <PrintLayer tex={tex.mountain} u={-0.55} v={-0.25} w={3.8} h={3.8} z={-8.5} />

      {/* birds crossing the dawn sky */}
      {[0, 1, 2].map((i) => {
        const flap = 0.55 + 0.45 * Math.abs(Math.sin(t * 5 + i * 1.3));
        return <PrintLayer key={i} tex={tex.bird} u={-1.6 + i * 0.35 + t * 0.11} v={1.9 + i * 0.18 + Math.sin(t + i) * 0.05} w={0.26} h={0.13 * flap} z={-7.5} castShadow={false} />;
      })}

      <PrintLayer tex={tex.far} u={0} v={-1.5} w={8.0} h={1.88} z={-7} du={slide(0, 0.5)} dv={h(0.3, 0.03)} />
      <PrintLayer tex={tex.w1} u={0} v={-2.0} w={8.0} h={1.95} z={-5.5} du={slide(1, 0.6)} dv={h(1.1, 0.05)} />
      <PrintLayer tex={tex.boatA} u={-0.75 + t * 0.02} v={-1.82} w={1.6} h={0.5} z={-4.7} dv={h(1.4, 0.07)} rotZ={Math.sin(t * 1.6 + 1.4) * 0.08} />
      <PrintLayer tex={tex.w2} u={0} v={-2.5} w={8.0} h={1.95} z={-4} du={slide(2, 0.7)} dv={h(2.0, 0.07)} />
      <PrintLayer tex={tex.boatB} u={0.35 - t * 0.015} v={-2.3} w={1.8} h={0.56} z={-3.1} dv={h(2.4, 0.09)} rotZ={-0.1 + Math.sin(t * 1.6 + 2.4) * 0.1} />
      <PrintLayer tex={tex.w3} u={0} v={-3.0} w={8.0} h={1.95} z={-2.4} du={slide(3, 0.8)} dv={h(2.8, 0.09)} />
      <PrintLayer tex={tex.w4} u={0} v={-3.55} w={8.0} h={2.03} z={0.6} du={slide(4, 0.9)} dv={h(3.5, 0.1)} />
    </group>
  );
};
