# Audira Skill Motion Style Registry

What each of the twenty styles is, what this package includes for it, and its known limits. Author & Architect: **Agus Dwi Rianto (AUDIRA MDA)**. Read-only during buyer sessions.

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

## What this package contains

One installable `audira-motion` skill with twenty selectively loaded style references. This package contains the generic production kit (starter, core library, dedicated style kits for all 20 styles with technical examples, scripts) and small quality-bar stills. It does **not** contain or license third-party trademarked assets, stories, ElevenLabs recordings, or music. Buyers need Node.js, npm and (for audio work) ffmpeg; see `references/setup.md`.
