import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { NoirStreet3D } from "../scene/NoirStreet3D";
import { DetectiveSilhouette3D } from "../scene/DetectiveSilhouette3D";
import { getFilmNoirCamera } from "../camera/rig";
import { FilmNoirOverlay } from "../camera/Overlay";
import { FILMNOIR_PALETTE } from "../lib/palette";

export const FILMNOIR_EXAMPLE_SECONDS = 12;

export const FilmNoirExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * 60;

  const cam = getFilmNoirCamera(f);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#060709" }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{
          position: cam.position,
          fov: cam.fov,
          near: 0.1,
          far: 50,
        }}
        onCreated={({ camera }) => {
          camera.lookAt(cam.target[0], cam.target[1], cam.target[2]);
        }}
      >
        {/* Very low ambient light to preserve pitch black Chiaroscuro shadows */}
        <ambientLight intensity={0.06} color="#4A5568" />

        {/* Cold Blue Moonlight Rim Light from Above-Behind */}
        <directionalLight
          position={[-3.5, 6.5, -4.0]}
          intensity={1.2}
          color={FILMNOIR_PALETTE.rimLightCool}
        />

        {/* 3D Wet Alley Street Environment */}
        <NoirStreet3D f={f} />

        {/* Brooding Detective Silhouette */}
        <DetectiveSilhouette3D f={f} />
      </ThreeCanvas>

      {/* Cinematic Vintage Detective Overlay */}
      <FilmNoirOverlay f={f} />
    </div>
  );
};
