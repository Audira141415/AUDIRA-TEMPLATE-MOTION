import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { WaterColumn3D } from "../scene/WaterColumn3D";
import { Jellyfish3D } from "../scene/Jellyfish3D";
import { Lanternmaw3D } from "../scene/Lanternmaw3D";
import { getAbyssCamera } from "../camera/rig";
import { AbyssforgeOverlay } from "../camera/Overlay";
import { AbyssCameraRig, AbyssPost } from "../lib/post";
import { smooth } from "../core/motion";

export const ABYSSFORGE_EXAMPLE_SECONDS = 12;

/**
 * ABYSSFORGE example (Style #52): a slow descent from the twilight zone into the midnight zone.
 * Hook: a cyan jelly pulses in the last god-rays. Development: the light dies, life lights itself.
 * Payoff (~9–11 s): a lure flickers on in the dark and reveals the lanternmaw waiting below.
 */
export const AbyssforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const shot = getAbyssCamera(t);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#020A14" }}>
      <ThreeCanvas width={width} height={height} dpr={1} camera={{ position: shot.pos, fov: shot.fov, near: 0.05, far: 200 }}>
        <AbyssCameraRig shot={shot} />
        <WaterColumn3D t={t} />
        <Jellyfish3D t={t} />
        <Lanternmaw3D t={t} />
        <AbyssPost frame={frame} strength={0.8 + smooth(9, 10.5, t) * 0.1} radius={0.5} threshold={0.78} vignette={0.42} grain={0.03} />
      </ThreeCanvas>
      <AbyssforgeOverlay t={t} />
    </div>
  );
};
