// BUILDFORGE construction-sequence QA (no GPU needed):
//   node --experimental-strip-types scripts/buildforge-check.ts
// Checks order (supports before loads, temporary works not struck while loaded), clashes between
// installed solids, and that everything is in place before the end. Point it at your own film's
// components and windows the same way (copy the three lines below per sequence).

import { checkSequence, report } from "../src/kits/buildforge/assembly/check.ts";
import { pavilionComponents } from "../src/kits/buildforge/example/pavilion.ts";
import { END, WINDOWS } from "../src/kits/buildforge/example/sequence.ts";

let ok = true;
{
  const r = checkSequence(pavilionComponents(), WINDOWS, { end: END, skip: (c) => c.phase === "setout" || c.phase === "strings" });
  ok = report("pavilion-example", r, WINDOWS.length) && ok;
}
process.exit(ok ? 0 : 1);
