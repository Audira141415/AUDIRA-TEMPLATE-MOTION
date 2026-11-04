// The two primitives every PAPERWORLD object is built from:
//   <Cut>   — one piece of cardstock: an extruded silhouette with a dyed face and a pale cut edge.
//   <Hinge> — a crease: children rotate about a line through `at` (PaperFold).
//   <PopUp> — the pop-up-book special case: a piece lying flat that stands up about its base.

import React from "react";
import { Matrix4, type BufferGeometry } from "three";
import { extrude, flat, type ShapeSpec } from "../geometry/shapes.ts";
import { paperEdge, paperFace, type PaperOpts } from "../material/paper.ts";
import { PAPER } from "../tokens.ts";

export type V3 = [number, number, number];

export type CutProps = {
  shape: ShapeSpec;
  color: string;
  /** Cut-edge colour; defaults to the pale core of `color`. */
  edge?: string;
  depth?: number;
  opts?: PaperOpts;
  position?: V3;
  rotation?: V3;
  scale?: number | V3;
  cast?: boolean;
  receive?: boolean;
  visible?: boolean;
  segments?: number;
  renderOrder?: number;
};

export const Cut: React.FC<CutProps> = ({
  shape,
  color,
  edge,
  depth = PAPER.card,
  opts = {},
  position,
  rotation,
  scale,
  cast = true,
  receive = true,
  visible = true,
  segments,
  renderOrder,
}) => (
  <mesh
    geometry={extrude(shape, depth, segments)}
    material={[paperFace(color, opts), edge ? paperFace(edge, { ...opts, relief: 0.4 }) : paperEdge(color, opts)]}
    position={position}
    rotation={rotation}
    scale={scale}
    castShadow={cast}
    receiveShadow={receive}
    visible={visible}
    renderOrder={renderOrder}
  />
);

/** Zero-thickness print on a face (ink, printed UI): no shadow casting, sits on the surface. */
export const Print: React.FC<{ shape: ShapeSpec; color: string; position?: V3; rotation?: V3; scale?: number | V3; opts?: PaperOpts }> = ({
  shape,
  color,
  position,
  rotation,
  scale,
  opts,
}) => (
  <mesh geometry={flat(shape) as BufferGeometry} material={paperFace(color, opts)} position={position} rotation={rotation} scale={scale} receiveShadow />
);

type Axis = "x" | "y" | "z";
const rot = (axis: Axis, a: number): V3 => (axis === "x" ? [a, 0, 0] : axis === "y" ? [0, a, 0] : [0, 0, a]);

/** PaperFold: rotate children by `angle` about the crease line through `at` along `axis`. */
export const Hinge: React.FC<{ at: V3; axis: Axis; angle: number; children: React.ReactNode }> = ({ at, axis, angle, children }) => (
  <group position={at} rotation={rot(axis, angle)}>
    <group position={[-at[0], -at[1], -at[2]]}>{children}</group>
  </group>
);

/**
 * Pop-up piece: children are authored standing up (front facing +z, base on y = 0).
 * t = 0 lies flat on its back (folded away from the viewer), t = 1 stands upright.
 * Values slightly above 1 (from popEase) lean a touch forward, then settle.
 */
export const PopUp: React.FC<{ t: number; position?: V3; yaw?: number; children: React.ReactNode; hideFlat?: boolean }> = ({
  t,
  position,
  yaw = 0,
  children,
  hideFlat = false,
}) => (
  <group position={position} rotation={[0, yaw, 0]} visible={!(hideFlat && t <= 0.001)}>
    <group rotation={[(-Math.PI / 2) * (1 - t), 0, 0]}>{children}</group>
  </group>
);

/**
 * Parallel-fold pop-up (the "box" mechanism of pop-up books): front and back faces rotate
 * rigidly about their base lines while the sides shear, so a 3-D box folds perfectly flat
 * backwards (away from the viewer) at t = 0 and stands square at t = 1.
 */
export const ShearPop: React.FC<{ t: number; position?: V3; yaw?: number; children: React.ReactNode; visible?: boolean }> = ({
  t,
  position,
  yaw = 0,
  children,
  visible = true,
}) => {
  const th = Math.max(0.018, t) * (Math.PI / 2);
  const m = new Matrix4().set(1, 0, 0, 0, 0, Math.sin(th), 0, 0, 0, -Math.cos(th), 1, 0, 0, 0, 0, 1);
  return (
    <group position={position} rotation={[0, yaw, 0]} visible={visible}>
      <group matrix={m} matrixAutoUpdate={false}>
        {children}
      </group>
    </group>
  );
};
