// BUILDFORGE technical example — a garden pavilion assembled piece by piece in true 3D (10 s at any fps).
// World, construction clock, camera rig, finishing chain and stage labels, all from src/kits/buildforge.
// It is a technical check and a starting point, not a story: never reuse it as a buyer's film.

import React, { useLayoutEffect, useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { PCFShadowMap } from "three";
import { FONT } from "../../../core/type/fonts.ts";
import { shotAt } from "../camera/director.ts";
import { StageLabel } from "../labels/StageLabel.tsx";
import { CameraRig, Post } from "../render/Post.tsx";
import { createWorld, sunLook } from "../world/createWorld.ts";
import { SITE, pavilionComponents } from "./pavilion.ts";
import { CLOCK, EXAMPLE_SECONDS, LENS, RIG, STAGES_S, WINDOWS, terrainAt } from "./sequence.ts";

export const BUILDFORGE_EXAMPLE_SECONDS = EXAMPLE_SECONDS;

const SUN: [number, number, number] = [-0.55, 0.62, 0.56];
const DAYLIGHT = sunLook(SUN);

/** Trees already standing around the site: [x, z, height]. Keep the camera's final view clear. */
const WILD: [number, number, number][] = [
  [-11, -16, 8], [-2, -19, 9], [8, -17, 7.5], [16, -14, 8.5], [-19, -12, 7], [21, -2, 8], [-22, 3, 7.5], [24, 9, 9],
];

const World: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const { gl, scene } = useThree();
  const world = useMemo(
    () =>
      createWorld(gl, scene, {
        components: pavilionComponents(),
        windows: WINDOWS,
        site: SITE,
        terrainAt,
        trees: WILD,
        sunDir: SUN,
        shadowSize: 22,
      }),
    [gl, scene],
  );
  // construction clock: CLOCK units per second, whatever the render fps
  const c = (frame / fps) * CLOCK;
  useLayoutEffect(() => world.update(c, DAYLIGHT), [world, c]);
  const shot = useMemo(() => shotAt(RIG, c, LENS), [c]);
  return (
    <>
      <primitive object={world.root} />
      <CameraRig shot={shot} />
      <Post shot={shot} frame={frame} aoRadius={0.45} />
    </>
  );
};

export const BuildforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const stages = STAGES_S.map((s) => ({ ...s, from: Math.round(s.from * fps), to: Math.round(s.to * fps) }));
  return (
    <AbsoluteFill style={{ backgroundColor: "#e8eef0" }}>
      <ThreeCanvas width={width} height={height} shadows={{ type: PCFShadowMap }} dpr={1}
        gl={{ antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" }}
        camera={{ fov: 36, near: 0.4, far: 2500, position: [0, 10, 40] }}>
        <World frame={frame} fps={fps} />
      </ThreeCanvas>
      <StageLabel stages={stages} frame={frame} fps={fps} width={width} font={FONT} ink="#22292c" soft="#5f6b70" accent="#1fae95" />
    </AbsoluteFill>
  );
};
