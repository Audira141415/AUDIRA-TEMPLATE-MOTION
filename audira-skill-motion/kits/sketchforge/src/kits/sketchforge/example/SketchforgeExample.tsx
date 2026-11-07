import React, { useLayoutEffect } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { computeSketchState } from "../core/motion";
import { SketchCameraConfig, getSketchCamera } from "../camera/rig";
import { SketchforgeOverlay } from "../camera/Overlay";
import { SketchbookDesk3D, Pencil3D } from "../scene/SketchbookDesk3D";
import { FlatSketch, LiftWire, pencilTip, useStrokes } from "../scene/HouseSketch3D";
import { ChimneySmoke, HouseSolid3D } from "../scene/HouseSolid3D";
import { SKETCH_PALETTE } from "../lib/palette";

export const SKETCHFORGE_EXAMPLE_SECONDS = 12;

const CameraRig: React.FC<{ cam: SketchCameraConfig }> = ({ cam }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.position.set(...cam.position);
    c.lookAt(...cam.target);
    c.fov = cam.fov;
    c.near = 0.05;
    c.far = 80;
    c.updateProjectionMatrix();
    c.updateMatrixWorld();
  }, [camera, cam]);
  return null;
};

const Scene: React.FC<{ f: number }> = ({ f }) => {
  const s = computeSketchState(f);
  const strokes = useStrokes();
  const liftY = s.lift;
  const cam = getSketchCamera(f, liftY);
  return (
    <>
      <color attach="background" args={[SKETCH_PALETTE.desk]} />
      <CameraRig cam={cam} />
      <ambientLight intensity={0.75} color="#FFF4E6" />
      <hemisphereLight args={["#FFF6EA", "#3A3A40", 0.5]} />
      <directionalLight
        position={[4.5, 8, 5.5]}
        intensity={2.1}
        color="#FFF1DE"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0004}
      />
      {/* cool rim from behind-left so the lifted house separates from the dark desk */}
      <directionalLight position={[-5, 3.5, -4]} intensity={0.9} color="#DDE6FF" />
      <SketchbookDesk3D />
      <FlatSketch s={s} strokes={strokes} unit={1} />
      <Pencil3D s={s} tip={pencilTip(strokes, s.draw)} />
      <group position={[0, liftY, 0]} rotation={[0, s.spin, 0]}>
        <LiftWire s={s} strokes={strokes} unit={1} />
        <HouseSolid3D s={s} liftY={liftY} />
        <ChimneySmoke s={s} />
      </group>
    </>
  );
};

export const SketchforgeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = (frame / fps) * 60;
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: SKETCH_PALETTE.desk }}>
      <ThreeCanvas flat width={width} height={height} shadows={{ type: THREE.PCFSoftShadowMap }} camera={{ position: [0.9, 10.4, 5.4], fov: 36 }}>
        <Scene f={f} />
      </ThreeCanvas>
      <SketchforgeOverlay f={f} width={width} height={height} />
    </div>
  );
};
