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
import { PixelstoryExample, PIXELSTORY_EXAMPLE_SECONDS } from "./kits/pixelstory/example/PixelstoryExample.tsx";
import { VoxelverseExample, VOXELVERSE_EXAMPLE_SECONDS } from "./kits/voxelverse/example/VoxelverseExample.tsx";
import { PaperworldExample, PAPERWORLD_EXAMPLE_SECONDS } from "./kits/paperworld/example/PaperworldExample.tsx";
import { WorldforgeStarter } from "./kits/worldforge/example/Starter.tsx";
import { TimeforgeExample } from "./kits/timeforge/example/ExampleFilm.tsx";
import { BuildforgeExample, BUILDFORGE_EXAMPLE_SECONDS } from "./kits/buildforge/example/BuildforgeExample.tsx";
import { IsocraftExample, ISOCRAFT_EXAMPLE_SECONDS } from "./kits/isocraft/example/IsocraftExample.tsx";
import { VintageforgeExample, VINTAGEFORGE_EXAMPLE_SECONDS } from "./kits/vintageforge/example/VintageforgeExample.tsx";
import { BrutalforgeExample, BRUTALFORGE_EXAMPLE_SECONDS } from "./kits/brutalforge/example/BrutalforgeExample.tsx";
import { ThermalforgeExample, THERMALFORGE_EXAMPLE_SECONDS } from "./kits/thermalforge/example/ThermalforgeExample.tsx";
import { ChalkcraftExample, CHALKCRAFT_EXAMPLE_SECONDS } from "./kits/chalkcraft/example/ChalkcraftExample.tsx";
import { KintsugiExample, KINTSUGI_EXAMPLE_SECONDS } from "./kits/kintsugi/example/KintsugiExample.tsx";
import { RetrowaveExample, RETROWAVE_EXAMPLE_SECONDS } from "./kits/retrowave/example/RetrowaveExample.tsx";
import { TextvoyageExample, TEXTVOYAGE_EXAMPLE_SECONDS } from "./kits/textvoyage/example/TextvoyageExample.tsx";
import { MistisforgeExample, MISTISFORGE_EXAMPLE_SECONDS } from "./kits/mistisforge/example/MistisforgeExample.tsx";
import { FoodforgeExample, FOODFORGE_EXAMPLE_SECONDS } from "./kits/foodforge/example/FoodforgeExample.tsx";
import { TacticboardExample, TACTICBOARD_EXAMPLE_SECONDS } from "./kits/tacticboard/example/TacticboardExample.tsx";
import { WayangforgeExample, WAYANGFORGE_EXAMPLE_SECONDS } from "./kits/wayangforge/example/WayangforgeExample.tsx";
import { DisastersimExample, DISASTERSIM_EXAMPLE_SECONDS } from "./kits/disastersim/example/DisastersimExample.tsx";
import { ScaleforgeExample, SCALEFORGE_EXAMPLE_SECONDS } from "./kits/scaleforge/example/ScaleforgeExample.tsx";
import { SatisfyforgeExample, SATISFYFORGE_EXAMPLE_SECONDS } from "./kits/satisfyforge/example/SatisfyforgeExample.tsx";
import { ComicforgeExample, COMICFORGE_EXAMPLE_SECONDS } from "./kits/comicforge/example/ComicforgeExample.tsx";
import { AbyssforgeExample, ABYSSFORGE_EXAMPLE_SECONDS } from "./kits/abyssforge/example/AbyssforgeExample.tsx";
import { RisoforgeExample, RISOFORGE_EXAMPLE_SECONDS } from "./kits/risoforge/example/RisoforgeExample.tsx";
import { Y2kchromeExample, Y2KCHROME_EXAMPLE_SECONDS } from "./kits/y2kchrome/example/Y2kchromeExample.tsx";
import { FeltcraftExample, FELTCRAFT_EXAMPLE_SECONDS } from "./kits/feltcraft/example/FeltcraftExample.tsx";
import { AnatomixExample, ANATOMIX_EXAMPLE_SECONDS } from "./kits/anatomix/example/AnatomixExample.tsx";
import { UkiyoforgeExample, UKIYOFORGE_EXAMPLE_SECONDS } from "./kits/ukiyoforge/example/UkiyoforgeExample.tsx";
import { StainedglassExample, STAINEDGLASS_EXAMPLE_SECONDS } from "./kits/stainedglass/example/StainedglassExample.tsx";
import { SulamforgeExample, SULAMFORGE_EXAMPLE_SECONDS } from "./kits/sulamforge/example/SulamforgeExample.tsx";
import { MosaicforgeExample, MOSAICFORGE_EXAMPLE_SECONDS } from "./kits/mosaicforge/example/MosaicforgeExample.tsx";
import { MarblemuseumExample, MARBLEMUSEUM_EXAMPLE_SECONDS } from "./kits/marblemuseum/example/MarblemuseumExample.tsx";
import { TerrariumExample, TERRARIUM_EXAMPLE_SECONDS } from "./kits/terrarium/example/TerrariumExample.tsx";
import { SketchforgeExample, SKETCHFORGE_EXAMPLE_SECONDS } from "./kits/sketchforge/example/SketchforgeExample.tsx";
import { DreamcoreExample, DREAMCORE_EXAMPLE_SECONDS } from "./kits/dreamcore/example/DreamcoreExample.tsx";
import { GacharevealExample, GACHAREVEAL_EXAMPLE_SECONDS } from "./kits/gachareveal/example/GacharevealExample.tsx";
import { ArcadecrtExample, ARCADECRT_EXAMPLE_SECONDS } from "./kits/arcadecrt/example/ArcadecrtExample.tsx";
import { ManuscriptExample, MANUSCRIPT_EXAMPLE_SECONDS } from "./kits/manuscript/example/ManuscriptExample.tsx";
import { GlitchforgeExample, GLITCHFORGE_EXAMPLE_SECONDS } from "./kits/glitchforge/example/GlitchforgeExample.tsx";

