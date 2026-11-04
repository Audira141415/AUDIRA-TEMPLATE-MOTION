// PaperCharacter — a layered cardstock puppet rig. Give every film its own character: colours (`colors`),
// scarf and hair curl on/off, scale and acting; never reuse a previous film's look.
//
// Construction (front faces +z, feet on the origin, 6.3 units tall):
//   back layer   bob of dark-brown hair, long scarf tail, coat back-belt
//   body layer   coral A-line coat, cobalt legs + brown shoes (hinged at the hips)
//   front layer  peach head, swoop fringe, curl, face, mint collar, gold buttons,
//                sleeves hinged at the shoulders, gold scarf.
// Every piece is real cardstock with thickness, separated by a few millimetres so the
// layers cast tiny shadows on each other. Limbs swing out of plane (like a brad-jointed
// puppet that can also step), so a walk reads from behind, in profile and at three-quarters.

import React from "react";
import { S } from "../geometry/shapes.ts";
import { Cut, Hinge, type V3 } from "./Paper.tsx";

export type PuppetPose = {
  /** Walk cycle position in strides (1.0 = one full left+right cycle). */
  walk: number;
  /** 0 = standing still, 1 = full stride. */
  stride: number;
  /** Forward lean (radians, about x). */
  lean: number;
  headTilt: number;
  headNod: number;
  /** Eye direction, −1..1 each. */
  look: [number, number];
  blink: number;
  /** Arms raised outward (radians, about z). */
  armOut: [number, number];
  /** Arms swung forward (radians, about x; positive = forward). */
  armFwd: [number, number];
  mouth: "smile" | "o" | "flat";
  /** Vertical squash/stretch around 1. */
  squash: number;
  /** Seconds of scarf flutter time. */
  time: number;
};

export const restPose = (p: Partial<PuppetPose> = {}): PuppetPose => ({
  walk: 0,
  stride: 0,
  lean: 0,
  headTilt: 0,
  headNod: 0,
  look: [0, 0],
  blink: 0,
  armOut: [0, 0],
  armFwd: [0, 0],
  mouth: "smile",
  squash: 1,
  time: 0,
  ...p,
});

export const PUPPET_COLORS = {
  coat: "coral",
  coatDeep: "coralDeep",
  collar: "mint",
  scarf: "gold",
  scarfDeep: "goldDeep",
  legs: "cobalt",
  shoes: "brown",
  hair: "#6a4532",
  hairLight: "#8a6047",
  skin: "skin",
  ink: "ink",
  cheek: "coralLight",
};
export type PuppetColors = { [K in keyof typeof PUPPET_COLORS]: string };

