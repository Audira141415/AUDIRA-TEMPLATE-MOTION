import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ArabesqueGirihPortal3D } from "../scene/ArabesqueGirihPortal3D";
import { MosqueSilhouetteSkyline3D } from "../scene/MosqueSilhouetteSkyline3D";
import { getIslamicDocumentaryCamera } from "../camera/rig";
import { IslamicDocumentaryOverlay } from "../camera/Overlay";

export const ISLAMICDOCUMENTARY_EXAMPLE_SECONDS = 12;

export const IslamicDocumentaryExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * 60;

  const cam = getIslamicDocumentaryCamera(f);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#142032" }}>
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

        <ArabesqueGirihPortal3D f={f} />
        <MosqueSilhouetteSkyline3D f={f} />
      </ThreeCanvas>

      <IslamicDocumentaryOverlay f={f} />
    </div>
  );
};
