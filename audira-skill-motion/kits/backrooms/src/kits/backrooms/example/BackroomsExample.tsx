import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { LiminalMaze3D } from "../scene/LiminalMaze3D";
import { FluorescentCeiling3D } from "../scene/FluorescentCeiling3D";
import { getBackroomsCamera } from "../camera/rig";
import { BackroomsOverlay } from "../camera/Overlay";

export const BACKROOMS_EXAMPLE_SECONDS = 12;

export const BackroomsExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * 60;

  const cam = getBackroomsCamera(f);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#0A0B09" }}>
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

        <LiminalMaze3D f={f} />
        <FluorescentCeiling3D f={f} />
      </ThreeCanvas>

      <BackroomsOverlay f={f} />
    </div>
  );
};
