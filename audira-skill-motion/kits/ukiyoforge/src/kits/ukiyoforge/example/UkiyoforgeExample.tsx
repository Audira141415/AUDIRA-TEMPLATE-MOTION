import React, { useLayoutEffect } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { PrintLayers3D } from "../scene/PrintLayers3D";
import { GreatCrest3D } from "../scene/GreatCrest3D";
import { getUkiyoCamera } from "../camera/rig";
import { UkiyoOverlay } from "../camera/Overlay";
import { UKIYO_PALETTE as P } from "../lib/palette";

export const UKIYOFORGE_EXAMPLE_SECONDS = 12;

const CameraDriver: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const cam = getUkiyoCamera(f);
    const c = camera as THREE.PerspectiveCamera;
    c.position.set(...cam.position);
    c.fov = cam.fov;
    c.lookAt(...cam.target);
    c.updateProjectionMatrix();
  }, [camera, f]);
  return null;
};

export const UkiyoforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * 60;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: P.backdrop }}>
      <ThreeCanvas
        width={width}
        height={height}
        shadows={{ type: THREE.PCFSoftShadowMap }}
        gl={{ toneMapping: THREE.NoToneMapping }}
        camera={{ position: [1.5, -1.7, 2.9], fov: 58, near: 0.05, far: 60 }}
      >
        <CameraDriver f={f} />
        <color attach="background" args={[P.prussianDeep]} />
        {/* soft studio light over paper: flat print colours stay true (no tone mapping) */}
        <ambientLight intensity={1.55} color="#FFF6E6" />
        <directionalLight
          position={[-3, 4, 12]}
          intensity={1.1}
          color="#FFF1DA"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0006}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={14}
          shadow-camera-bottom={-14}
          shadow-camera-near={1}
          shadow-camera-far={40}
        />
        <PrintLayers3D f={f} />
        <GreatCrest3D f={f} />
      </ThreeCanvas>
      <UkiyoOverlay f={f} />
    </div>
  );
};