// ── Shapes (built once, cached by key) ─────────────────────────────────────────
const coat = S.path("pip-coat", (s) => {
  s.moveTo(-1.0, 1.12);
  s.lineTo(1.0, 1.12);
  s.quadraticCurveTo(1.1, 1.12, 1.06, 1.3);
  s.lineTo(0.74, 3.12);
  s.quadraticCurveTo(0.7, 3.42, 0.42, 3.42);
  s.lineTo(-0.42, 3.42);
  s.quadraticCurveTo(-0.7, 3.42, -0.74, 3.12);
  s.lineTo(-1.06, 1.3);
  s.quadraticCurveTo(-1.1, 1.12, -1.0, 1.12);
});
const hem = S.path("pip-hem", (s) => {
  s.moveTo(-1.0, 1.12);
  s.lineTo(1.0, 1.12);
  s.quadraticCurveTo(1.1, 1.12, 1.06, 1.3);
  s.lineTo(1.03, 1.42);
  s.lineTo(-1.03, 1.42);
  s.lineTo(-1.06, 1.3);
  s.quadraticCurveTo(-1.1, 1.12, -1.0, 1.12);
});
const collarL = S.poly("pip-collarL", [[-0.05, 2.78], [-0.5, 3.42], [-0.02, 3.42]]);
const collarR = S.poly("pip-collarR", [[0.05, 2.78], [0.02, 3.42], [0.5, 3.42]]);
const leg = S.rect(0.4, 1.3, 0.12);
const shoe = S.rectC(0.62, 0.3, 0.14);
const sleeve = S.path("pip-sleeve", (s) => {
  // hangs from the shoulder pivot at (0,0) down to y = -1.3
  s.moveTo(-0.2, 0.05);
  s.quadraticCurveTo(0, 0.24, 0.2, 0.05);
  s.lineTo(0.24, -1.18);
  s.quadraticCurveTo(0, -1.3, -0.24, -1.18);
  s.closePath();
});
const cuff = S.rectC(0.5, 0.16, 0.06);
const hand = S.circle(0.2);
const neck = S.rect(0.46, 0.5, 0.1);
const head = S.circle(1.12);
const hairBack = S.path("pip-hairBack", (s) => {
  s.moveTo(-1.3, 4.0);
  s.quadraticCurveTo(-1.36, 3.86, -1.1, 3.86);
  s.lineTo(1.1, 3.86);
  s.quadraticCurveTo(1.36, 3.86, 1.3, 4.0);
  s.lineTo(1.28, 4.82);
  s.absarc(0, 4.82, 1.28, 0, Math.PI, false);
  s.lineTo(-1.3, 4.0);
});
const backSwoop = S.path("pip-backSwoop", (s) => {
  s.moveTo(-1.05, 4.35);
  s.bezierCurveTo(-0.6, 4.75, 0.1, 4.6, 0.55, 5.15);
  s.bezierCurveTo(0.75, 5.45, 0.95, 5.5, 1.1, 5.3);
  s.bezierCurveTo(0.9, 5.2, 0.85, 4.9, 0.55, 4.7);
  s.bezierCurveTo(0.1, 4.35, -0.5, 4.2, -1.05, 4.35);
});
const clip = S.rectC(0.62, 0.2, 0.1);
const fringe = S.path("pip-fringe", (s) => {
  s.moveTo(-1.16, 4.7);
  s.absarc(0, 4.8, 1.18, Math.PI + 0.08, -0.08, true);
  // wavy swoop back from right temple to left temple
  s.bezierCurveTo(0.95, 5.05, 0.55, 5.25, 0.3, 5.12);
  s.bezierCurveTo(0.05, 5.0, -0.2, 5.28, -0.45, 5.08);
  s.bezierCurveTo(-0.75, 4.86, -0.95, 4.95, -1.16, 4.7);
});
const curlShape = S.path("pip-curl", (s) => {
  s.moveTo(-0.08, 0);
  s.bezierCurveTo(-0.2, 0.35, 0.05, 0.62, 0.32, 0.55);
  s.bezierCurveTo(0.55, 0.48, 0.5, 0.2, 0.3, 0.24);
  s.bezierCurveTo(0.18, 0.27, 0.22, 0.4, 0.3, 0.38);
  s.bezierCurveTo(0.12, 0.5, -0.02, 0.3, 0.08, 0);
  s.closePath();
});
const eye = S.ellipse(0.12, 0.19);
const glint = S.circle(0.045);
const cheek = S.circle(0.17);
const smile = S.path("pip-smile", (s) => {
  s.moveTo(-0.17, 0.04);
  s.quadraticCurveTo(0, -0.16, 0.17, 0.04);
  s.quadraticCurveTo(0, -0.07, -0.17, 0.04);
});
const mouthO = S.ellipse(0.09, 0.11);
const mouthFlat = S.rectC(0.26, 0.05, 0.025);
const button = S.circle(0.085);
const scarfBand = S.rectC(1.5, 0.42, 0.2);
const scarfTail = S.path("pip-scarfTail", (s) => {
  s.moveTo(-0.2, 0);
  s.lineTo(0.2, 0);
  s.lineTo(0.24, -0.95);
  s.lineTo(0.12, -1.06);
  s.lineTo(0.04, -0.96);
  s.lineTo(-0.05, -1.06);
  s.lineTo(-0.14, -0.96);
  s.lineTo(-0.24, -1.04);
  s.closePath();
});
const stripe = S.rectC(0.44, 0.07, 0.02);
const belt = S.rectC(1.5, 0.22, 0.06);


