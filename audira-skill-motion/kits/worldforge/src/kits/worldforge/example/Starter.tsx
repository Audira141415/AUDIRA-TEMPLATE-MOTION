// WORLDFORGE starter composition — the reusability test: a non-Mars world (ancient hilltop
// citadel, Earth sky) built only from src/worldforge/ (Stage, Sky, heightfield, terrainMesh,
// surface, geo, track). 2 s, 540×960, 30 fps. Nothing here imports src/mars/.

import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Mesh, MeshStandardMaterial, PCFShadowMap } from "three";
import { Stage, type Look, type ShadowBox, type Shot } from "../Stage.tsx";
import { SkyDome, useSkyEnvironment, type SkyColors } from "../Sky.tsx";
import { gridGeometry } from "../terrainMesh.ts";
import { inside } from "../heightfield.ts";
import { makeTerrainMaterial } from "../surface.ts";
import { box, cyl } from "../geo.ts";
import { sample, type Key } from "../track.ts";
import { PLATEAU, STARTER_SUN, getStarterTerrain } from "./world.ts";

const SKY: SkyColors = { zenith: "#5f8fc6", horizon: "#cfdbe3", glow: "#fff0d2", halo: "#ffffff", ground: "#6b6450", sunDisk: 18 };

const Terrain: React.FC = React.memo(() => {
  const meshes = useMemo(() => {
    const t = getStarterTerrain();
    const { material } = makeTerrainMaterial();
    const near = new Mesh(gridGeometry(t.near), material);
    const ng = t.near.grid;
    const far = new Mesh(gridGeometry({ ...t.far, skip: (x0, z0, x1, z1) => inside(ng, x0, z0, 2) && inside(ng, x1, z1, 2) }), material);
    for (const m of [near, far]) m.receiveShadow = true;
    return [near, far];
  }, []);
  return (
    <>
      {meshes.map((m, i) => (
        <primitive key={i} object={m} />
      ))}
    </>
  );
});

const stone = new MeshStandardMaterial({ color: "#cdb68c", roughness: 0.88 });
const stoneDark = new MeshStandardMaterial({ color: "#a68f68", roughness: 0.9 });
const S = { castShadow: true, receiveShadow: true } as const;

/** A stepped temple, a colonnade ring and a scatter of houses on the plateau. */
const Citadel: React.FC = React.memo(() => {
  const y0 = getStarterTerrain().heightAt(PLATEAU.x, PLATEAU.z);
  const tiers = [40, 31, 23, 15];
  const houses = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const a = i * 2.39996, r = 46 + ((i * 37) % 23);
        return { x: PLATEAU.x + Math.cos(a) * r, z: PLATEAU.z + Math.sin(a) * r, w: 5 + (i % 4), d: 4 + ((i * 3) % 5), h: 3 + (i % 3), yaw: a };
      }),
    [],
  );
  return (
    <group position={[PLATEAU.x, y0, PLATEAU.z]}>
      {tiers.map((w, i) => (
        <mesh key={i} geometry={box(w, 5, w, 0.3)} material={i % 2 ? stoneDark : stone} position={[0, 2.5 + i * 5 - 0.4, 0]} {...S} />
      ))}
      <mesh geometry={box(8, 6, 8, 0.4)} material={stone} position={[0, 23, 0]} {...S} />
      {Array.from({ length: 20 }, (_, i) => {
        const a = (i / 20) * Math.PI * 2;
        return <mesh key={i} geometry={cyl(0.7, 0.8, 9, 16)} material={stone} position={[Math.cos(a) * 33, 4.3, Math.sin(a) * 33]} {...S} />;
      })}
      {houses.map((h, i) => (
        <mesh key={i} geometry={box(h.w, h.h, h.d, 0.15)} material={i % 3 ? stone : stoneDark} position={[h.x - PLATEAU.x, h.h / 2 - 0.3, h.z - PLATEAU.z]} rotation={[0, h.yaw, 0]} {...S} />
      ))}
    </group>
  );
});

const CAM: Key[] = [
  { f: 0, v: [-150, 78, 230, 0, 22, -20, 40] },
  { f: 2, v: [-132, 70, 202, 0, 22, -20, 40] },
];
const SHADOW_BOX: ShadowBox = { min: [-160, -10, -180], max: [160, 60, 140], mapWidth: 4096, sun: STARTER_SUN };

const Scene: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const env = useSkyEnvironment(STARTER_SUN, SKY, 0.7);
  const v = sample(CAM, t);
  const shot: Shot = { pos: [v[0], v[1], v[2]], target: [v[3], v[4], v[5]], fov: v[6], near: 0.6, far: 30000 };
  const look: Look = {
    sun: STARTER_SUN,
    sunColor: "#fff1d8",
    sunI: 4.0,
    exposure: 1.0,
    fog: { color: SKY.horizon, density: 0.00012 },
    background: SKY.horizon,
    environment: env,
    ao: 0.8,
    bloom: 0.1,
    haze: 0,
    hazeFlow: 0,
    hazeColor: "#ffffff",
    vignette: 0.16,
  };
  return (
    <Stage shot={shot} look={look} shadowBox={SHADOW_BOX} frame={frame}>
      <SkyDome sun={STARTER_SUN} colors={SKY} />
      <Terrain />
      <Citadel />
    </Stage>
  );
};

export const WorldforgeStarter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#cfdbe3" }}>
      <ThreeCanvas width={width} height={height} shadows={{ type: PCFShadowMap }} dpr={1} gl={{ antialias: false, preserveDrawingBuffer: true }} camera={{ fov: 40, near: 0.6, far: 30000, position: [0, 50, 200] }}>
        <Scene t={frame / fps} frame={frame} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
