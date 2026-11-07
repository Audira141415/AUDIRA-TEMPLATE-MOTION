import React, { useLayoutEffect } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { computeArcadeState } from "../core/motion";
import { ArcadeCameraConfig, getArcadeCamera } from "../camera/rig";
import { ArcadecrtOverlay } from "../camera/Overlay";
import { ArcadeRoom3D } from "../scene/ArcadeRoom3D";
import { CrtCabinet3D } from "../scene/CrtCabinet3D";
import { PixelWorld3D } from "../scene/PixelWorld3D";
import { ARCADE_PALETTE } from "../lib/palette";

export const ARCADECRT_EXAMPLE_SECONDS = 12;

const CameraRig: React.FC<{ cam: ArcadeCameraConfig }> = ({ cam }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.position.set(...cam.position);
    c.up.set(Math.sin(cam.roll), Math.cos(cam.roll), 0);
    c.lookAt(...cam.target);
    c.fov = cam.fov;
    c.near = 0.02;
    c.far = 250;
    c.updateProjectionMatrix();
    c.updateMatrixWorld();
  }, [camera, cam]);
  return null;
};

const Scene: React.FC<{ f: number }> = ({ f }) => {
  const s = computeArcadeState(f);
  const cam = getArcadeCamera(s);
  return (
    <>
      <color attach="background" args={[s.inside ? "#06041A" : ARCADE_PALETTE.room]} />
      <CameraRig cam={cam} />
      {s.inside ? (
        <PixelWorld3D t={s.t} />
      ) : (
        <>
          <ambientLight intensity={0.18} color="#8A7CFF" />
          <spotLight position={[0, 5.5, 3]} angle={0.5} penumbra={0.8} intensity={14} color="#C9B8FF" distance={12} decay={2} castShadow />
          <ArcadeRoom3D t={s.t} />
          <CrtCabinet3D s={s} />
        </>
      )}
    </>
  );
};

export const ArcadecrtExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * 60;
  const s = computeArcadeState(f);
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: ARCADE_PALETTE.room }}>
      <ThreeCanvas width={width} height={height} shadows camera={{ position: [-1.7, 1.75, 4.9], fov: 40 }}>
        <Scene f={f} />
      </ThreeCanvas>
      <ArcadecrtOverlay s={s} width={width} height={height} />
    </div>
  );
};
