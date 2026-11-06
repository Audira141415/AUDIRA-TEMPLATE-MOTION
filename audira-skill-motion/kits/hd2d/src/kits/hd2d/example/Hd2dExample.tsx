import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { TimberTownDiorama3D } from "../scene/TimberTownDiorama3D";
import { PixelHeroBillboard3D } from "../scene/PixelHeroBillboard3D";
import { getHd2dCamera } from "../camera/rig";
import { Hd2dOverlay } from "../camera/Overlay";

export const HD2D_EXAMPLE_SECONDS = 12;

export const Hd2dExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * 60;

  const cam = getHd2dCamera(f);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#0B0E14" }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{
          position: cam.position,
          fov: cam.fov,
          near: 0.1,
          far: 60,
        }}
        onCreated={({ camera }) => {
          camera.lookAt(cam.target[0], cam.target[1], cam.target[2]);
        }}
      >
        <ambientLight intensity={0.45} color="#FFFFFF" />
        <directionalLight position={[4.5, 7.5, 5.0]} intensity={1.65} color="#FFF8E7" />
        <directionalLight position={[-4.0, 4.0, -3.5]} intensity={0.75} color="#90CAF9" />

        <TimberTownDiorama3D f={f} />
        <PixelHeroBillboard3D f={f} />
      </ThreeCanvas>

      <Hd2dOverlay f={f} />
    </div>
  );
};
