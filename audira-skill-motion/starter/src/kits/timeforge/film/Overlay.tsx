// Typography: rolling year at the top, one descriptor line, a time rail at the bottom (one stop
// per era). Laid out at 1080 × 1920 and scaled to the render size. All words come from the
// subject and the cut.

import { evaluate } from "../morph/eraTimeline.ts";
import type { Tree } from "../morph/lerpTree.ts";
import { sample } from "../../../core/motion/track.ts";
import { ease, mix, remap } from "../../../core/motion/easing.ts";
import { INK, INK_SOFT } from "../../../core/type/fonts.ts";
import { TimeRail } from "../type/TimeRail.tsx";
import { YearCounter } from "../type/YearCounter.tsx";
import type { Cut } from "./cut.ts";
import type { Subject } from "./subject.ts";

const ACCENT = "#46bfb0";

const yearAt = <P extends Tree, Fx extends Record<string, number>>(subject: Subject<P, Fx>, cut: Cut<P, Fx>, x: number) => {
  const L = subject.labels;
  const e = evaluate(cut.evolution, x);
  if (!e.morph) return { year: L[subject.order[e.eraPos]].year, e };
  const a = L[e.morph.from].year;
  const b = L[e.morph.to].year;
  return { year: mix(a, b, ease.inOut(remap(e.t, 0.12, 0.88))), e };
};

type Props<P extends Tree, Fx extends Record<string, number>> = { subject: Subject<P, Fx>; cut: Cut<P, Fx>; frame: number; fps: number; width: number; font: string };

export const Overlay = <P extends Tree, Fx extends Record<string, number>>({ subject, cut, frame, fps, width, font }: Props<P, Fx>) => {
  const ERA_LABEL = subject.labels;
  const k = width / 1080;
  const x = cut.clock(frame, fps);
  const { year, e } = yearAt(subject, cut, x);
  const prev = yearAt(subject, cut, cut.clock(Math.max(0, frame - 1), fps)).year;
  const from = e.morph ? e.morph.from : subject.order[e.eraPos];
  const to = e.morph ? e.morph.to : from;
  const t = e.morph ? e.t : 0;
  const sOpacity = Math.max(ERA_LABEL[from].decade ? 1 - remap(t, 0.02, 0.14) : 0, ERA_LABEL[to].decade ? remap(t, 0.88, 0.98) : 0);
  // descriptor: out early in the morph, the next one in late
  const outK = e.morph ? ease.type(remap(t, 0.0, 0.18)) : 0;
  const inK = e.morph ? ease.type(remap(t, 0.8, 1.0)) : 1;
  const tag = e.morph && t < 0.5 ? ERA_LABEL[from].tag : ERA_LABEL[to].tag;
  const tagK = e.morph ? (t < 0.5 ? 1 - outK : inK) : 1;
  const labels = Math.min(1, Math.max(0, sample(cut.labels, x)[0]));
  const intro = ease.type(remap(x, ...cut.title.in)) * labels;
  const title = 1 - ease.type(remap(x, ...cut.title.out));
  const closing = cut.closing ? ease.type(remap(x, ...cut.closing.in)) : 0;
  const isConcept = (subject.accentEras ?? []).includes(to) && (!e.morph || t > 0.8);

  return (
    <div style={{ position: "absolute", inset: 0, width: 1080, height: 1920, transform: `scale(${k})`, transformOrigin: "0 0", fontFamily: font }}>
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, textAlign: "center", opacity: intro }}>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "0.42em", paddingLeft: "0.42em", color: INK_SOFT, opacity: title, height: 40 }}>
          {subject.title}
        </div>
        <div style={{ marginTop: 4, transform: `translateY(${(1 - intro) * 18}px)` }}>
          <YearCounter year={year} prev={prev} size={150} font={font} color={INK} weight={200} suffix={{ text: "s", opacity: sOpacity }} />
        </div>
        <div
          style={{
            marginTop: 6, fontSize: 28, fontWeight: 600, letterSpacing: "0.3em", paddingLeft: "0.3em",
            color: isConcept ? ACCENT : INK_SOFT, opacity: tagK, transform: `translateY(${(1 - tagK) * 10}px)`,
          }}
        >
          {tag}
        </div>
        {closing > 0 ? (
          <div
            style={{
              marginTop: 28, fontSize: 40, fontWeight: 300, letterSpacing: "0.01em", color: INK,
              opacity: closing, transform: `translateY(${(1 - closing) * 14}px)`,
            }}
          >
            {cut.closing!.text}
          </div>
        ) : null}
      </div>
      <div style={{ position: "absolute", left: 150, top: 1752, opacity: intro }}>
        <TimeRail labels={subject.rail} pos={e.eraPos} width={780} font={font} ink={INK} soft={INK_SOFT} accent={ACCENT} />
      </div>
    </div>
  );
};
