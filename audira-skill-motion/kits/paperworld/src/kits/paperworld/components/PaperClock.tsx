// PaperClock — layered analog clock: rim ring, face disc, cut tick marks, two hands on a
// brad. Time is given in hours (e.g. 15.25 = 3:15); the hands are exact functions of it.

import React from "react";
import { S } from "../geometry/shapes.ts";
import { Cut, type V3 } from "./Paper.tsx";

export const PaperClock: React.FC<{
  r: number;
  hours: number;
  rim?: string;
  face?: string;
  hands?: string;
  ticks?: string;
  position?: V3;
  rotation?: V3;
}> = ({ r, hours, rim = "gold", face = "ivoryLight", hands = "cobaltDeep", ticks = "brownDeep", position, rotation }) => {
  const minuteA = -((hours % 1) * Math.PI * 2);
  const hourA = -(((hours % 12) / 12) * Math.PI * 2);
  const tick = S.rectC(r * 0.05, r * 0.16, r * 0.02);
  const major = S.rectC(r * 0.09, r * 0.22, r * 0.03);
  const hourHand = S.path(`hourhand-${r}`, (s) => {
    s.moveTo(-r * 0.07, -r * 0.12);
    s.lineTo(r * 0.07, -r * 0.12);
    s.lineTo(r * 0.045, r * 0.5);
    s.lineTo(0, r * 0.58);
    s.lineTo(-r * 0.045, r * 0.5);
    s.closePath();
  });
  const minuteHand = S.path(`minutehand-${r}`, (s) => {
    s.moveTo(-r * 0.045, -r * 0.16);
    s.lineTo(r * 0.045, -r * 0.16);
    s.lineTo(r * 0.03, r * 0.76);
    s.lineTo(0, r * 0.84);
    s.lineTo(-r * 0.03, r * 0.76);
    s.closePath();
  });
  const d = Math.max(0.05, r * 0.025);
  return (
    <group position={position} rotation={rotation}>
      <Cut shape={S.circle(r * 1.08)} color={rim} depth={d * 4} />
      <Cut shape={S.circle(r * 0.95)} color={face} depth={d} position={[0, 0, d * 2.2]} />
      <Cut shape={S.ring(r * 0.95, r * 1.08)} color={rim} depth={d * 2} position={[0, 0, d * 3]} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const isMajor = i % 3 === 0;
        return (
          <group key={i} rotation={[0, 0, -a]}>
            <Cut shape={isMajor ? major : tick} color={ticks} depth={d} position={[0, r * (isMajor ? 0.73 : 0.77), d * 3]} />
          </group>
        );
      })}
      <group rotation={[0, 0, hourA]} position={[0, 0, d * 4.2]}>
        <Cut shape={hourHand} color={hands} depth={d * 1.2} />
      </group>
      <group rotation={[0, 0, minuteA]} position={[0, 0, d * 5.6]}>
        <Cut shape={minuteHand} color={hands} depth={d * 1.2} />
      </group>
      <Cut shape={S.circle(r * 0.08)} color={rim} depth={d * 2} position={[0, 0, d * 6.6]} />
    </group>
  );
};
