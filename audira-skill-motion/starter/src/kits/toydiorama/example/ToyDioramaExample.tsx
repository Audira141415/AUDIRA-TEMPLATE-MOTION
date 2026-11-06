import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { TheaterStage3D } from "../diorama/TheaterStage3D";
import { ToyCharacter3D } from "../diorama/ToyCharacter3D";
import { PaperLabel3D } from "../diorama/PaperLabel3D";
import { getToyDioramaCamera } from "../camera/rig";
import { ToyDioramaOverlay } from "../camera/Overlay";
import { TOYDIORAMA_PALETTE } from "../lib/palette";

export const TOYDIORAMA_EXAMPLE_SECONDS = 12;

export const ToyDioramaExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * 60; // 60fps normalized frame

  const cam = getToyDioramaCamera();

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#0E141D" }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{
          position: cam.position,
          fov: cam.fov,
          near: 0.1,
          far: 50,
        }}
        onCreated={({ scene, camera }) => {
          camera.lookAt(cam.target[0], cam.target[1], cam.target[2]);
        }}
      >
        {/* Soft Ambient Fill */}
        <ambientLight intensity={0.45} color="#F5E8D3" />

        {/* Warm Cinematic 3200K Key Spotlight */}
        <spotLight
          position={[3.2, 5.5, 4.2]}
          intensity={2.4}
          angle={0.65}
          penumbra={0.7}
          color={TOYDIORAMA_PALETTE.keyLight}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />

        {/* Subtle Cool Rim Light (Edge Separation from Dark Backdrop) */}
        <directionalLight
          position={[-3.5, 4.2, -3.0]}
          intensity={0.9}
          color={TOYDIORAMA_PALETTE.rimLight}
        />

        {/* Miniature Theatrical Stage */}
        <TheaterStage3D f={f} />

        {/* Stylized Blocky Toy Character */}
        <ToyCharacter3D f={f} />

        {/* Pinned Taped Paper Annotation */}
        <PaperLabel3D f={f} />
      </ThreeCanvas>

      {/* Bold Editorial Graphic Overlay */}
      <ToyDioramaOverlay f={f} />
    </div>
  );
};