// Register each film twice: a preview (540 × 960 @ 30, for approval) and a final (1080 × 1920 @ 60).
// The 3D renders natively at each size, so the preview is cheap and the final is sharp.
const { preview, final } = PRESETS;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ShowcasePreview" component={Showcase} durationInFrames={6 * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="ShowcaseFinal" component={Showcase} durationInFrames={6 * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 01: PIXELSTORY (example registered for previews) */}
    <Composition id="PixelstoryPreview" component={PixelstoryExample} durationInFrames={PIXELSTORY_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="PixelstoryFinal" component={PixelstoryExample} durationInFrames={PIXELSTORY_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 02: VOXELVERSE (example registered for previews) */}
    <Composition id="VoxelversePreview" component={VoxelverseExample} durationInFrames={VOXELVERSE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="VoxelverseFinal" component={VoxelverseExample} durationInFrames={VOXELVERSE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 04: PAPERWORLD (example registered for previews) */}
    <Composition id="PaperworldPreview" component={PaperworldExample} durationInFrames={PAPERWORLD_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="PaperworldFinal" component={PaperworldExample} durationInFrames={PAPERWORLD_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 06: WORLDFORGE (example registered for previews) */}
    <Composition id="WorldforgePreview" component={WorldforgeStarter} durationInFrames={2 * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="WorldforgeFinal" component={WorldforgeStarter} durationInFrames={2 * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 07: TIMEFORGE (example registered for previews) */}
    <Composition id="TimeforgePreview" component={TimeforgeExample} durationInFrames={7 * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="TimeforgeFinal" component={TimeforgeExample} durationInFrames={7 * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 08: BUILDFORGE (example registered for previews) */}
    <Composition id="BuildforgePreview" component={BuildforgeExample} durationInFrames={BUILDFORGE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="BuildforgeFinal" component={BuildforgeExample} durationInFrames={BUILDFORGE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 21: ISOCRAFT (example registered for previews) */}
    <Composition id="IsocraftPreview" component={IsocraftExample} durationInFrames={ISOCRAFT_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="IsocraftFinal" component={IsocraftExample} durationInFrames={ISOCRAFT_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 22: VINTAGEFORGE (example registered for previews) */}
    <Composition id="VintageforgePreview" component={VintageforgeExample} durationInFrames={VINTAGEFORGE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="VintageforgeFinal" component={VintageforgeExample} durationInFrames={VINTAGEFORGE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 23: BRUTALFORGE (example registered for previews) */}
    <Composition id="BrutalforgePreview" component={BrutalforgeExample} durationInFrames={BRUTALFORGE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="BrutalforgeFinal" component={BrutalforgeExample} durationInFrames={BRUTALFORGE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 24: THERMALFORGE (example registered for previews) */}
    <Composition id="ThermalforgePreview" component={ThermalforgeExample} durationInFrames={THERMALFORGE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="ThermalforgeFinal" component={ThermalforgeExample} durationInFrames={THERMALFORGE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 25: CHALKCRAFT (example registered for previews) */}
    <Composition id="ChalkcraftPreview" component={ChalkcraftExample} durationInFrames={CHALKCRAFT_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="ChalkcraftFinal" component={ChalkcraftExample} durationInFrames={CHALKCRAFT_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 26: KINTSUGI (example registered for previews) */}
    <Composition id="KintsugiPreview" component={KintsugiExample} durationInFrames={KINTSUGI_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="KintsugiFinal" component={KintsugiExample} durationInFrames={KINTSUGI_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 27: RETROWAVE (example registered for previews) */}
    <Composition id="RetrowavePreview" component={RetrowaveExample} durationInFrames={RETROWAVE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="RetrowaveFinal" component={RetrowaveExample} durationInFrames={RETROWAVE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 28: TEXTVOYAGE (example registered for previews) */}
    <Composition id="TextvoyagePreview" component={TextvoyageExample} durationInFrames={TEXTVOYAGE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="TextvoyageFinal" component={TextvoyageExample} durationInFrames={TEXTVOYAGE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

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

    {/* Style 44: MISTISFORGE (Nusantara Folk Horror & Misty Village Night) */}
    <Composition id="MistisforgePreview" component={MistisforgeExample} durationInFrames={MISTISFORGE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="MistisforgeFinal" component={MistisforgeExample} durationInFrames={MISTISFORGE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 45: FOODFORGE (Macro Food Tabletop & Slow-Motion Culinary Hero) */}
    <Composition id="FoodforgePreview" component={FoodforgeExample} durationInFrames={FOODFORGE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="FoodforgeFinal" component={FoodforgeExample} durationInFrames={FOODFORGE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 46: TACTICBOARD (3D Football Tactics Board & Match Replay) */}
    <Composition id="TacticboardPreview" component={TacticboardExample} durationInFrames={TACTICBOARD_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="TacticboardFinal" component={TacticboardExample} durationInFrames={TACTICBOARD_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 47: WAYANGFORGE (Wayang Kulit Shadow Puppet Screen & Batik) */}
    <Composition id="WayangforgePreview" component={WayangforgeExample} durationInFrames={WAYANGFORGE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="WayangforgeFinal" component={WayangforgeExample} durationInFrames={WAYANGFORGE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 48: DISASTERSIM (Geohazard Cross-Section & Disaster Simulation) */}
    <Composition id="DisastersimPreview" component={DisastersimExample} durationInFrames={DISASTERSIM_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="DisastersimFinal" component={DisastersimExample} durationInFrames={DISASTERSIM_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 49: SCALEFORGE (Extreme Scale Comparison & Continuous Zoom) */}
    <Composition id="ScaleforgePreview" component={ScaleforgeExample} durationInFrames={SCALEFORGE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="ScaleforgeFinal" component={ScaleforgeExample} durationInFrames={SCALEFORGE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 50: SATISFYFORGE (Oddly Satisfying Loops & Kinetic Sand) */}
    <Composition id="SatisfyforgePreview" component={SatisfyforgeExample} durationInFrames={SATISFYFORGE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="SatisfyforgeFinal" component={SatisfyforgeExample} durationInFrames={SATISFYFORGE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 51: COMICFORGE (Cel-Shaded Western Comic Book & Halftone) */}
    <Composition id="ComicforgePreview" component={ComicforgeExample} durationInFrames={COMICFORGE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="ComicforgeFinal" component={ComicforgeExample} durationInFrames={COMICFORGE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 52: ABYSSFORGE (Bioluminescent Deep Sea & Sonar Descent) */}
    <Composition id="AbyssforgePreview" component={AbyssforgeExample} durationInFrames={ABYSSFORGE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="AbyssforgeFinal" component={AbyssforgeExample} durationInFrames={ABYSSFORGE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 53: RISOFORGE (Risograph Zine Print & Spot-Color Halftone) */}
    <Composition id="RisoforgePreview" component={RisoforgeExample} durationInFrames={RISOFORGE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="RisoforgeFinal" component={RisoforgeExample} durationInFrames={RISOFORGE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 54: Y2KCHROME (Y2K Liquid Chrome & Frutiger Bubble Aesthetic) */}
    <Composition id="Y2kchromePreview" component={Y2kchromeExample} durationInFrames={Y2KCHROME_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="Y2kchromeFinal" component={Y2kchromeExample} durationInFrames={Y2KCHROME_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 55: FELTCRAFT (Needle-Felted Wool & Stitched Fabric Diorama) */}
    <Composition id="FeltcraftPreview" component={FeltcraftExample} durationInFrames={FELTCRAFT_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="FeltcraftFinal" component={FeltcraftExample} durationInFrames={FELTCRAFT_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 56: ANATOMIX (Medical Anatomy Cutaway & Clinical Hologram) */}
    <Composition id="AnatomixPreview" component={AnatomixExample} durationInFrames={ANATOMIX_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="AnatomixFinal" component={AnatomixExample} durationInFrames={ANATOMIX_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 57: UKIYOFORGE (Ukiyo-e Woodblock Print & Layered Waves) */}
    <Composition id="UkiyoforgePreview" component={UkiyoforgeExample} durationInFrames={UKIYOFORGE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="UkiyoforgeFinal" component={UkiyoforgeExample} durationInFrames={UKIYOFORGE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 58: STAINEDGLASS (Stained Glass Leadlight & Cathedral Light) */}
    <Composition id="StainedglassPreview" component={StainedglassExample} durationInFrames={STAINEDGLASS_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="StainedglassFinal" component={StainedglassExample} durationInFrames={STAINEDGLASS_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 59: SULAMFORGE (Embroidery, Sulam & Woven Tenun Textile) */}
    <Composition id="SulamforgePreview" component={SulamforgeExample} durationInFrames={SULAMFORGE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="SulamforgeFinal" component={SulamforgeExample} durationInFrames={SULAMFORGE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 60: MOSAICFORGE (Tessellated Mosaic Tiles Assembling) */}
    <Composition id="MosaicforgePreview" component={MosaicforgeExample} durationInFrames={MOSAICFORGE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="MosaicforgeFinal" component={MosaicforgeExample} durationInFrames={MOSAICFORGE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 61: MARBLEMUSEUM (Classical Marble Sculpture & Museum Gallery) */}
    <Composition id="MarblemuseumPreview" component={MarblemuseumExample} durationInFrames={MARBLEMUSEUM_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="MarblemuseumFinal" component={MarblemuseumExample} durationInFrames={MARBLEMUSEUM_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 62: TERRARIUM (Glass Jar Terrarium Living Ecosystem) */}
    <Composition id="TerrariumPreview" component={TerrariumExample} durationInFrames={TERRARIUM_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="TerrariumFinal" component={TerrariumExample} durationInFrames={TERRARIUM_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 63: SKETCHFORGE (Pencil Sketch Turning Into 3D Form) */}
    <Composition id="SketchforgePreview" component={SketchforgeExample} durationInFrames={SKETCHFORGE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="SketchforgeFinal" component={SketchforgeExample} durationInFrames={SKETCHFORGE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 64: DREAMCORE (Pastel Dreamcore & Impossible Surreal Spaces) */}
    <Composition id="DreamcorePreview" component={DreamcoreExample} durationInFrames={DREAMCORE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="DreamcoreFinal" component={DreamcoreExample} durationInFrames={DREAMCORE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 65: GACHAREVEAL (Gacha Card & Loot Reveal Spectacle) */}
    <Composition id="GacharevealPreview" component={GacharevealExample} durationInFrames={GACHAREVEAL_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="GacharevealFinal" component={GacharevealExample} durationInFrames={GACHAREVEAL_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 66: ARCADECRT (Arcade Cabinet & CRT Scanline Retro Game) */}
    <Composition id="ArcadecrtPreview" component={ArcadecrtExample} durationInFrames={ARCADECRT_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="ArcadecrtFinal" component={ArcadecrtExample} durationInFrames={ARCADECRT_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 67: MANUSCRIPT (Illuminated Manuscript & Lontar Palm-Leaf) */}
    <Composition id="ManuscriptPreview" component={ManuscriptExample} durationInFrames={MANUSCRIPT_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="ManuscriptFinal" component={ManuscriptExample} durationInFrames={MANUSCRIPT_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />

    {/* Style 68: GLITCHFORGE (Glitch Art, Datamosh & Signal Corruption) */}
    <Composition id="GlitchforgePreview" component={GlitchforgeExample} durationInFrames={GLITCHFORGE_EXAMPLE_SECONDS * preview.fps} fps={preview.fps} width={preview.width} height={preview.height} />
    <Composition id="GlitchforgeFinal" component={GlitchforgeExample} durationInFrames={GLITCHFORGE_EXAMPLE_SECONDS * final.fps} fps={final.fps} width={final.width} height={final.height} />
  </>
);
