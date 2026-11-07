import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { PoolRoom3D } from "../scene/PoolRoom3D";
import { DreamVista3D } from "../scene/DreamVista3D";
import { getDreamCamera } from "../camera/rig";
import { DreamcoreOverlay } from "../camera/Overlay";
import { DreamCameraRig, DreamPost } from "../lib/post";
import { smooth } from "../core/motion";

export const DREAMCORE_EXAMPLE_SECONDS = 12;

/**
 * DREAMCORE example (Style #64): a pastel pool room with clouds under its tiled ceiling.
 * Hook: a door standing in the water opens by itself and sky light spills out. Development: the
 * camera floats down the room and through a great arch. Payoff (~9–11 s): outside, stairs rise out
 * of endless water into the sky, and the door at the top lights up.
 */
export const DreamcoreExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const shot = getDreamCamera(t);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#F6D9EE" }}>
      <ThreeCanvas width={width} height={height} dpr={1} camera={{ position: shot.pos, fov: shot.fov, near: 0.05, far: 200 }}>
        <DreamCameraRig shot={shot} near={0.05} far={200} />
        <DreamVista3D t={t} />
        <PoolRoom3D t={t} />
        <DreamPost frame={frame} strength={0.25 + smooth(8.5, 10.5, t) * 0.2} radius={0.5} threshold={0.95} vignette={0.32} grain={0.03} />
      </ThreeCanvas>
      <DreamcoreOverlay t={t} />
    </div>
  );
};
