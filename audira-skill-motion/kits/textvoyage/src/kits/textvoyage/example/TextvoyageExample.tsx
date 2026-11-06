import React, { useLayoutEffect } from "react";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { TEXTVOYAGE_PALETTE } from "../lib/palette";
import { MonolithGateway as ObjectStage } from "../world/ObjectStage";
import { TextvoyageOverlay } from "../camera/Overlay";
import { getCameraPose } from "../camera/rig";

export const TEXTVOYAGE_EXAMPLE_SECONDS = 8;
const FILM_FPS = 60;

const CameraRig: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  const pose = getCameraPose(f, TEXTVOYAGE_EXAMPLE_SECONDS * FILM_FPS);

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pose.position);
    cam.lookAt(new THREE.Vector3(...pose.target));
    cam.fov = pose.fov;
    cam.updateProjectionMatrix();
  }, [camera, pose]);

  return null;
};

/** Static reflection environment: the titanium and gold monoliths are metallic and read black without one. */
const Reflections: React.FC = () => {
  const { gl, scene } = useThree();
  useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const rt = pm.fromScene(room, 0.04);
    scene.environment = rt.texture;
    scene.environmentIntensity = 0.55;
    return () => {
      scene.environment = null;
      rt.dispose();
      room.dispose();
      pm.dispose();
    };
  }, [gl, scene]);
  return null;
};

export const TextvoyageExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * FILM_FPS;

  return (
    <AbsoluteFill style={{ backgroundColor: TEXTVOYAGE_PALETTE.abyssBlack }}>
      <ThreeCanvas
        width={width}
        height={height}
        dpr={1}
        camera={{ fov: 34, position: [0, 2, 4.5] }}
      >
        <CameraRig f={f} />
        <Reflections />
        <fog attach="fog" args={[TEXTVOYAGE_PALETTE.abyssBlack, 10, 46]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} />
        <pointLight position={[0, 3, -12]} color={TEXTVOYAGE_PALETTE.coreAccentGold} intensity={40} distance={30} />
        <ObjectStage f={f} />
      </ThreeCanvas>
      <TextvoyageOverlay f={f} />
    </AbsoluteFill>
  );
};
