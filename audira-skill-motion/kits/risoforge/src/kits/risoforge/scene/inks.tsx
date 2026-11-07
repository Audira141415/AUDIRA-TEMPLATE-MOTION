import { useMemo } from "react";
import { RISO_PALETTE as P } from "../lib/palette";
import { makeRisoInk } from "../lib/materials";

// One material per drum × density. Screen angles differ per drum like real riso masters.
const build = (dotPx: number) => ({
  pinkSolid: makeRisoInk(P.fluoPink, 1, dotPx, 0.11, 0.26),
  pinkHalf: makeRisoInk(P.fluoPink, 0.45, dotPx, 0.12, 0.26),
  pinkGlow: makeRisoInk(P.fluoPink, 0.22, dotPx, 0.13, 0.26),
  blueSolid: makeRisoInk(P.blue, 1, dotPx, 0.21, 1.31),
  blueDense: makeRisoInk(P.blue, 0.72, dotPx, 0.22, 1.31),
  blueSky: makeRisoInk(P.blue, 0.2, dotPx, 0.23, 1.31),
  yellowSolid: makeRisoInk(P.yellow, 1, dotPx, 0.31, 0.0),
  yellowHalf: makeRisoInk(P.yellow, 0.55, dotPx, 0.32, 0.0),
});

export type RisoInks = ReturnType<typeof build>;
export const useRisoInks = (dotPx: number) => useMemo(() => build(dotPx), [dotPx]);
