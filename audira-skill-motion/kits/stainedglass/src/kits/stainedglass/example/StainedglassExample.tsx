import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { LeadlightWindow3D } from "../scene/LeadlightWindow3D";
import { Nave3D } from "../scene/Nave3D";
import { getStainedCamera } from "../camera/rig";
import { StainedglassOverlay } from "../camera/Overlay";
import { StainedCameraRig, StainedPost } from "../lib/post";
import { smooth } from "../core/motion";

export const STAINEDGLASS_EXAMPLE_SECONDS = 12;

/**
 * STAINEDGLASS example (Style #58): a leadlight lancet window assembles pane by pane.
 * Hook: the rose window's golden heart and ruby petals fly into their lead. Development: quarries
 * seat top-down into an original scene (sky, fruiting tree, hills, river) as the camera pulls back.
 * Payoff (~9–11 s): the sun flares through the finished window and paints jewel light on the stone floor.
 */
export const StainedglassExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const shot = getStainedCamera(t);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#0E0B08" }}>
      <ThreeCanvas width={width} height={height} dpr={1} camera={{ position: shot.pos, fov: shot.fov, near: 0.05, far: 80 }}>
        <color attach="background" args={["#0E0B08"]} />
        <StainedCameraRig shot={shot} />
        <Nave3D t={t} />
        <LeadlightWindow3D t={t} />
        <StainedPost frame={frame} strength={0.55 + smooth(8.8, 10.4, t) * 0.35} radius={0.5} threshold={0.82} vignette={0.45} grain={0.025} />
      </ThreeCanvas>
      <StainedglassOverlay t={t} />
    </div>
  );
};
