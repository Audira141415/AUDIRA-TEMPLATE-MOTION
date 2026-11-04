// PaperDoor — a dimensional cardstock doorway.
//
//   frame   heavy board cut as outline-minus-opening, with a sill, sitting proud of the wall
//   lining  a thin band following the opening, giving the doorway real depth (the reveal)
//   leaf    layered panels + knob, hung on a hinge; or a two-panel bifold that folds like a
//           paper screen (inner panel swings out, outer panel folds back against it)
//   crest   optional coloured cap above the frame (reads from far overhead)
//
// Door-local space: opening centred on x = 0, door plane z = 0, front faces +z, base y = 0.
// The opening (where a portal surface or another room shows through) starts at y = SILL.

import React from "react";
import { S, traceOutline, type Outline, type ShapeSpec } from "../geometry/shapes.ts";
import { Cut, Hinge, type V3 } from "./Paper.tsx";

export const SILL = 0.14;

export type DoorSpec = {
  kind: Outline;
  /** Opening width and height (above the sill). */
  w: number;
  h: number;
  frame: string;
  leaf: string;
  trim: string;
  knob?: string;
  /** Face width of the frame around the opening. */
  border?: number;
  /** Depth of the reveal behind the door plane. */
  reveal?: number;
  panel?: "inset" | "window" | "planks" | "none";
  crest?: string;
  /** Outer frame outline (defaults to the opening's kind). */
  outer?: Outline;
};

export const doorOpening = (d: DoorSpec): ShapeSpec =>
  S.path(`opening-${d.kind}-${d.w}-${d.h}`, (s) => {
    traceOutline(s, d.kind, 0, SILL, d.w, d.h);
  });

const knobShape = S.circle(0.17);
const knobRose = S.circle(0.26);

/** Leaf face decoration (layered on the front of the leaf, and mirrored on the back). */
const LeafDetail: React.FC<{ d: DoorSpec; lw: number; lh: number; side: 1 | -1 }> = ({ d, lw, lh, side }) => {
  const z = side * 0.06;
  const panel = d.panel ?? "inset";
  if (panel === "none") return null;
  if (panel === "inset") {
    const pw = lw * 0.66;
    const top = lh - (d.kind === "rect" ? 0.5 : lw * 0.5) - 0.35;
    const h2 = Math.max(0.6, top * 0.42);
    const h1 = Math.max(0.6, top - h2 - 1.0);
    return (
      <>
        <Cut shape={S.rect(pw, h1, 0.12)} color={d.trim} depth={0.04} position={[0, 0.5, z]} />
        <Cut shape={d.kind === "rect" ? S.rect(pw, h2, 0.12) : S.outline(d.kind, pw, h2 + pw * 0.3)} color={d.trim} depth={0.04} position={[0, 0.5 + h1 + 0.45, z]} />
      </>
    );
  }
  if (panel === "window") {
    const r = Math.min(lw * 0.28, 0.9);
    const wy = lh - (d.kind === "rect" ? r + 0.6 : lw * 0.5 + 0.2);
    return (
      <>
        <Cut shape={S.ring(r * 0.78, r)} color={d.trim} depth={0.05} position={[0, wy, z]} />
        <Cut shape={S.circle(r * 0.8)} color="goldLight" depth={0.02} position={[0, wy, z * 0.4]} opts={{ emissive: "goldLight", emissiveIntensity: 0.25 }} />
        <Cut shape={S.rectC(0.09, r * 1.6)} color={d.trim} depth={0.03} position={[0, wy, z * 1.2]} />
        <Cut shape={S.rectC(r * 1.6, 0.09)} color={d.trim} depth={0.03} position={[0, wy, z * 1.2]} />
        <Cut shape={S.rect(lw * 0.6, Math.max(0.5, wy - r - 1.0), 0.1)} color={d.trim} depth={0.04} position={[0, 0.45, z]} />
      </>
    );
  }
  // planks
  const n = Math.max(3, Math.round(lw / 0.55));
  return (
    <>
      {Array.from({ length: n - 1 }, (_, i) => (
        <Cut key={i} shape={S.rect(0.06, lh - (d.kind === "rect" ? 0.3 : lw * 0.45))} color={d.trim} depth={0.03} position={[-lw / 2 + ((i + 1) * lw) / n, 0.15, z]} />
      ))}
      <Cut shape={S.rectC(lw * 0.92, 0.22, 0.06)} color={d.trim} depth={0.04} position={[0, lh * 0.25, z * 1.1]} />
      <Cut shape={S.rectC(lw * 0.92, 0.22, 0.06)} color={d.trim} depth={0.04} position={[0, lh * 0.62, z * 1.1]} />
    </>
  );
};

