import React from "react";
import { Composition } from "remotion";
import { PRESETS } from "./core/film/frame.ts";
import { Showcase } from "./scenes/showcase/Showcase.tsx";
import { CyberforgeExample, CYBERFORGE_EXAMPLE_SECONDS } from "./kits/cyberforge/example/CyberforgeExample.tsx";
import { DraftforgeExample, DRAFTFORGE_EXAMPLE_SECONDS } from "./kits/draftforge/example/DraftforgeExample.tsx";
import { ClayworldExample, CLAYWORLD_EXAMPLE_SECONDS } from "./kits/clayworld/example/ClayworldExample.tsx";
import { PolyverseExample, POLYVERSE_EXAMPLE_SECONDS } from "./kits/polyverse/example/PolyverseExample.tsx";
import { ToonforgeExample, TOONFORGE_EXAMPLE_SECONDS } from "./kits/toonforge/example/ToonforgeExample.tsx";
import { GlasscraftExample, GLASSCRAFT_EXAMPLE_SECONDS } from "./kits/glasscraft/example/GlasscraftExample.tsx";
import { PrecisionExample, PRECISION_EXAMPLE_SECONDS } from "./kits/precision/example/PrecisionExample.tsx";
import { InnerworksExample, INNERWORKS_EXAMPLE_SECONDS } from "./kits/innerworks/example/InnerworksExample.tsx";
import { NanoforgeExample, NANOFORGE_EXAMPLE_SECONDS } from "./kits/nanoforge/example/NanoforgeExample.tsx";
import { InkstoryExample, INKSTORY_EXAMPLE_SECONDS } from "./kits/inkstory/example/InkstoryExample.tsx";
import { LidarforgeExample, LIDARFORGE_EXAMPLE_SECONDS } from "./kits/lidarforge/example/LidarforgeExample.tsx";
import { CircuitforgeExample, CIRCUITFORGE_EXAMPLE_SECONDS } from "./kits/circuitforge/example/CircuitforgeExample.tsx";
import { BrickcraftExample, BRICKCRAFT_EXAMPLE_SECONDS } from "./kits/brickcraft/example/BrickcraftExample.tsx";
import { UrbanforgeExample, URBANFORGE_EXAMPLE_SECONDS } from "./kits/urbanforge/example/UrbanforgeExample.tsx";

// Register each film twice: a preview (540 × 960 @ 30, for approval) and a final (1080 × 1920 @ 60).
// The 3D renders natively at each size, so the preview is cheap and the final is sharp.
const { preview, final } = PRESETS;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ShowcasePreview" component={Showcase} durationInFrames={6 * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="ShowcaseFinal" component={Showcase} durationInFrames={6 * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 09: CYBERFORGE (Holographic Sci-Fi & HUD Telemetry) */}
    <Composition
      id="CyberforgePreview"
      component={CyberforgeExample}
      durationInFrames={CYBERFORGE_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="CyberforgeFinal"
      component={CyberforgeExample}
      durationInFrames={CYBERFORGE_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 10: DRAFTFORGE (Architectural CAD Blueprints & Technical Schematics) */}
    <Composition
      id="DraftforgePreview"
      component={DraftforgeExample}
      durationInFrames={DRAFTFORGE_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="DraftforgeFinal"
      component={DraftforgeExample}
      durationInFrames={DRAFTFORGE_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 11: CLAYWORLD (Tactile Stop-Motion Claymation & Plasticine Diorama) */}
    <Composition
      id="ClayworldPreview"
      component={ClayworldExample}
      durationInFrames={CLAYWORLD_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="ClayworldFinal"
      component={ClayworldExample}
      durationInFrames={CLAYWORLD_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 12: POLYVERSE (Faceted Low-Poly Minimalist Worlds & Floating Islands) */}
    <Composition
      id="PolyversePreview"
      component={PolyverseExample}
      durationInFrames={POLYVERSE_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="PolyverseFinal"
      component={PolyverseExample}
      durationInFrames={POLYVERSE_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 13: TOONFORGE (Cel-Shaded 3D Anime, Ink Contours & Manga Speed Lines) */}
    <Composition
      id="ToonforgePreview"
      component={ToonforgeExample}
      durationInFrames={TOONFORGE_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="ToonforgeFinal"
      component={ToonforgeExample}
      durationInFrames={TOONFORGE_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 14: GLASSCRAFT (Spatial Glassmorphism & Liquid Prisms) */}
    <Composition
      id="GlasscraftPreview"
      component={GlasscraftExample}
      durationInFrames={GLASSCRAFT_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="GlasscraftFinal"
      component={GlasscraftExample}
      durationInFrames={GLASSCRAFT_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 03: PRECISION (Industrial CMF & Exploded Product Cinematics) */}
    <Composition
      id="PrecisionPreview"
      component={PrecisionExample}
      durationInFrames={PRECISION_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="PrecisionFinal"
      component={PrecisionExample}
      durationInFrames={PRECISION_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 05: INNERWORKS (Technical X-Ray Cutaway & Mechanical Kinematics) */}
    <Composition
      id="InnerworksPreview"
      component={InnerworksExample}
      durationInFrames={INNERWORKS_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="InnerworksFinal"
      component={InnerworksExample}
      durationInFrames={INNERWORKS_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 15: NANOFORGE (Microscopic Molecular Biology & Cryo-EM Nanotech) */}
    <Composition
      id="NanoforgePreview"
      component={NanoforgeExample}
      durationInFrames={NANOFORGE_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="NanoforgeFinal"
      component={NanoforgeExample}
      durationInFrames={NANOFORGE_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 16: INKSTORY (East Asian Ink Wash, Shan Shui Mountains & Zen Calligraphy) */}
    <Composition
      id="InkstoryPreview"
      component={InkstoryExample}
      durationInFrames={INKSTORY_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="InkstoryFinal"
      component={InkstoryExample}
      durationInFrames={INKSTORY_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 17: LIDARFORGE (3D Point Cloud Aerial Survey, Laser Scanning & Elevation Bathymetry) */}
    <Composition
      id="LidarforgePreview"
      component={LidarforgeExample}
      durationInFrames={LIDARFORGE_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="LidarforgeFinal"
      component={LidarforgeExample}
      durationInFrames={LIDARFORGE_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 18: CIRCUITFORGE (3D PCB Electronics, SMT Microchips & Copper Electron Streams) */}
    <Composition
      id="CircuitforgePreview"
      component={CircuitforgeExample}
      durationInFrames={CIRCUITFORGE_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="CircuitforgeFinal"
      component={CircuitforgeExample}
      durationInFrames={CIRCUITFORGE_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 19: BRICKCRAFT (Tactile Plastic Bricks, Interlocking Stud Geometry & Macro Toy Stop-Motion) */}
    <Composition
      id="BrickcraftPreview"
      component={BrickcraftExample}
      durationInFrames={BRICKCRAFT_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="BrickcraftFinal"
      component={BrickcraftExample}
      durationInFrames={BRICKCRAFT_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 20: URBANFORGE (Architectural White Model, Real Sun Shadows & Dynamic Data Projection) */}
    <Composition
      id="UrbanforgePreview"
      component={UrbanforgeExample}
      durationInFrames={URBANFORGE_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="UrbanforgeFinal"
      component={UrbanforgeExample}
      durationInFrames={URBANFORGE_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />
  </>
);
