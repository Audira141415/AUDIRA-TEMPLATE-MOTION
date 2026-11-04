// PAPERWORLD technical example — a paper village morning built only from src/kits/paperworld.
// Hills, houses and trees pop up in sequence, a clock on the tower runs, an arched door folds open and a
// puppet in its own colours walks out of it toward the lens while the camera dollies down with shallow
// depth of field that racks to the puppet. 5 s at any fps (every time is in seconds).
// It is a technical check and a starting point, not a story: never reuse it as a buyer's film.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { PCFShadowMap } from "three";
import { Stage, type Light, type Shot } from "../render/Stage.tsx";
import { clamp, ease, foldEase, mix, popEase, remap } from "../motion/easing.ts";
import { Ground, PaperBush, PaperCloud, PaperHill, PaperLamp, PaperTree } from "../components/MiniatureEnvironment.tsx";
import { PaperBuilding, type BuildingSpec } from "../components/PaperBuilding.tsx";
import { PaperDoor } from "../components/PaperDoor.tsx";
import { PaperClock } from "../components/PaperClock.tsx";
import { PaperCharacter, restPose } from "../components/PaperCharacter.tsx";
import { ShearPop, type V3 } from "../components/Paper.tsx";

export const PAPERWORLD_EXAMPLE_SECONDS = 5;

const MORNING: Light = {
  dir: [-0.55, 0.75, 0.4],
  key: "#fff1dc",
  keyI: 2.5,
  fill: "#e9eef6",
  fillI: 0.55,
  sky: "#fdf6ea",
  ground: "#cdb08f",
  hemiI: 1.2,
  bg: "#f1e7d6",
  exposure: 1.04,
  shadowSize: 60,
  shadowSoft: 4,
};

const TOWER: BuildingSpec = { w: 5, d: 4.5, h: 11.5, roof: "step", wall: "goldLight", roofColor: "goldDeep", trim: "ivoryLight", window: "cobaltDeep", cols: 2, rows: 2, seed: 9 };
const TOWER_AT: V3 = [0.5, 0, -19];

// The puppet walks out through the door: door and path share one heading.
const DOOR_AT: V3 = [-3.2, 0, -9];
const WALK_END: V3 = [1.0, 0, 2.0];
const HEADING = Math.atan2(WALK_END[0] - DOOR_AT[0], WALK_END[2] - DOOR_AT[2]);
const WALK_START: V3 = [DOOR_AT[0] - Math.sin(HEADING) * 0.7, 0, DOOR_AT[2] - Math.cos(HEADING) * 0.7];

const lerp3 = (a: V3, b: V3, t: number): V3 => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
const dist = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

export const PaperworldExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const s = frame / fps;
  const pop = (a: number, b: number) => popEase(remap(s, a, b));

  // puppet: steps out from behind the door once it is half open, then walks to the foreground
  const w = remap(s, 2.0, 4.8);
  const stride = Math.min(remap(s, 2.0, 2.4), 1 - remap(s, 4.4, 4.8));
  const puppet = lerp3(WALK_START, WALK_END, ease.inOut(w));

  // camera: one eased dolly from a high wide view down to eye level; focus racks from the village to the puppet
  const k = ease.inOut(remap(s, 0, PAPERWORLD_EXAMPLE_SECONDS));
  const pos = lerp3([-6, 10, 34], [3.5, 5.0, 17], k);
  const target = lerp3([0, 4.2, -8], [0, 3.4, -5], k);
  const head: V3 = [puppet[0], 3.6, puppet[2]];
  const shot: Shot = {
    pos,
    target,
    fov: 34,
    focus: mix(dist(pos, target), dist(pos, head), clamp(remap(s, 2.2, 3.2))),
    aperture: 0.0009,
    maxBlur: 0.004,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: MORNING.bg }}>
      <ThreeCanvas width={width} height={height} shadows={{ type: PCFShadowMap }} dpr={1}
        gl={{ antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" }} camera={{ fov: 34, position: [0, 8, 30] }}>
        <Stage shot={shot} light={MORNING} frame={frame} center={[0, 0, -8]}>
          <Ground color="ivory" />
          <PaperHill w={46} h={10} color="mintLight" position={[-6, 0, -34]} skew={0.2} t={pop(0.0, 0.7)} />
          <PaperHill w={38} h={7} color="mint" position={[9, 0, -28]} skew={-0.3} t={pop(0.15, 0.85)} />
          <PaperBuilding b={{ w: 5.5, d: 5, h: 8, roof: "gable", wall: "coralLight", roofColor: "cobalt", trim: "ivoryLight", window: "brownDeep", cols: 2, rows: 2, door: "mint", seed: 4 }}
            position={[-5.5, 0, -17]} yaw={0.12} t={pop(0.4, 1.1)} />
          <ShearPop t={pop(0.55, 1.25)} position={TOWER_AT}>
            <PaperBuilding b={TOWER} />
            <PaperClock r={0.95} hours={7 + s * 0.6} position={[0, 10.15, TOWER.d / 2 + 0.16]} />
          </ShearPop>
          <PaperBuilding b={{ w: 6, d: 5, h: 7, roof: "flat", wall: "cobaltLight", roofColor: "cobaltDeep", trim: "ivoryLight", window: "brownDeep", cols: 3, rows: 2, door: "coral", seed: 13 }}
            position={[6, 0, -16]} yaw={-0.15} t={pop(0.7, 1.4)} />
          <PaperTree kind="round" h={5.5} color="mint" position={[-8.5, 0, -7]} t={pop(0.9, 1.5)} />
          <PaperTree kind="cone" h={6.5} color="mintDeep" position={[7.5, 0, -8]} t={pop(1.0, 1.6)} />
          <PaperBush w={2.4} color="mintDeep" position={[4.2, 0, -1.5]} t={pop(1.1, 1.7)} />
          <PaperLamp h={5.2} position={[-6.2, 0, -3.5]} t={pop(1.2, 1.8)} glow={0.25} />
          <PaperCloud w={5} color="ivoryLight" position={[-5, 17 + Math.sin(s * 1.3) * 0.15, -24]} threadTo={24} />
          <PaperCloud w={4} color="ivoryLight" position={[5.5, 15.5 + Math.sin(s * 1.1 + 1) * 0.15, -22]} threadTo={24} />
          <PaperDoor d={{ kind: "arch", w: 3, h: 5.4, frame: "brown", leaf: "coral", trim: "coralDeep", panel: "inset" }}
            position={DOOR_AT} yaw={HEADING} open={foldEase(remap(s, 1.5, 2.3)) * 0.9} />
          <PaperCharacter
            pose={restPose({ time: s, walk: Math.max(0, s - 2.0) * 1.5, stride, look: [0.1, 0.05], blink: s % 3.1 < 0.1 ? 1 : 0 })}
            position={puppet} yaw={HEADING} scale={0.85}
            colors={{ coat: "mint", coatDeep: "mintDeep", collar: "ivoryLight", legs: "brown", shoes: "brownDeep", hair: "#2f2420", hairLight: "#4a3a33", scarf: "coral" }}
            scarf={false} curl={false} />
        </Stage>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
