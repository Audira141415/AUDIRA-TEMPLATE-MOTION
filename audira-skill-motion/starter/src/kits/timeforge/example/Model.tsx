// The starter camera: one engine Slab for the body, a lathe lens barrel and a top dial.

import React, { useLayoutEffect, useMemo } from "react";
import { CylinderGeometry, LatheGeometry, Vector2 } from "three";
import { Slab } from "../../../core/geometry/slab.ts";
import { applyMat, plainMaterial, sweepMaterial, type Sweep } from "../../../core/materials/sweep.ts";
import type { EraState } from "../morph/eraTimeline.ts";
import type { Cam, StarterFx } from "./params.ts";

export const StarterModel: React.FC<{ era: EraState<Cam>; sweep: Sweep; font: string; fx: StarterFx }> = ({ era, sweep }) => {
  const { params: p, a: A, b: B } = era;
  const slab = useMemo(() => new Slab(), []);
  const body = useMemo(() => [sweepMaterial(), sweepMaterial(), sweepMaterial()], []);
  // sweep materials need the `tfPos` attribute only Slab geometry carries; other meshes blend plainly
  const trim = useMemo(() => plainMaterial(), []);
  const barrel = useMemo(
    () => new LatheGeometry([[0, 0], [1, 0], [1, 0.9], [0.92, 1], [0.7, 1], [0.66, 0.96], [0, 0.96]].map(([x, y]) => new Vector2(x, y)), 64),
    [],
  );
  const dial = useMemo(() => new CylinderGeometry(1, 1, 1, 48), []);
  useLayoutEffect(() => {
    slab.update({ ...p.body });
    const sw = { ...sweep, top: p.body.hh, bottom: -p.body.hh };
    for (const m of body) applyMat(m, A.mats.body, B.mats.body, sw);
    applyMat(trim, A.mats.trim, B.mats.trim, sw);
  });
  // the barrel starts slightly inside the front face so it grows out of it
  const z0 = p.body.d / 2 - 0.05;
  return (
    <>
      <mesh geometry={slab.geometry} material={body} castShadow receiveShadow />
      <mesh geometry={barrel} material={trim} position={[p.lens.x, p.lens.y, z0]} rotation={[Math.PI / 2, 0, 0]} scale={[p.lens.r, p.lens.len, p.lens.r]} castShadow />
      {p.dial.ht > 0.01 ? (
        <mesh geometry={dial} material={trim} position={[p.dial.x, p.body.hh + p.dial.ht / 2 - 0.05, 0]} scale={[p.dial.r, p.dial.ht + 0.1, p.dial.r]} castShadow />
      ) : null}
    </>
  );
};
