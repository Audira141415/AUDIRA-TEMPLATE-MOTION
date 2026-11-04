// Assembly sequence → construction timeline. Each phase gets a window on the film clock; the
// components of a phase are staggered across it by key. `validate` enforces the physical
// rule: nothing starts before everything it bears on is in place, and temporary works are
// not removed while something still bears on them.

import type { Component } from "../types.ts";

export type PhaseWindow = {
  phase: string;
  start: number;
  end: number;
  /** Frames one component's move takes inside the window. */
  dur: number;
};

export type Slot = { start: number; end: number; out?: [number, number] };
export type Timeline = Map<string, Slot>;

const placeIn = (w: PhaseWindow, members: Component[], set: (c: Component, a: number, b: number) => void) => {
  const keyOf = (c: Component, i: number) => c.key ?? i;
  const keys = [...new Set(members.map(keyOf))].sort((a, b) => a - b);
  const span = Math.max(0, w.end - w.dur - w.start);
  members.forEach((c, i) => {
    const r = keys.indexOf(keyOf(c, i));
    const a = keys.length > 1 ? w.start + (span * r) / (keys.length - 1) : w.start;
    set(c, a, a + w.dur);
  });
};

export const schedule = (components: Component[], windows: PhaseWindow[]): Timeline => {
  const win = new Map(windows.map((w) => [w.phase, w]));
  const get = (phase: string) => {
    const w = win.get(phase);
    if (!w) throw new Error(`BUILDFORGE: no window for phase "${phase}"`);
    if (w.dur > w.end - w.start) throw new Error(`BUILDFORGE: phase "${phase}" dur ${w.dur} exceeds its window`);
    return w;
  };
  const slots: Timeline = new Map();
  const group = (by: (c: Component) => string | undefined) => {
    const m = new Map<string, Component[]>();
    for (const c of components) {
      const k = by(c);
      if (k) m.set(k, [...(m.get(k) ?? []), c]);
    }
    return m;
  };
  for (const [phase, members] of group((c) => c.phase)) placeIn(get(phase), members, (c, a, b) => slots.set(c.id, { start: a, end: b }));
  for (const [phase, members] of group((c) => c.exit)) placeIn(get(phase), members, (c, a, b) => (slots.get(c.id)!.out = [a, b]));
  return slots;
};

export const validate = (components: Component[], slots: Timeline) => {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const c of components) {
    if (seen.has(c.id)) issues.push(`duplicate id ${c.id}`);
    seen.add(c.id);
  }
  for (const c of components) {
    const s = slots.get(c.id)!;
    for (const r of c.rests ?? []) {
      const t = slots.get(r);
      if (!t) issues.push(`${c.id}: rests on unknown "${r}"`);
      else {
        if (t.end > s.start + 1e-6) issues.push(`${c.id} starts at ${s.start.toFixed(1)} before its support ${r} is in place (${t.end.toFixed(1)})`);
        if (t.out && t.out[0] < (s.out ? s.out[1] : Infinity)) issues.push(`${r} is removed while ${c.id} still bears on it`);
      }
    }
    for (const r of c.after ?? []) {
      const t = slots.get(r);
      if (!t) issues.push(`${c.id}: comes after unknown "${r}"`);
      else if (t.end > s.start + 1e-6) issues.push(`${c.id} starts at ${s.start.toFixed(1)} before ${r} is done (${t.end.toFixed(1)})`);
    }
  }
  return issues;
};

/** Frame at which the last component of a phase is in place. */
export const phaseEnd = (components: Component[], slots: Timeline, phase: string) =>
  Math.max(...components.filter((c) => c.phase === phase).map((c) => slots.get(c.id)!.end));
