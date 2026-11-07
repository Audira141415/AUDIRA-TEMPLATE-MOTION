import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { MarbleBust3D } from "../scene/MarbleBust3D";
import { Gallery3D } from "../scene/Gallery3D";
import { getMarbleCamera } from "../camera/rig";
import { MarblemuseumOverlay } from "../camera/Overlay";
import { MarbleCameraRig, MarblePost } from "../lib/post";
import { smooth } from "../core/motion";

export const MARBLEMUSEUM_EXAMPLE_SECONDS = 12;

/**
 * MARBLEMUSEUM example (Style #61): an original Greco-Roman style bust in a classical gallery.
 * Hook: a hand's breadth from the carved eye, veins catching the skylight. Development: a slow
 * reverent orbit pulls back past fluted columns. Payoff (~9–11 s): the sun lands on the face,
 * the rim glows and the wall label card slides in.
 */
export const MarblemuseumExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const shot = getMarbleCamera(t);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#120807" }}>
      <ThreeCanvas width={width} height={height} dpr={1} camera={{ position: shot.pos, fov: shot.fov, near: 0.05, far: 60 }}>
        <MarbleCameraRig shot={shot} near={0.05} far={60} />
        <Gallery3D t={t} />
        <MarbleBust3D t={t} />
        <MarblePost frame={frame} strength={0.15 + smooth(8.4, 10.2, t) * 0.15} radius={0.5} threshold={0.95} vignette={0.45} grain={0.02} />
      </ThreeCanvas>
      <MarblemuseumOverlay t={t} />
    </div>
  );
};
