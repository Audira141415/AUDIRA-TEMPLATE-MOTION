# Audira Skill Motion Style Registry

What each of the 43 styles is, what this package includes for it, and its known limits. Author & Architect: **AUDIRA (Agus Dwi R)**. Read-only during buyer sessions.

| ID | Name | Direction | Engine in this package | Known limits |
| --- | --- | --- | --- | --- |
| 01 | PIXELSTORY | Cinematic 2.5D pixel-character storytelling | `kits/pixelstory` (+ fonts) | Lights cast no shadows (paint them); every film designs its own cast; very large layers slow renders |
| 02 | VOXELVERSE | 3D handcrafted voxel worlds | `kits/voxelverse` | One shadowed key light; voxel characters are built per film; keep far rows simple in large worlds |
| 03 | PRECISION | Premium hard-surface product CGI / exploded view | `kits/precision` (+ shared core) | No SDF/pebble geometry kit; soft organic product forms need extra work |
| 04 | PAPERWORLD | Tactile paper-craft storytelling | `kits/paperworld` | Folds are rigid hinges and shears (no paper bending); one puppet rig — new characters are new components |
| 05 | INNERWORKS | Cutaway technical explainer | `kits/innerworks` | A new machine typically needs 1–2 look-dev fix rounds (hidden parts, label collisions, occlusion) |
| 06 | WORLDFORGE | Explorable full-3D environments | `kits/worldforge` | No water, forest, animal, crowd or city-scale systems; author them when a brief needs them |
| 07 | TIMEFORGE | One object evolving through dated eras | `kits/timeforge` | Studio tuned for hand-held objects (5–20 units); camera keys hand-written per film |
| 08 | BUILDFORGE | Component-by-component 3D construction | `kits/buildforge` (+ sequence check) | Exact clash check for 90° rotations; fits simple orthogonal structures; not engineering instruction |
| 09 | CYBERFORGE | Holographic 3D sci-fi, HUD telemetry & cyber wireframes | `kits/cyberforge` | Highly emissive scene requires dark void background; particle count <= 2500 for mobile FPS |
| 10 | DRAFTFORGE | Architectural CAD blueprints & technical schematics | `kits/draftforge` | Vector-like wireframe styles require clean mesh edges; high line counts (>20k) require geometry batching |
| 11 | CLAYWORLD | Tactile stop-motion claymation & plasticine diorama | `kits/clayworld` | Character physics quantized to 15 FPS cadence; complex organic deforms use primitive groups |
| 12 | POLYVERSE | Faceted low-poly worlds, floating islands & pastel dioramas | `kits/polyverse` | Always keep flatShading true; keep total poly count under 50k for crisp performance |
| 13 | TOONFORGE | Cel-shaded 3D anime, ink contours & manga speed lines | `kits/toonforge` | Outlines use inverted-hull backfaces; keep mesh normals manifold |
| 14 | GLASSCRAFT | Spatial glassmorphism, refractive liquid prisms & VisionOS acoustics | `kits/glasscraft` | Physical transmission requires dark/colored rim lights to pop; keep roughness <= 0.1 |
| 15 | NANOFORGE | Microscopic molecular biology, DNA double-helix & Cryo-EM nanotech | `kits/nanoforge` | Fluid Brownian dynamics require subtle continuous motion; keep particle count <= 1000 |
| 16 | INKSTORY | East Asian ink wash, Shan Shui misty mountains & zen calligraphy | `kits/inkstory` | Aged Xuan paper requires warm tones (#f5f0e6); stroke ribbons require manifold geometry |
| 17 | LIDARFORGE | 3D point cloud aerial survey, laser scanning & elevation bathymetry | `kits/lidarforge` | Points must follow true elevation colormap; keep point count <= 10,000 for mobile 60 FPS |
| 18 | CIRCUITFORGE | 3D PCB electronics, SMT microchips & copper electron streams | `kits/circuitforge` | Traces must follow 0/45/90° octilinear routing; keep pulse glow width capped in pixels |
| 19 | BRICKCRAFT | Tactile plastic bricks, interlocking stud geometry & macro toy stop-motion | `kits/brickcraft` | Bricks step on 12/15 FPS while camera moves at 60 FPS; avoid trademarked minifig shapes |
| 20 | URBANFORGE | Architectural white model, real sun shadows & dynamic data projection | `kits/urbanforge` | Model is matte plaster white; color only projected as light washes; needs dark gallery room |
| 21 | ISOCRAFT | Isometric comic hand-inked machine & manga teardown | `kits/isocraft` | Keep line width uniform; see-through requires transparent materials on casing layer |
| 22 | VINTAGEFORGE | Da Vinci antique manuscript & copperplate engraving | `kits/vintageforge` | Hand-drawn cross-hatching look needs high-contrast warm lighting; sepia vignette on overlay |
| 23 | BRUTALFORGE | 3D Neo-Brutalism pop & high-energy kinetic strobe | `kits/brutalforge` | Outlines must use inverted-hull backfaces; drop shadow must be unblurred solid black |
| 24 | THERMALFORGE | FLIR infrared & thermal heatmap vision telemetry | `kits/thermalforge` | Requires Ironbow spectrum colormap; keep HUD telemetry within safe zones |
| 25 | CHALKCRAFT | Quantum blackboard & theoretical physics chalk lines | `kits/chalkcraft` | Keep chalk lines slightly stippled; particulate field capped at 500 dust specks |
| 26 | KINTSUGI | Wabi-Sabi ceramic & glowing liquid gold seams | `kits/kintsugi` | Porcelain requires subtle roughness; gold veins need emissive intensity bloom |
| 27 | RETROWAVE | 80s Synthwave & CRT tabung monitor scanlines | `kits/retrowave` | Keep neon grid loop seamless at z-modulo; CRT overlay requires chromatic aberration |
| 28 | TEXTVOYAGE | Spatial giant 3D kinetic typography & monoliths | `kits/textvoyage` | Giant letters require deep near/far clip planes; camera FPV requires tight collision margin |
| 29 | AUDIRABOT | Flagship 3D mascot companion, OLED visor & plasma thruster | `kits/audirabot` | Companion scale tuned for 1.0–1.2 unit height; facial HUD text bounded inside safe margins |
| 30 | DEVFORGE | 3D spatial IDE, syntax typewriter & gamedev asset spawning | `kits/devforge` | Max code lines <= 24 per card; keep 3D spawned meshes <= 15k polygons |
| 31 | TOYDIORAMA | Stylized 3D toy diorama & miniature theatrical stage | `kits/toydiorama` | Camera must remain static macro rig; character materials strictly matte plastic & soft clay |
| 32 | FILMNOIR | Classic 1940s film noir, chiaroscuro & venetian blinds shadows | `kits/filmnoir` | Keep ambient lighting <= 0.1 to maintain pitch-black shadows; single selective neon accent only |
| 33 | WATERCOLOR | European children's tale & storybook watercolor washes | `kits/watercolor` | Use soft pastel pigment washes; maintain 300gsm cold-press paper background |
| 34 | FLUIDFORGE | Abstract fluid motion, iridescent liquid chrome & ferrofluid | `kits/fluidforge` | Keep metalness >= 0.92 and roughness <= 0.10; requires dark void background for specular pop |
| 35 | HD2D | Octopath-style 2D pixel sprites inside a lit 3D tilt-shift diorama | `kits/hd2d` | Sprites step at 8 FPS while 3D camera glides at 60 FPS; use 2400K warm lantern point lights |
| 36 | MEMPHISDIORAMA | 1980s Ettore Sottsass architectural tabletop model & terrazzo | `kits/memphisdiorama` | Zero depth-of-field blur; hard directional cool-purple shadows (`#705890`) on warm paper |
| 37 | DATAPHYSICAL | 3D data physicalization, stacked aluminum & brass sculptures | `kits/dataphysical` | Every plate represents a countable unit; use walnut plinth with engraved brass ruler ticks |
| 38 | SATELLITEBRIEFING | 3D satellite & OSINT geospatial reconnaissance zoom | `kits/satellitebriefing` | Desaturated analyst grey terrain so amber (`#FFBE55`) target reticles and vectors pop cleanly |
| 39 | BACKROOMS | Liminal 3D yellow corridors & 90s VHS camcorder found footage | `kits/backrooms` | Handheld walking bob harmonic; stochastic fluorescent ballast flicker at 30 FPS tape cadence |
| 40 | VISUALINVESTIGATION | Visual journalism, forensic courtroom desk & verbatim dossier | `kits/visualinvestigation` | Mandatory Mute Test compliance: every scene must show Named Speaker, Verbatim Quote, and Clock |
| 41 | TRADINGTERMINAL | Institutional financial markets, candlestick charts & order book depth | `kits/tradingterminal` | Keep candle body ratio clean; live price laser must remain within 9:16 safe zones |
| 42 | HISTORYMAP | Geopolitical war history documentary, territorial shifts & pincer arrows | `kits/historymap` | Requires accurate geographic chokepoints; display year timestamp at all times |
| 43 | ISLAMICDOCUMENTARY | Folk Islam & Islamic golden age, sacred 8-point stars & dome silhouettes | `kits/islamicdocumentary` | Strict reverence: no physical face depictions of holy figures; focus on light, geometry & calligraphy |

## What this package contains

One installable `audira-motion` skill with 43 selectively loaded style references and modular Style DNA profiles. This package contains the generic production kit (starter, core library, dedicated style kits for all 43 styles with technical examples, scripts) and quality-bar stills. It does **not** contain or license third-party trademarked assets, stories, ElevenLabs recordings, or music. Buyers need Node.js, npm and (for audio work) ffmpeg; see `references/setup.md`.
