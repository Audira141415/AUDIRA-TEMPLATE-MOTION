import React, { useLayoutEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { StudioSweep3D } from "../scene/StudioSweep3D";
import { SandSlice3D } from "../scene/SandSlice3D";
import { LiquidFill3D } from "../scene/LiquidFill3D";
import { ShapeDrop3D } from "../scene/ShapeDrop3D";
import { getSatisfyforgeCamera } from "../camera/rig";
import { SatisfyforgeOverlay } from "../camera/Overlay";
import { SATISFYFORGE_PALETTE as P } from "../lib/palette";

export const SATISFYFORGE_EXAMPLE_SECONDS = 12;

const CameraRig: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const cam = getSatisfyforgeCamera(f);
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.position.set(...cam.position);
    c.fov = cam.fov;
    c.lookAt(...cam.target);
    c.updateProjectionMatrix();
  });
  return null;
};

const StudioEnv: React.FC = () => {
  const { gl, scene } = useThree();
  const env = useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const rt = pm.fromScene(new RoomEnvironment(), 0.04);
    pm.dispose();
    return rt;
  }, [gl]);
  useLayoutEffect(() => {
    scene.environment = env.texture;
    scene.environmentIntensity = 0.3;
    scene.background = new THREE.Color(P.sweepWall);
  }, [scene, env]);
  return null;
};

export const SatisfyforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * 60;
  const t = f / 60;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: P.sweepWall }}>
      <ThreeCanvas width={width} height={height} shadows={{ type: THREE.VSMShadowMap }} camera={{ position: [0, 3, 4.3], fov: 38, near: 0.05, far: 60 }}>
        <CameraRig f={f} />
        <StudioEnv />
        <hemisphereLight args={[P.sky2, P.ground, 0.55]} />
        {/* big soft overhead softbox: blurred VSM shadows */}
        <directionalLight
          position={[1.5, 6, 3.5]}
          intensity={1.45}
          color={P.key}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-7}
          shadow-camera-right={7}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-radius={14}
          shadow-blurSamples={16}
          shadow-bias={-0.0006}
        />
        <directionalLight position={[-4, 2.5, 4]} intensity={0.45} color="#FFE7F0" />

        <StudioSweep3D t={t} />
        <SandSlice3D t={t} />
        <LiquidFill3D t={t} />
        <ShapeDrop3D t={t} />
      </ThreeCanvas>
      <SatisfyforgeOverlay f={f} />
    </div>
  );
};