export const PaperCharacter: React.FC<{
  pose: PuppetPose; position?: V3; yaw?: number; scale?: number; visible?: boolean;
  /** PALETTE names or hex colours; unspecified parts keep the base colours. */
  colors?: Partial<PuppetColors>;
  scarf?: boolean;
  curl?: boolean;
}> = ({
  pose,
  position,
  yaw = 0,
  scale = 1,
  visible = true,
  colors,
  scarf = true,
  curl = true,
}) => {
  const C: PuppetColors = { ...PUPPET_COLORS, ...colors };
  const ph = pose.walk * Math.PI * 2;
  const swing = Math.sin(ph) * 0.48 * pose.stride;
  const bob = ((1 - Math.cos(ph * 2)) / 2) * 0.09 * pose.stride;
  const sway = Math.sin(ph) * 0.035 * pose.stride;
  const t = pose.time;
  // the scarf trails behind in proportion to speed, with a soft flutter
  const flutter = Math.sin(t * 7.3) * 0.08 + Math.sin(t * 11.9 + 1) * 0.04;
  const trail = 0.25 + 0.75 * pose.stride;
  const eyeX = pose.look[0] * 0.08, eyeY = pose.look[1] * 0.06;
  const blink = Math.max(0.12, 1 - pose.blink);
  const headSec = Math.sin(ph * 2 - 0.6) * 0.025 * pose.stride; // head lags the body

  return (
    <group position={position} rotation={[0, yaw, 0]} scale={scale} visible={visible}>
      <group position={[0, bob, 0]} rotation={[pose.lean, 0, sway]} scale={[1, pose.squash, 1]}>
        {/* legs + shoes, hinged at the hips */}
        {([-1, 1] as const).map((side) => (
          <Hinge key={side} at={[side * 0.3, 1.45, -0.03]} axis="x" angle={side * swing}>
            <Cut shape={leg} color={C.legs} position={[side * 0.3, 0.18, -0.03]} />
            <Cut shape={shoe} color={C.shoes} position={[side * 0.32, 0.16, 0.06]} depth={0.1} />
          </Hinge>
        ))}

        {/* coat */}
        <Cut shape={coat} color={C.coat} position={[0, 0, 0]} />
        <Cut shape={hem} color={C.coatDeep} position={[0, 0, 0.045]} depth={0.03} />
        <Cut shape={collarL} color={C.collar} position={[0, 0, 0.05]} depth={0.04} />
        <Cut shape={collarR} color={C.collar} position={[0, 0, 0.05]} depth={0.04} />
        {[2.55, 2.12, 1.7].map((y) => (
          <Cut key={y} shape={button} color={C.scarf} position={[0, y, 0.055]} depth={0.05} />
        ))}
        {/* back: belt with two buttons, seen when Pip walks away */}
        <Cut shape={belt} color={C.coatDeep} position={[0, 2.0, -0.05]} depth={0.04} />
        {[-0.45, 0.45].map((x) => (
          <Cut key={x} shape={button} color={C.scarf} position={[x, 2.0, -0.085]} depth={0.04} />
        ))}

        {/* scarf: band, front tail, and a long back tail that streams behind */}
        <Cut shape={neck} color={C.skin} position={[0, 3.3, -0.01]} />
        {scarf ? (
          <>
            <Cut shape={scarfBand} color={C.scarf} position={[0, 3.46, 0.07]} depth={0.08} />
            {[-0.45, 0, 0.45].map((x) => (
              <Cut key={x} shape={stripe} color={C.scarfDeep} position={[x, 3.46, 0.115]} rotation={[0, 0, Math.PI / 2]} scale={[0.7, 1, 1]} depth={0.02} />
            ))}
            <Hinge at={[0.42, 3.36, 0.11]} axis="x" angle={0.12 * trail + flutter * 0.5}>
              <group position={[0.42, 3.36, 0.11]} rotation={[0, 0, 0.12]}>
                <Cut shape={scarfTail} color={C.scarf} scale={[1, 0.85, 1]} />
                <Cut shape={stripe} color={C.scarfDeep} position={[0, -0.55, 0.035]} depth={0.02} />
              </group>
            </Hinge>
            <Hinge at={[-0.35, 3.4, -0.1]} axis="x" angle={0.3 + 0.95 * trail + flutter}>
              <group position={[-0.35, 3.4, -0.1]} rotation={[0, 0, -0.18 + flutter * 0.6]}>
                <Cut shape={scarfTail} color={C.scarf} scale={[1.05, 1.35, 1]} />
                <Cut shape={stripe} color={C.scarfDeep} position={[0, -0.8, -0.035]} depth={0.02} />
              </group>
            </Hinge>
          </>
        ) : null}

        {/* sleeves, hinged at the shoulders */}
        {([-1, 1] as const).map((side) => {
          const i = side < 0 ? 0 : 1;
          const fwd = -side * swing * 0.85 + pose.armFwd[i];
          return (
            <group key={side} position={[side * 0.74, 3.18, 0.1]} rotation={[-fwd, 0, side * (0.1 + pose.armOut[i])]}>
              <Cut shape={sleeve} color={C.coat} />
              <Cut shape={cuff} color={C.collar} position={[0, -1.12, 0.04]} depth={0.04} />
              <Cut shape={hand} color={C.skin} position={[0, -1.36, 0.02]} />
            </group>
          );
        })}

        {/* head */}
        <group position={[0, 3.62, 0]} rotation={[pose.headNod + headSec, 0, pose.headTilt]}>
          <group position={[0, -3.62, 0]}>
            <Cut shape={hairBack} color={C.hair} position={[0, 0, -0.07]} />
            {/* back of the head: a paler swoop of hair and a gold clip, so Pip reads from behind */}
            <Cut shape={backSwoop} color={C.hairLight} position={[0, 0, -0.115]} depth={0.03} />
            <group position={[-0.62, 4.95, -0.14]} rotation={[0, 0, 0.5]}>
              <Cut shape={clip} color={C.scarf} depth={0.05} />
              <Cut shape={S.circle(0.09)} color={C.coat} depth={0.04} position={[0, 0, -0.04]} />
            </group>
            <Cut shape={head} color={C.skin} position={[0, 4.72, 0.03]} />
            <Cut shape={fringe} color={C.hair} position={[0, 0, 0.1]} />
            {curl ? (
              <group position={[0.1, 5.95, 0.0]} rotation={[0, 0, Math.sin(t * 3.1) * 0.08 - 0.1]}>
                <Cut shape={curlShape} color={C.hair} />
              </group>
            ) : null}
            {/* face */}
            {[-1, 1].map((side) => (
              <group key={side} position={[side * 0.4 + eyeX, 4.5 + eyeY, 0.08]} scale={[1, blink, 1]}>
                <Cut shape={eye} color={C.ink} depth={0.03} />
                {pose.blink < 0.5 ? <Cut shape={glint} color="ivoryLight" position={[0.04, 0.07, 0.02]} depth={0.02} /> : null}
              </group>
            ))}
            {[-1, 1].map((side) => (
              <Cut key={side} shape={cheek} color={C.cheek} position={[side * 0.7, 4.16, 0.075]} depth={0.02} />
            ))}
            {pose.mouth === "smile" ? (
              <Cut shape={smile} color={C.ink} position={[0, 4.12, 0.08]} depth={0.02} />
            ) : pose.mouth === "o" ? (
              <Cut shape={mouthO} color={C.ink} position={[0, 4.08, 0.08]} depth={0.02} />
            ) : (
              <Cut shape={mouthFlat} color={C.ink} position={[0, 4.1, 0.08]} depth={0.02} />
            )}
          </group>
        </group>
      </group>
    </group>
  );
};
