import React from "react";
import { TimeforgeFilm } from "../film/TimeforgeFilm.tsx";
import { STARTER_CUT } from "./cut.ts";
import { STARTER } from "./subject.ts";

/** The kit's example subject (a 3-era camera stand-in). Copy example/ to start a new subject. */
export const TimeforgeExample: React.FC = () => <TimeforgeFilm subject={STARTER} cut={STARTER_CUT} />;
