import React, { useLayoutEffect } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { KelirStage3D } from "../scene/KelirStage3D";
import { WayangPuppets3D } from "../scene/WayangPuppets3D";
import { getWayangCamera } from "../camera/rig";
import { WayangOverlay } from "../camera/Overlay";
import { WAYANG_PALETTE as P } from "../lib/palette";

export const WAYANGFORGE_EXAMPLE_SECONDS = 12;

const CameraDriver: React.FC<{ f: number }> = ({ f }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const cam = getWayangCamera(f);
    const c = camera as THREE.PerspectiveCamera;
    c.position.set(...cam.position);
    c.fov = cam.fov;
    c.lookAt(...cam.target);
    c.updateProjectionMatrix();
  }, [camera, f]);
  return null;
};

/** Neutral studio reflections so bronze gamelan and prada gold read as metal. */
const StudioEnv: React.FC = () => {
  const { gl, scene } = useThree();
  useLayoutEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.18;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
};

export const WayangforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * 60;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: P.hallIndigo }}>
      <ThreeCanvas width={width} height={height} camera={{ position: [0.4, 2.9, 2.6], fov: 30, near: 0.05, far: 60 }}>
        <CameraDriver f={f} />
        <StudioEnv />
        <color attach="background" args={[P.hallIndigo]} />
        <fog attach="fog" args={[P.hallIndigo, 7, 18]} />
        <ambientLight intensity={0.35} color="#4A3A6A" />
        <hemisphereLight args={["#3A3466", "#2A1608", 0.5]} />
        {/* cool rim from the audience side so puppet edges separate from the hall */}
        <directionalLight position={[2, 5, -6]} intensity={0.5} color="#7F8CC8" />
        <KelirStage3D f={f} />
        <WayangPuppets3D f={f} />
      </ThreeCanvas>
      <WayangOverlay f={f} />
    </div>
  );
};
