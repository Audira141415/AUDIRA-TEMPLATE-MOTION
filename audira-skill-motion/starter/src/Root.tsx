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
import { AudirabotExample, AUDIRABOT_EXAMPLE_SECONDS } from "./kits/audirabot/example/AudirabotExample.tsx";
import { DevforgeExample, DEVFORGE_EXAMPLE_SECONDS } from "./kits/devforge/example/DevforgeExample.tsx";
import { ToyDioramaExample, TOYDIORAMA_EXAMPLE_SECONDS } from "./kits/toydiorama/example/ToyDioramaExample.tsx";
import { FilmNoirExample, FILMNOIR_EXAMPLE_SECONDS } from "./kits/filmnoir/example/FilmNoirExample.tsx";
import { WatercolorExample, WATERCOLOR_EXAMPLE_SECONDS } from "./kits/watercolor/example/WatercolorExample.tsx";
import { FluidforgeExample, FLUIDFORGE_EXAMPLE_SECONDS } from "./kits/fluidforge/example/FluidforgeExample.tsx";
import { Hd2dExample, HD2D_EXAMPLE_SECONDS } from "./kits/hd2d/example/Hd2dExample.tsx";
import { MemphisDioramaExample, MEMPHISDIORAMA_EXAMPLE_SECONDS } from "./kits/memphisdiorama/example/MemphisDioramaExample.tsx";
import { DataPhysicalExample, DATAPHYSICAL_EXAMPLE_SECONDS } from "./kits/dataphysical/example/DataPhysicalExample.tsx";
import { SatelliteBriefingExample, SATELLITEBRIEFING_EXAMPLE_SECONDS } from "./kits/satellitebriefing/example/SatelliteBriefingExample.tsx";
import { BackroomsExample, BACKROOMS_EXAMPLE_SECONDS } from "./kits/backrooms/example/BackroomsExample.tsx";
import { VisualInvestigationExample, VISUALINVESTIGATION_EXAMPLE_SECONDS } from "./kits/visualinvestigation/example/VisualInvestigationExample.tsx";
import { TradingTerminalExample, TRADINGTERMINAL_EXAMPLE_SECONDS } from "./kits/tradingterminal/example/TradingTerminalExample.tsx";
import { HistoryMapExample, HISTORYMAP_EXAMPLE_SECONDS } from "./kits/historymap/example/HistoryMapExample.tsx";
import { IslamicDocumentaryExample, ISLAMICDOCUMENTARY_EXAMPLE_SECONDS } from "./kits/islamicdocumentary/example/IslamicDocumentaryExample.tsx";

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

    {/* Style 29: AUDIRABOT (Official 3D Mascot Companion & Telemetry Engine) */}
    <Composition
      id="AudirabotPreview"
      component={AudirabotExample}
      durationInFrames={AUDIRABOT_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="AudirabotFinal"
      component={AudirabotExample}
      durationInFrames={AUDIRABOT_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 30: DEVFORGE (3D Spatial IDE & Game Dev Hustle Engine) */}
    <Composition
      id="DevforgePreview"
      component={DevforgeExample}
      durationInFrames={DEVFORGE_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="DevforgeFinal"
      component={DevforgeExample}
      durationInFrames={DEVFORGE_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 31: TOYDIORAMA (Stylized 3D Toy Diorama & Miniature Theatrical Stage) */}
    <Composition
      id="ToyDioramaPreview"
      component={ToyDioramaExample}
      durationInFrames={TOYDIORAMA_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="ToyDioramaFinal"
      component={ToyDioramaExample}
      durationInFrames={TOYDIORAMA_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 32: FILMNOIR (Classic Cinematic Film Noir & Chiaroscuro) */}
    <Composition
      id="FilmNoirPreview"
      component={FilmNoirExample}
      durationInFrames={FILMNOIR_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="FilmNoirFinal"
      component={FilmNoirExample}
      durationInFrames={FILMNOIR_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 33: WATERCOLOR (European Children's Tale & Storybook Watercolor) */}
    <Composition
      id="WatercolorPreview"
      component={WatercolorExample}
      durationInFrames={WATERCOLOR_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="WatercolorFinal"
      component={WatercolorExample}
      durationInFrames={WATERCOLOR_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 34: FLUIDFORGE (Abstract Fluid Motion & Iridescent Liquid Metal) */}
    <Composition
      id="FluidforgePreview"
      component={FluidforgeExample}
      durationInFrames={FLUIDFORGE_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="FluidforgeFinal"
      component={FluidforgeExample}
      durationInFrames={FLUIDFORGE_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 35: HD2D (HD-2D Diorama & Tilt-Shift Pixel World) */}
    <Composition
      id="Hd2dPreview"
      component={Hd2dExample}
      durationInFrames={HD2D_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="Hd2dFinal"
      component={Hd2dExample}
      durationInFrames={HD2D_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 36: MEMPHISDIORAMA (1980s Ettore Sottsass Architectural Tabletop Model) */}
    <Composition
      id="MemphisDioramaPreview"
      component={MemphisDioramaExample}
      durationInFrames={MEMPHISDIORAMA_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="MemphisDioramaFinal"
      component={MemphisDioramaExample}
      durationInFrames={MEMPHISDIORAMA_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 37: DATAPHYSICAL (3D Data Physicalization & Sculptural Stats) */}
    <Composition
      id="DataPhysicalPreview"
      component={DataPhysicalExample}
      durationInFrames={DATAPHYSICAL_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="DataPhysicalFinal"
      component={DataPhysicalExample}
      durationInFrames={DATAPHYSICAL_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 38: SATELLITEBRIEFING (3D Satellite & OSINT Geospatial Reconnaissance) */}
    <Composition
      id="SatelliteBriefingPreview"
      component={SatelliteBriefingExample}
      durationInFrames={SATELLITEBRIEFING_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="SatelliteBriefingFinal"
      component={SatelliteBriefingExample}
      durationInFrames={SATELLITEBRIEFING_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 39: BACKROOMS (Liminal 3D Corridors & 90s Found Footage) */}
    <Composition
      id="BackroomsPreview"
      component={BackroomsExample}
      durationInFrames={BACKROOMS_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="BackroomsFinal"
      component={BackroomsExample}
      durationInFrames={BACKROOMS_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 40: VISUALINVESTIGATION (Visual Journalism & Forensic Courtroom Desk) */}
    <Composition
      id="VisualInvestigationPreview"
      component={VisualInvestigationExample}
      durationInFrames={VISUALINVESTIGATION_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="VisualInvestigationFinal"
      component={VisualInvestigationExample}
      durationInFrames={VISUALINVESTIGATION_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 41: TRADINGTERMINAL (Institutional Financial Markets & Crypto Telemetry) */}
    <Composition
      id="TradingTerminalPreview"
      component={TradingTerminalExample}
      durationInFrames={TRADINGTERMINAL_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="TradingTerminalFinal"
      component={TradingTerminalExample}
      durationInFrames={TRADINGTERMINAL_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 42: HISTORYMAP (Geopolitical & War History Documentary Map Director) */}
    <Composition
      id="HistoryMapPreview"
      component={HistoryMapExample}
      durationInFrames={HISTORYMAP_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="HistoryMapFinal"
      component={HistoryMapExample}
      durationInFrames={HISTORYMAP_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />

    {/* Style 43: ISLAMICDOCUMENTARY (Folk Islam & Islamic Golden Age Motion Director) */}
    <Composition
      id="IslamicDocumentaryPreview"
      component={IslamicDocumentaryExample}
      durationInFrames={ISLAMICDOCUMENTARY_EXAMPLE_SECONDS * preview.fps}
      fps={preview.fps}
      width={preview.width}
      height={preview.height}
    />
    <Composition
      id="IslamicDocumentaryFinal"
      component={IslamicDocumentaryExample}
      durationInFrames={ISLAMICDOCUMENTARY_EXAMPLE_SECONDS * final.fps}
      fps={final.fps}
      width={final.width}
      height={final.height}
    />
  </>
);
