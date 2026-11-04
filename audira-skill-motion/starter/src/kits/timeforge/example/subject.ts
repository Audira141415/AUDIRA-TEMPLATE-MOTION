import type { Subject } from "../film/subject.ts";
import { ERA_LABEL, ERA_ORDER } from "./eras.ts";
import { SWEEP } from "./evolution.ts";
import { StarterModel } from "./Model.tsx";
import type { Cam, StarterFx } from "./params.ts";

export const STARTER: Subject<Cam, StarterFx> = {
  title: "CONTOH SUBJECT",
  order: ERA_ORDER,
  labels: ERA_LABEL,
  rail: ["1950", "1995", "2026"],
  sweep: SWEEP,
  halfHeight: (p) => p.body.hh + 0.1,
  footprint: (p) => ({ w: p.body.hw, d: p.body.d / 2 + p.lens.len / 2 }),
  Model: StarterModel,
};
