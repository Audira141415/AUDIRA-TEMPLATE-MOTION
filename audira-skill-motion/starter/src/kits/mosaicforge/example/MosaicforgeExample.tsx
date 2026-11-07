import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { TesseraeField3D } from "../scene/TesseraeField3D";
import { MosaicHall3D } from "../scene/MosaicHall3D";
import { getMosaicCamera } from "../camera/rig";
import { MosaicforgeOverlay } from "../camera/Overlay";
import { MosaicCameraRig, MosaicPost } from "../lib/post";

export const MOSAICFORGE_EXAMPLE_SECONDS = 12;

/**
 * MOSAICFORGE example (Style #60): thousands of tesserae rain down and settle into an original sun-bird.
 * Hook: tiles clatter past a lens skimming the grout bed. Development: the settling wave runs ahead of
 * the low glide. Payoff (~9–11 s): the camera rises overhead and the whole picture reads at once.
 */
export const MosaicforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const shot = getMosaicCamera(t);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#2A1D14" }}>
      <ThreeCanvas width={width} height={height} dpr={1} camera={{ position: shot.pos, fov: shot.fov, near: 0.03, far: 80 }}>
        <MosaicCameraRig shot={shot} near={0.03} far={80} />
        <MosaicHall3D t={t} />
        <TesseraeField3D t={t} />
        <MosaicPost frame={frame} strength={0.22} radius={0.35} threshold={0.95} vignette={0.4} grain={0.022} />
      </ThreeCanvas>
      <MosaicforgeOverlay t={t} />
    </div>
  );
};