export const PaperDoor: React.FC<{
  d: DoorSpec;
  /** 0 closed → 1 fully open. */
  open?: number;
  bifold?: boolean;
  hinge?: "left" | "right";
  showLeaf?: boolean;
  /** Draw the reveal lining (off for doors pasted flat on a wall). */
  lining?: boolean;
  /** Draw the frame (off when a second leaf-only door overlays a frame drawn elsewhere). */
  showFrame?: boolean;
  position?: V3;
  yaw?: number;
}> = ({ d, open = 0, bifold = false, hinge = "left", showLeaf = true, lining = true, showFrame = true, position, yaw = 0 }) => {
  const b = d.border ?? 0.55;
  const reveal = d.reveal ?? 0.8;
  const outer = d.outer ?? d.kind;
  const ow = d.w + 2 * b;
  const oh = d.h + SILL + b;
  const lw = d.w - 0.1;
  const lh = d.h - 0.08;
  const hs = hinge === "left" ? 1 : -1;
  const hx = -hs * (d.w / 2 - 0.02);
  const leafZ = 0.06;

  const leafBody = (w: number, shape: ShapeSpec, xOff: number) => (
    <group position={[xOff, 0, 0]}>
      <Cut shape={shape} color={d.leaf} depth={0.1} />
      {w === lw ? (
        <>
          <LeafDetail d={d} lw={lw} lh={lh} side={1} />
          <LeafDetail d={d} lw={lw} lh={lh} side={-1} />
        </>
      ) : null}
    </group>
  );

  let leaf: React.ReactNode = null;
  if (showLeaf) {
    const leafShape = S.outline(d.kind, lw, lh);
    if (!bifold) {
      const a = -hs * open * 1.8;
      const kx = hs * (lw / 2 - 0.4);
      leaf = (
        <Hinge at={[hx, 0, leafZ]} axis="y" angle={a}>
          <group position={[0, SILL + 0.02, leafZ]}>
            {leafBody(lw, leafShape, 0)}
            <Cut shape={knobRose} color={d.knob ?? "gold"} depth={0.05} position={[kx, lh * 0.45, 0.08]} />
            <Cut shape={knobShape} color={d.knob ?? "gold"} depth={0.22} position={[kx, lh * 0.45, 0.16]} />
            <Cut shape={knobShape} color={d.knob ?? "gold"} depth={0.22} position={[kx, lh * 0.45, -0.16]} />
          </group>
        </Hinge>
      );
    } else {
      // Two half-panels: the leaf outline split down the middle by clipping shapes in half.
      const half = lw / 2;
      const th = open * 1.45;
      // Halves of the leaf outline: walk the outline, keep one side, close along x = 0.
      const halfShape = (sign: 1 | -1) =>
        S.path(`bifold${sign}-${d.kind}-${lw}-${lh}`, (s) => {
          const pts = S.outline(d.kind, lw, lh).make().getPoints(64).filter((p) => sign * p.x > 0.0001 && p.y > 0.0001);
          if (sign > 0) pts.reverse();
          s.moveTo(0, 0);
          s.lineTo(0, lh);
          for (const p of pts) s.lineTo(p.x, p.y);
          s.lineTo(sign * half, 0);
          s.closePath();
        });
      const left = halfShape(-1);
      const right = halfShape(1);
      // inner panel hinged at the frame, outer panel creased to it: a folding screen
      const inner = hs > 0 ? left : right;
      const outerP = hs > 0 ? right : left;
      const innerOff = hs * half; // centre of the inner panel → its own hinge at the frame edge
      leaf = (
        <Hinge at={[hx, 0, leafZ]} axis="y" angle={-hs * th}>
          <group position={[hx + innerOff, SILL + 0.02, leafZ]}>
            <Cut shape={inner} color={d.leaf} depth={0.08} />
            <Cut shape={S.rect(half * 0.62, lh * 0.36, 0.1)} color={d.trim} depth={0.03} position={[0, lh * 0.12, 0.05]} />
            <Cut shape={S.rect(half * 0.62, lh * 0.36, 0.1)} color={d.trim} depth={0.03} position={[0, lh * 0.12, -0.05]} />
          </group>
          <Hinge at={[hx + hs * half, 0, leafZ]} axis="y" angle={hs * 2 * th}>
            <group position={[hx + hs * half, SILL + 0.02, leafZ]}>
              <Cut shape={outerP} color={d.leaf} depth={0.08} />
              <Cut shape={S.rect(half * 0.62, lh * 0.36, 0.1)} color={d.trim} depth={0.03} position={[0, lh * 0.12, 0.05]} />
              <Cut shape={S.rect(half * 0.62, lh * 0.36, 0.1)} color={d.trim} depth={0.03} position={[0, lh * 0.12, -0.05]} />
              <Cut shape={knobShape} color={d.knob ?? "gold"} depth={0.22} position={[hs * (half * 0.5 - 0.1), lh * 0.45, 0.15]} />
            </group>
          </Hinge>
        </Hinge>
      );
    }
  }

  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {showFrame ? (
        <>
          {/* frame face */}
          <Cut shape={S.frame(outer, ow, oh, d.kind, d.w, d.h, SILL)} color={d.frame} depth={0.22} position={[0, 0, 0.11]} />
          {/* inner bead: a second, thinner frame in the trim colour */}
          <Cut shape={S.frame(d.kind, d.w + 0.32, d.h + SILL + 0.16, d.kind, d.w, d.h, SILL)} color={d.trim} depth={0.08} position={[0, 0, 0.26]} />
          {lining ? <Cut shape={S.frame(d.kind, d.w + 0.12, d.h + SILL + 0.06, d.kind, d.w, d.h, SILL)} color={d.frame} depth={reveal} position={[0, 0, -reveal / 2]} /> : null}
        </>
      ) : null}
      {showFrame && d.crest ? (
        <Cut shape={S.outline("arch", ow * 0.62, ow * 0.31 + 0.2)} color={d.crest} depth={0.3} position={[0, oh - (outer === "rect" ? 0.05 : ow * 0.12), 0.0]} />
      ) : null}
      {leaf}
    </group>
  );
};
