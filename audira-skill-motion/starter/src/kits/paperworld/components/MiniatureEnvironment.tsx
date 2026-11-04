// MiniatureEnvironment — the small handmade things that make a set feel inhabited.
// Trees and bushes use cross-slot construction (two cut-outs slotted at 90°), so they hold
// their silhouette from every camera angle. Clouds and stars hang on visible threads.

import React from "react";
import { S } from "../geometry/shapes.ts";
import { Cut, ShearPop, type V3 } from "./Paper.tsx";
import { paperFace } from "../material/paper.ts";

const thread = paperFace("ivoryShade", { relief: 0.2 });

/** Visible cotton thread from y0 up to y1 (a hanging prop's string). */
export const Thread: React.FC<{ position: V3; length: number; radius?: number }> = ({ position, length, radius = 0.03 }) => (
  <mesh position={[position[0], position[1] + length / 2, position[2]]} material={thread} castShadow>
    <cylinderGeometry args={[radius, radius, length, 5]} />
  </mesh>
);

/** Ground plane: one huge sheet of cardstock (top face at y = 0). */
export const Ground: React.FC<{ color: string; size?: number; position?: V3 }> = ({ color, size = 600, position = [0, 0, 0] }) => (
  <Cut shape={S.rectC(size, size)} color={color} depth={0.6} position={[position[0], position[1] - 0.3, position[2]]} rotation={[-Math.PI / 2, 0, 0]} cast={false} />
);

/** Flat print lying on the ground (roads, plazas, rugs). Sits 0.02 above the sheet. */
export const GroundPrint: React.FC<{ shape: Parameters<typeof Cut>[0]["shape"]; color: string; position: V3; yaw?: number; lift?: number }> = ({
  shape,
  color,
  position,
  yaw = 0,
  lift = 0.02,
}) => (
  <group position={[position[0], position[1] + lift, position[2]]} rotation={[0, yaw, 0]}>
    <Cut shape={shape} color={color} depth={0.04} rotation={[-Math.PI / 2, 0, 0]} cast={false} />
  </group>
);

export type TreeKind = "round" | "cone" | "cloud";
export const PaperTree: React.FC<{ kind?: TreeKind; h?: number; color?: string; trunk?: string; t?: number; position?: V3; yaw?: number }> = ({
  kind = "round",
  h = 5,
  color = "mint",
  trunk = "brown",
  t = 1,
  position,
  yaw = 0,
}) => {
  const trunkH = h * 0.42;
  const crown =
    kind === "cone"
      ? S.poly(`cone-${h}`, [[-h * 0.32, trunkH * 0.75], [h * 0.32, trunkH * 0.75], [0, h]])
      : kind === "cloud"
        ? S.path(`treecloud-${h}`, (s) => {
            const r = h * 0.3;
            s.absarc(0, h - r * 1.05, r, 0, Math.PI * 2, false);
          })
        : S.path(`treeround-${h}`, (s) => {
            const r = h * 0.29;
            s.absarc(0, h - r, r, 0, Math.PI * 2, false);
          });
  const lobe = S.circle(h * 0.16);
  return (
    <ShearPop t={t} position={position} yaw={yaw}>
      {[0, Math.PI / 2].map((a) => (
        <group key={a} rotation={[0, a, 0]}>
          <Cut shape={S.rect(0.32, trunkH + 0.4, 0.05)} color={trunk} depth={0.08} />
          <Cut shape={crown} color={color} depth={0.08} />
          {kind === "cloud" ? (
            <>
              <Cut shape={lobe} color={color} depth={0.08} position={[-h * 0.2, h * 0.58, 0]} />
              <Cut shape={lobe} color={color} depth={0.08} position={[h * 0.21, h * 0.62, 0]} />
            </>
          ) : null}
        </group>
      ))}
    </ShearPop>
  );
};

export const PaperBush: React.FC<{ w?: number; color?: string; t?: number; position?: V3; yaw?: number }> = ({ w = 2.4, color = "mintDeep", t = 1, position, yaw = 0 }) => (
  <ShearPop t={t} position={position} yaw={yaw}>
    {[0, Math.PI / 2].map((a) => (
      <group key={a} rotation={[0, a, 0]}>
        <Cut shape={S.cloud(w, w * 0.62, 3)} color={color} depth={0.08} />
      </group>
    ))}
  </ShearPop>
);

/** Cloud hung on a thread from the "fly loft" above the set. */
export const PaperCloud: React.FC<{ w?: number; color?: string; position: V3; threadTo?: number; sway?: number }> = ({
  w = 8,
  color = "ivoryLight",
  position,
  threadTo = 60,
  sway = 0,
}) => (
  <group position={position} rotation={[0, 0, sway]}>
    <Cut shape={S.cloud(w, w * 0.45, 4)} color={color} depth={0.14} />
    <Cut shape={S.cloud(w * 0.72, w * 0.32, 3)} color="ivoryShade" depth={0.1} position={[w * 0.1, 0, -0.35]} />
    <Thread position={[-w * 0.22, w * 0.3, 0]} length={threadTo} />
    <Thread position={[w * 0.24, w * 0.28, 0]} length={threadTo} />
  </group>
);

export const PaperLamp: React.FC<{ h?: number; t?: number; position?: V3; glow?: number }> = ({ h = 5, t = 1, position, glow = 0.3 }) => (
  <ShearPop t={t} position={position}>
    <Cut shape={S.rect(0.18, h, 0.05)} color="brownDeep" depth={0.18} />
    <Cut shape={S.rectC(0.9, 0.16, 0.05)} color="brownDeep" depth={0.3} position={[0, h, 0]} />
    <Cut shape={S.circle(0.42)} color="goldLight" depth={0.3} position={[0, h + 0.45, 0]} opts={{ emissive: "goldLight", emissiveIntensity: glow }} />
    <Cut shape={S.outline("arch", 0.7, 0.4)} color="brownDeep" depth={0.32} position={[0, h + 0.8, 0]} />
  </ShearPop>
);

/** Rolling layered hill (a cut silhouette with optional little houses on its crest). */
export const PaperHill: React.FC<{ w: number; h: number; color: string; position: V3; skew?: number; t?: number; yaw?: number }> = ({ w, h, color, position, skew = 0, t = 1, yaw = 0 }) => (
  <ShearPop t={t} position={position} yaw={yaw}>
    <Cut shape={S.hill(w, h, 0.4, skew)} color={color} depth={0.2} />
  </ShearPop>
);
