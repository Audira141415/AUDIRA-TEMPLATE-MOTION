import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { CartographicTerrain3D } from "../scene/CartographicTerrain3D";
import { TacticalPincerArrows3D } from "../scene/TacticalPincerArrows3D";
import { getHistoryMapCamera } from "../camera/rig";
import { HistoryMapOverlay } from "../camera/Overlay";

export const HISTORYMAP_EXAMPLE_SECONDS = 12;

export const HistoryMapExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * 60;

  const cam = getHistoryMapCamera(f);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#1B2028" }}>
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

        <CartographicTerrain3D f={f} />
        <TacticalPincerArrows3D f={f} />
      </ThreeCanvas>

      <HistoryMapOverlay f={f} />
    </div>
  );
};
