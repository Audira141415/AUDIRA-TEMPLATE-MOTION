import React, { useLayoutEffect } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { computeComicState } from "../core/motion";
import { ComicCameraConfig, getComicCamera } from "../camera/rig";
import { ComicforgeOverlay } from "../camera/Overlay";
import { CityPanels3D } from "../scene/CityPanels3D";
import { Hero3D } from "../scene/Hero3D";
import { Impact3D } from "../scene/Impact3D";
import { useComicMats } from "../scene/Ink";
import { COMIC_PALETTE } from "../lib/palette";

export const COMICFORGE_EXAMPLE_SECONDS = 12;

const CameraRig: React.FC<{ cam: ComicCameraConfig }> = ({ cam }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.position.set(...cam.position);
    c.up.set(Math.sin(cam.roll), Math.cos(cam.roll), 0);
    c.lookAt(...cam.target);
    c.fov = cam.fov;
    c.near = 0.1;
    c.far = 120;
    c.updateProjectionMatrix();
    c.updateMatrixWorld();
  }, [camera, cam]);
  return null;
};

const Scene: React.FC<{ f: number; dotPx: number }> = ({ f, dotPx }) => {
  const mats = useComicMats(dotPx);
  const s = computeComicState(f);
  const cam = getComicCamera(s);
  return (
    <>
      <CameraRig cam={cam} />
      <CityPanels3D mats={mats} />
      <Hero3D s={s} mats={mats} />
      <Impact3D s={s} mats={mats} cam={cam.position} />
    </>
  );
};

export const ComicforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * 60;
  // Ben-Day dot cell scales with output height so preview and final print the same screen
  const dotPx = Math.max(4, Math.round((11 * height) / 1920));
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: COMIC_PALETTE.skyTop }}>
      <ThreeCanvas width={width} height={height} camera={{ position: [0, 2.5, 34], fov: 40, near: 0.1, far: 120 }} gl={{ antialias: true }}>
        <Scene f={f} dotPx={dotPx} />
      </ThreeCanvas>
      <ComicforgeOverlay f={f} width={width} height={height} />
    </div>
  );
};
