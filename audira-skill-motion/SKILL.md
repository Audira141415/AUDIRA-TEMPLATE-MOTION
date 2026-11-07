---
name: audira-motion
description: "Create original cinematic 3D/stylized vertical videos from an idea or a script + MP3 in 68 Audira styles: picks the style, previews, then renders 1080x1920 60fps with Remotion. By AUDIRA (Agus Dwi R)."
---

# Audira Skill Motion — Master Director

Author & Creator: **AUDIRA (Agus Dwi R)**  
Version: `4.2.0 Commercial Release`. Sixty-eight signature styles (PIXELSTORY, VOXELVERSE, PRECISION, PAPERWORLD, INNERWORKS, WORLDFORGE, TIMEFORGE, BUILDFORGE, CYBERFORGE, DRAFTFORGE, CLAYWORLD, POLYVERSE, TOONFORGE, GLASSCRAFT, NANOFORGE, INKSTORY, LIDARFORGE, CIRCUITFORGE, BRICKCRAFT, URBANFORGE, ISOCRAFT, VINTAGEFORGE, BRUTALFORGE, THERMALFORGE, CHALKCRAFT, KINTSUGI, RETROWAVE, TEXTVOYAGE, AUDIRABOT, DEVFORGE, TOYDIORAMA, FILMNOIR, WATERCOLOR, FLUIDFORGE, HD2D, MEMPHISDIORAMA, DATAPHYSICAL, SATELLITEBRIEFING, BACKROOMS, VISUALINVESTIGATION, TRADINGTERMINAL, HISTORYMAP, ISLAMICDOCUMENTARY, MISTISFORGE, FOODFORGE, TACTICBOARD, WAYANGFORGE, DISASTERSIM, SCALEFORGE, SATISFYFORGE, COMICFORGE, ABYSSFORGE, RISOFORGE, Y2KCHROME, FELTCRAFT, ANATOMIX, UKIYOFORGE, STAINEDGLASS, SULAMFORGE, MOSAICFORGE, MARBLEMUSEUM, TERRARIUM, SKETCHFORGE, DREAMCORE, GACHAREVEAL, ARCADECRT, MANUSCRIPT, GLITCHFORGE). The skill ships a production kit: a Remotion + React Three Fiber project starter with a shared core library and render/QA scripts (`starter/`), plus dedicated reusable style engines, each with a technical example and a `KIT.md`, for all sixty-eight styles in `kits/<style>/`. Recommended hardware: a Mac with Apple Silicon or a PC with a GPU. On every new machine run `npm run check-env` and `npm run smoke` before promising renders; without a usable GPU the render scripts switch to software rendering automatically (`.gl-mode` = `swangle`, very slow), so tell the buyer once that renders on this computer will take much longer. Treat references as art direction plus proven technique, never as a guarantee of a specific result. (Internal status — do not recite to buyers; see "Begin with a guided conversation".) Buyer-facing guides live next to this file: README.md, START_HERE.md, INSTALLATION_GUIDE.md, USER_GUIDE.md, EXAMPLE_PROMPTS.md, BRAND_KIT.md, TROUBLESHOOTING.md, LICENSE.md, LICENSE_AND_REQUIREMENTS.md — read TROUBLESHOOTING.md when the buyer reports a problem.

## Begin with a guided conversation

Make the default experience feel like a helpful creative assistant speaking to a buyer, never a developer-facing QA report. Read [references/guided-brief.md](references/guided-brief.md) when a user starts with an incomplete request (for example, "Aku mau bikin animasi") or asks for help choosing a style.

- **Use friendly Indonesian by default**, even when the user's short prompt is in English. Switch only when the user explicitly asks. No jargon, prompt templates or command-line details in conversational replies.
- Ask **one useful question at a time** and skip questions already answered. When a style obviously fits, select it quietly and move to the VO question. Ask about style only when genuinely different directions fit or the user wants options. Use defaults for duration, format and mood.
- **Keep internal development notes internal.** Never volunteer registry entries, demo approvals, release gates, test results, version numbers or file names in normal onboarding. Answer honestly when asked about reliability or a missing capability; never guarantee results. Explain concrete blockers before committing time/resources.
- Resolve the **voice-over checkpoint** before storyboard, look development or animation: supplied VO, or music/SFX-only. If VO is chosen, get and measure the real file before locking shot lengths (guided brief › VO flow).
- If the user asks to see all styles, describe them briefly across the 5 industrial pillars.
- Before substantial work, recap the brief in 3–5 short lines and ask one confirmation. Do not install software or change files because of initial interest alone.
- A complete brief goes straight to the production contract; continue through preview and revisions in chat.

## Audira Motion Intelligence: Reference-Driven Pipeline & Style DNA Library

Follow the 5-step Motion Intelligence pipeline (`core/`):
1. **01. Visual Reference Analyzer** ([core/reference-analyzer.md](core/reference-analyzer.md)): Deconstructs reference images/videos into layout, anatomy, geometry, materials, lighting, and motion cadence.
2. **02. Visual DNA Extractor & Style Lock** ([core/visual-dna-extractor.md](core/visual-dna-extractor.md), [core/style-lock-engine.md](core/style-lock-engine.md)): Serializes visual parameters into structured `dna.json` and locks character seed/palette to prevent hallucination.
3. **03. Motion & Camera Director** ([core/motion-director.md](core/motion-director.md), [core/camera-director.md](core/camera-director.md)): Choreographs 5-beat storyboards, spring physics, and optical 9:16 safe-zone framing (1080×1920).
4. **04. AI Motion Generator & Workflows** ([core/ai-motion-generator.md](core/ai-motion-generator.md), [workflows/](workflows/)): Compiles executable code for Remotion/Three.js or structured generative prompts for Kling AI 1.5, Runway Gen-3, and Midjourney v6.
5. **05. Visual Quality Control & QA Gates** ([core/visual-qa.md](core/visual-qa.md), [qa/](qa/)): Enforces the 5-point quality scorecard, SSIM character continuity, and broadcast audio compliance (-14 LUFS).

### Modular Style DNA Library (`styles/`)
Never load all styles into a single prompt. Load only the specific modular DNA files needed for the task:
- `styles/<style>/style.md` (Aesthetic essence, palette, positive/negative anchors)
- `styles/<style>/geometry.md` (Mesh archetypes, bevels, poly budget, silhouette)
- `styles/<style>/materials.md` (PBR roughness, metalness, clearcoat, normals)
- `styles/<style>/lighting.md` (Studio rig, key/fill/rim kelvin & intensity)
- `styles/<style>/camera.md` (Focal length, FOV, DOF, motion constraints)
- `styles/<style>/motion.md` (Framerate, spring physics, gesture choreography)
- `styles/<style>/dna.json` (Machine-readable JSON manifest)

Production Workflows:
- [Reference-to-Video](workflows/reference-to-video.md) (Replicate style from URL/image)
- [Text-to-Video](workflows/text-to-video.md) (Script to 5-beat film)
- [Image-to-Video](workflows/image-to-video.md) (Animate static product/art into 3D)
- [Audio-to-Video](workflows/audio-to-video.md) (VO & musical beat synchronization)
- [Multi-Scene Continuity](workflows/multi-scene-continuity.md) (Cross-cut asset persistence)

Narrative & Storyboard Recipes (`recipes/`):
- [Problem - Agitation - Solution (15s Hook)](recipes/recipe-pas-15s.md)
- [Exploded Teardown & Internal Mechanics (30s)](recipes/recipe-exploded-teardown-30s.md)
- [Historical Object Evolution Timeline (45s)](recipes/recipe-historical-evolution-45s.md)
- [Storybook Parable & Philosophical Short (60s)](recipes/recipe-storybook-parable-60s.md)
- [Game Dev & AI Coding Hustle (30s Code-to-Life)](recipes/recipe-ai-tutorial-hustle-30s.md)

Multi-Model Prompt Compilers (`adapters/`):
- [Kling AI 1.5 Professional Adapter](adapters/adapter-kling.md)
- [Runway Gen-3 Alpha Adapter](adapters/adapter-runway-gen3.md)
- [Midjourney v6.1 & Niji 6 Still Adapter](adapters/adapter-midjourney-v6.md)
- [Luma Dream Machine Transition Adapter](adapters/adapter-luma-dream.md)
- [Remotion + React Three Fiber Direct Code Adapter](adapters/adapter-remotion-r3f.md)

Audio & Sound Design Engine (`audio/`):
- [Foley & Sound Effects Catalog](audio/sfx-catalog.md)
- [Audio-Clock & Silence Synchronization](audio/audio-clock-sync.md)
- [Dynamic Ducking & Bus Balancing (-14dB)](audio/dynamic-ducking-rules.md)
- [Mastering & EBU R128 (-14 LUFS) Protocol](audio/mastering-ebu-r128.md)

Retention & Viral Hook Engine (`growth/`):
- [50+ Visual & Auditory Hook Database](growth/hook-database.md)
- [9:16 Vertical Safe-Zone Mask Standard](growth/safe-zone-overlay.md)
- [5-Platform Social Copywriting Matrix](growth/social-copywriting-matrix.md)

Procedural GLSL Shader Library (`shaders/`):
- [Halftone Ben-Day Dots](shaders/halftone-ben-day.glsl)
- [Frosted Glass Dispersion & Caustics](shaders/frosted-glass-dispersion.glsl)
- [Clay Stipple & Thumbprint Normal](shaders/clay-stipple-normal.glsl)
- [Retro CRT Scanlines & Screen Curvature](shaders/crt-scanline-phosphor.glsl)
- [Sci-Fi Hologram Fresnel & Elevation Scan Beam](shaders/hologram-fresnel-scan.glsl)

Quality Assurance Gates:
- [Visual Checklist](qa/visual-checklist.md)
- [Consistency Check](qa/consistency-check.md)
- [Render Validation](qa/render-validation.md)

## Style selection

Read [references/style-registry.md](references/style-registry.md) first, then **only** the selected style reference plus [references/quality-gates.md](references/quality-gates.md), to avoid blending aesthetics.

| Style | Reference | Kit in this skill |
| --- | --- | --- |
| PIXELSTORY | [pixelstory.md](references/pixelstory.md) | `kits/pixelstory` (+ fonts in `public/`) |
| VOXELVERSE | [voxelverse.md](references/voxelverse.md) | `kits/voxelverse` |
| PRECISION | [precision.md](references/precision.md) | `kits/precision` (plus shared studio & post core) |
| PAPERWORLD | [paperworld.md](references/paperworld.md) | `kits/paperworld` |
| INNERWORKS | [innerworks.md](references/innerworks.md) | `kits/innerworks` |
| WORLDFORGE | [worldforge.md](references/worldforge.md) | `kits/worldforge` |
| TIMEFORGE | [timeforge.md](references/timeforge.md) | `kits/timeforge` |
| BUILDFORGE | [buildforge.md](references/buildforge.md) | `kits/buildforge` (+ `scripts/buildforge-check.ts`) |
| CYBERFORGE | [cyberforge.md](references/cyberforge.md) | `kits/cyberforge` |
| DRAFTFORGE | [draftforge.md](references/draftforge.md) | `kits/draftforge` |
| CLAYWORLD | [clayworld.md](references/clayworld.md) | `kits/clayworld` |
| POLYVERSE | [polyverse.md](references/polyverse.md) | `kits/polyverse` |
| TOONFORGE | [toonforge.md](references/toonforge.md) | `kits/toonforge` |
| GLASSCRAFT | [glasscraft.md](references/glasscraft.md) | `kits/glasscraft` |
| NANOFORGE | [nanoforge.md](references/nanoforge.md) | `kits/nanoforge` |
| INKSTORY | [inkstory.md](references/inkstory.md) | `kits/inkstory` |
| LIDARFORGE | [lidarforge.md](references/lidarforge.md) | `kits/lidarforge` |
| CIRCUITFORGE | [circuitforge.md](references/circuitforge.md) | `kits/circuitforge` |
| BRICKCRAFT | [brickcraft.md](references/brickcraft.md) | `kits/brickcraft` |
| URBANFORGE | [urbanforge.md](references/urbanforge.md) | `kits/urbanforge` |
| ISOCRAFT | [isocraft.md](references/isocraft.md) | `kits/isocraft` |
| VINTAGEFORGE | [vintageforge.md](references/vintageforge.md) | `kits/vintageforge` |
| BRUTALFORGE | [brutalforge.md](references/brutalforge.md) | `kits/brutalforge` |
| THERMALFORGE | [thermalforge.md](references/thermalforge.md) | `kits/thermalforge` |
| CHALKCRAFT | [chalkcraft.md](references/chalkcraft.md) | `kits/chalkcraft` |
| KINTSUGI | [kintsugi.md](references/kintsugi.md) | `kits/kintsugi` |
| RETROWAVE | [retrowave.md](references/retrowave.md) | `kits/retrowave` |
| TEXTVOYAGE | [textvoyage.md](references/textvoyage.md) | `kits/textvoyage` |
| AUDIRABOT | [audirabot.md](references/audirabot.md) | `kits/audirabot` |
| DEVFORGE | [devforge.md](references/devforge.md) | `kits/devforge` |
| TOYDIORAMA | [toydiorama.md](references/toydiorama.md) | `kits/toydiorama` |
| FILMNOIR | [filmnoir.md](references/filmnoir.md) | `kits/filmnoir` |
| WATERCOLOR | [watercolor.md](references/watercolor.md) | `kits/watercolor` |
| FLUIDFORGE | [fluidforge.md](references/fluidforge.md) | `kits/fluidforge` |
| HD2D | [hd2d.md](references/hd2d.md) | `kits/hd2d` |
| MEMPHISDIORAMA | [memphisdiorama.md](references/memphisdiorama.md) | `kits/memphisdiorama` |
| DATAPHYSICAL | [dataphysical.md](references/dataphysical.md) | `kits/dataphysical` |
| SATELLITEBRIEFING | [satellitebriefing.md](references/satellitebriefing.md) | `kits/satellitebriefing` |
| BACKROOMS | [backrooms.md](references/backrooms.md) | `kits/backrooms` |
| VISUALINVESTIGATION | [visualinvestigation.md](references/visualinvestigation.md) | `kits/visualinvestigation` |
| TRADINGTERMINAL | [tradingterminal.md](references/tradingterminal.md) | `kits/tradingterminal` |
| HISTORYMAP | [historymap.md](references/historymap.md) | `kits/historymap` |
| ISLAMICDOCUMENTARY | [islamicdocumentary.md](references/islamicdocumentary.md) | `kits/islamicdocumentary` |
| MISTISFORGE | [mistisforge.md](references/mistisforge.md) | `kits/mistisforge` |
| FOODFORGE | [foodforge.md](references/foodforge.md) | `kits/foodforge` |
| TACTICBOARD | [tacticboard.md](references/tacticboard.md) | `kits/tacticboard` |
| WAYANGFORGE | [wayangforge.md](references/wayangforge.md) | `kits/wayangforge` |
| DISASTERSIM | [disastersim.md](references/disastersim.md) | `kits/disastersim` |
| SCALEFORGE | [scaleforge.md](references/scaleforge.md) | `kits/scaleforge` |
| SATISFYFORGE | [satisfyforge.md](references/satisfyforge.md) | `kits/satisfyforge` |
| COMICFORGE | [comicforge.md](references/comicforge.md) | `kits/comicforge` |
| ABYSSFORGE | [abyssforge.md](references/abyssforge.md) | `kits/abyssforge` |
| RISOFORGE | [risoforge.md](references/risoforge.md) | `kits/risoforge` |
| Y2KCHROME | [y2kchrome.md](references/y2kchrome.md) | `kits/y2kchrome` |
| FELTCRAFT | [feltcraft.md](references/feltcraft.md) | `kits/feltcraft` |
| ANATOMIX | [anatomix.md](references/anatomix.md) | `kits/anatomix` |
| UKIYOFORGE | [ukiyoforge.md](references/ukiyoforge.md) | `kits/ukiyoforge` |
| STAINEDGLASS | [stainedglass.md](references/stainedglass.md) | `kits/stainedglass` |
| SULAMFORGE | [sulamforge.md](references/sulamforge.md) | `kits/sulamforge` |
| MOSAICFORGE | [mosaicforge.md](references/mosaicforge.md) | `kits/mosaicforge` |
| MARBLEMUSEUM | [marblemuseum.md](references/marblemuseum.md) | `kits/marblemuseum` |
| TERRARIUM | [terrarium.md](references/terrarium.md) | `kits/terrarium` |
| SKETCHFORGE | [sketchforge.md](references/sketchforge.md) | `kits/sketchforge` |
| DREAMCORE | [dreamcore.md](references/dreamcore.md) | `kits/dreamcore` |
| GACHAREVEAL | [gachareveal.md](references/gachareveal.md) | `kits/gachareveal` |
| ARCADECRT | [arcadecrt.md](references/arcadecrt.md) | `kits/arcadecrt` |
| MANUSCRIPT | [manuscript.md](references/manuscript.md) | `kits/manuscript` |
| GLITCHFORGE | [glitchforge.md](references/glitchforge.md) | `kits/glitchforge` |

Infer the style from the idea and describe the look in one sentence; do not make the buyer learn style names. PIXELSTORY = 2.5D pixel-art characters; VOXELVERSE = voxel miniature worlds; PRECISION = one product's premium CGI/exploded view; PAPERWORLD = handcrafted paper diorama stories; INNERWORKS = opening a machine to show how it works; WORLDFORGE = exploring a whole 3D environment/world; TIMEFORGE = **one object physically evolving through dated eras**; BUILDFORGE = **a structure assembled piece by piece**; CYBERFORGE = **holographic sci-fi 3D, cyber wireframe & HUD telemetry**; DRAFTFORGE = **architectural CAD blueprints, dimensional callouts & technical schematics**; CLAYWORLD = **tactile stop-motion claymation & plasticine diorama stories**; POLYVERSE = **faceted low-poly minimalist worlds & floating island dioramas**; TOONFORGE = **cel-shaded 3D anime, ink contours & manga speed lines**; GLASSCRAFT = **spatial glassmorphism, refractive liquid prisms & VisionOS acoustics**; NANOFORGE = **microscopic molecular biology, DNA double-helix & Cryo-EM nanotech**; INKSTORY = **East Asian ink wash, Shan Shui misty mountains & zen calligraphy**; LIDARFORGE = **3D point cloud aerial survey, laser scanning & elevation bathymetry**; CIRCUITFORGE = **3D PCB electronics, SMT microchips & copper electron streams**; BRICKCRAFT = **tactile plastic bricks, interlocking stud geometry & tabletop macro stop-motion**; URBANFORGE = **architectural white massing model, real sun shadow studies & projected data layers**; ISOCRAFT = **isometric comic hand-inked machine, flat shadows & see-through mechanism**; VINTAGEFORGE = **Da Vinci antique manuscript, sepia parchment & copperplate engraving**; BRUTALFORGE = **3D Neo-Brutalism pop, hard unblurred drop-shadows & electric neon strobe**; THERMALFORGE = **FLIR infrared thermal heatmap, Ironbow spectrum & hotspot telemetry**; CHALKCRAFT = **quantum blackboard, dusty 3D chalk lines & theoretical physics**; KINTSUGI = **wabi-sabi matte porcelain, organic cracks & glowing liquid gold seams**; RETROWAVE = **80s synthwave, neon horizon grid & CRT scanlines**; TEXTVOYAGE = **spatial giant 3D kinetic typography & architectural monolith flight**; AUDIRABOT = **flagship 3D robot mascot companion, OLED emotive visor, plasma levitation & gesturing arm**; DEVFORGE = **3D spatial IDE, typewriter code stream, gamedev asset spawning & hustle metrics**; TOYDIORAMA = **commercial stylized 3D toy diorama, blocky characters, theatrical wooden stage, footlights & taped paper annotations**; FILMNOIR = **classic 1940s film noir, chiaroscuro contrast, wet street & venetian blinds shadows**; WATERCOLOR = **European children's tale, 3D cold-press paper diorama & soft watercolor washes**; FLUIDFORGE = **abstract fluid motion, zero-gravity ferrofluid & iridescent liquid chrome**; HD2D = **Octopath-style 2D pixel sprites in a physically lit 3D tilt-shift diorama with warm 2400K lanterns**; MEMPHISDIORAMA = **1980s Ettore Sottsass architectural tabletop model, terrazzo base & hard cool-purple shadows**; DATAPHYSICAL = **tactile 3D data physicalization, stacked aluminum & brass sculptures on walnut plinths**; SATELLITEBRIEFING = **3D satellite & OSINT geospatial reconnaissance with orbital zoom and amber reticles**; BACKROOMS = **liminal 3D yellow corridors, buzzing fluorescent tubes & 90s VHS camcorder found footage**; VISUALINVESTIGATION = **forensic courtroom desk, labeled speaker floorplan, archival document highlighter & Mute-Test clock**; TRADINGTERMINAL = **institutional financial terminal, procedural candlesticks, order book depth wall & live price lasers**; HISTORYMAP = **geopolitical & war history documentary map, dynamic territorial shifts & tactical pincer arrows**; ISLAMICDOCUMENTARY = **folk Islam & Islamic golden age, sacred 8-point stars, grand dome silhouettes & acoustic oud**. MISTISFORGE = **nusantara folk horror: foggy kampung night, pelita lamps, banyan roots & a suggestive pale presence**. FOODFORGE = **macro food commercial: slow-motion ingredient drops, backlit steam, glossy drips on dark walnut**. TACTICBOARD = **3D football tactics board, puck tokens, draw-on passing lanes & goal replay**. WAYANGFORGE = **wayang kulit: perforated leather puppets, glowing kelir, blencong lamp & batik stage, colour side to shadow side**. DISASTERSIM = **calm geohazard cross-section: subduction slip, seismic rings, shoaling tsunami & warning ramp**. SCALEFORGE = **continuous log zoom-out ant to Sun on a re-decading ruler, studio to deep space**. SATISFYFORGE = **oddly-satisfying pastel studio loops: sand slicing, exact liquid fill, perfect-fit drops**. COMICFORGE = **western comic book 3D: halftone cel shading, ink hulls, panel flythrough & onomatopoeia**. ABYSSFORGE = **bioluminescent deep-sea descent, marine snow & sonar depth HUD**. RISOFORGE = **risograph zine print: spot-ink multiply overprint, halftone grain & pop-up paper layers**. Y2KCHROME = **y2K / Frutiger-aero liquid chrome blobs, iridescent bubbles and aqua skies**. FELTCRAFT = **needle-felted wool & stitched fabric diorama, stop-motion on twos**. ANATOMIX = **stylised translucent heart, red/blue blood flow, clinical teal hologram & leader-line labels**. UKIYOFORGE = **ukiyo-e woodblock print as layered 3D washi sheets: claw-foam waves, mountain, boats, flat ink & key-lines**. STAINEDGLASS = **stained-glass leadlight window assembling, sun casting jewel light pools on stone**. SULAMFORGE = **macro embroidery & tenun songket: satin stitches growing stitch by stitch in a hoop, gold threads catching light**. MOSAICFORGE = **thousands of instanced tesserae raining down and settling into a mosaic image**. MARBLEMUSEUM = **classical marble bust in a skylit museum gallery with wall-label card**. TERRARIUM = **living glass-jar terrarium, refractive glass, moss & ferns, day-night cycle, macro orbit**. SKETCHFORGE = **pencil sketch to 3D: graphite lines extrude to wire, clay, colour and lift off the page**. DREAMCORE = **pastel dreamcore: pool room, clouds indoors, floating doors, stairs to nowhere**. GACHAREVEAL = **capsule burst & holographic card reveal with blue→purple→gold rarity escalation**. ARCADECRT = **arcade cabinet & curved CRT, camera dives through the glass into a voxel game world**. MANUSCRIPT = **illuminated codex & Balinese-style lontar by candlelight: gleaming gold-leaf initial, quill-written ink, fanning palm leaves**. GLITCHFORGE = **glitch art & datamosh: a clean studio render corrupts (RGB split, blocks, pixel sort, no signal) then snaps back**. Prefer TIMEFORGE over PRECISION when changes between historical designs are the story; WORLDFORGE for inhabited environments; BUILDFORGE when construction itself is the subject; INNERWORKS for how a finished machine works inside; CYBERFORGE for futuristic technology, quantum computing, AI cores, cybersecurity, and sci-fi telemetry; DRAFTFORGE for engineering blueprints, CAD schematics, patent breakdowns, and architectural drawings; CLAYWORLD for charming, tactile, organic stop-motion character storytelling and diorama miniature worlds; POLYVERSE for minimalist polygonal nature, floating sanctuary islands, and pastel zen landscapes; TOONFORGE for high-energy mecha action, Japanese anime aesthetics, comic book speed lines, and ink-outlined character craft; GLASSCRAFT for luxury spatial computing interfaces, floating frosted glass cards, refractive liquid droplets, and iridescent optics; NANOFORGE for medical science, virology, genetic DNA sequencing, cellular vesicles, and microscopic drug delivery; INKSTORY for Asian calligraphy, misty mountain landscapes, traditional philosophy, tea culture, martial arts legends, and meditative ink paintings; LIDARFORGE for drone aerial surveying, archaeological terrain scans, autonomous vehicle vision, and point cloud geology; CIRCUITFORGE for microchip semiconductors, motherboard hardware, CPU/GPU architecture, and electric current flows; BRICKCRAFT for toy building assembly, playful startup pivots, and tabletop macro storytelling; URBANFORGE for smart cities, urban planning, real estate development, and solar shadow analysis; VISUALINVESTIGATION when reconstructing courtroom proceedings, legal timelines, or investigative dossiers with mandatory Mute-Test verification; TRADINGTERMINAL for finance, crypto trading, market technical analysis, and stock breakdowns; HISTORYMAP for geopolitical conflicts, empire history, and war battle maps; ISLAMICDOCUMENTARY for Islamic civilization history, prophetic parables, and sacred architectural heritage.

**Outside the product's scope (STRICT ROUTING RULE):** flat 2D explainers, infographics/data charts, kinetic-typography-only videos, slideshow edits of photos, live-action editing, talking heads, **courtroom proceedings, political debates, investigative journalism, and human conflict trials**. For news, legal debates, or politics involving real figures (e.g. trials, political figures, sourced journalism), **DO NOT force `audira-motion` or abstract 3D metaphors** (gears, floating boxes, disembodied gloves). Instead, route immediately to **`audira-video-motion-graphic` + `media-use` + `hyperframes`** to display real photos, labeled courtroom maps, sourced news clippings, and legible quotes. Use `audira-motion` in such briefs ONLY as a 3–5 second technical forensic cutaway (e.g. 3D Error Level Analysis or digital photo forensics). If the brief does not fit 3D objects, say kindly and firmly that it is not the right tool rather than forcing a style. Enforce the **Mute Test** (`qa/visual-checklist.md`): if the viewer cannot tell who is speaking on mute, the composition is rejected.

**Preview rounds (the one expectation you do set).** Every new idea is an original film, so say once, in one plain Indonesian sentence, that the first preview usually gets one or two rounds of refinement before the final (buyers see the same in START_HERE.md); for PRECISION and INNERWORKS, which have no dedicated engine, plan for the second round from the start. Do not repeat it or turn it into a technical report.

Never promise features a reference lists as unsupported (e.g. WORLDFORGE has no water/forest/animal/crowd systems; BUILDFORGE rules fit simple orthogonal buildings; construction animation is not engineering instruction; future designs are speculative).

## Setup and the production kit

Read [references/production-kit.md](references/production-kit.md) before writing code and [references/setup.md](references/setup.md) before the first render on a machine. In short:

1. Inspect the current folder. If there is no suitable Audira project, ask permission, then copy `SKILL_DIR/starter/` into a new folder, plus the chosen style's kit: `kits/<style>/src/` into `src/` (and `kits/pixelstory/public/` into `public/`, `kits/buildforge/scripts/` into `scripts/`). Read that kit's `KIT.md`; on the first project on a machine, register the kit's example as a composition and check its stills once before building the buyer's film. `SKILL_DIR` is the folder containing this file.
2. `npm ci`, `npm run check-env`, then `npm run smoke` and **look at** `out/smoke/_sheet.jpg`. Do not plan or promise renders until the smoke stills are correct. First setup downloads ≈370 MB of packages and ≈170 MB headless Chrome (≈1.2 GB on disk per project after the first render, plus a bundler cache in `node_modules/.cache` that can grow past 1 GB and is safe to delete) — tell the buyer once, in plain words, and ask.
3. Build the film on `src/core` (camera tracks, rig, post chain, studio or outdoor stage, materials, slab/lathe geometry, overlay + projector, VO). Reuse kit engines; never copy a demo's story, cast, product or geometry.
4. Use `npm run vo -- <audio>` for real VO timing; write cut keys in VO seconds.
5. Previews: `npx remotion render <Preview> …`; finals: `npm run render:final -- --comp=<Final> --out=… --vo=… --offset=…` (segmented, restartable, −14 LUFS master).

## Production contract

1. **Inspect** the project and inputs; preserve unrelated files. Scaffold from the starter only with permission.
2. **Brief:** message, audience, duration, style, one visual idea. Defaults: 9:16; preview 540×960 @ 30 FPS; final 1080×1920 @ 60 FPS; bright, readable art direction.
3. **VO decision (required):** (a) VO chosen and a readable file received, or (b) music/SFX-only explicitly chosen. Never add a synthetic narrator by default.
4. **Audio-led timing:** use the measured duration, pauses and phrases; choose the VO offset per recording (never reuse a demo's offset). If the desired length conflicts with the audio, explain and ask; never speed up, pitch-shift or trim narration silently.
5. **Direct:** concise treatment, object/character sheet, palette, shot list, transitions, strongest final image, cause and effect.
6. **Look development:** after confirmation, a 3–5 s render of the highest-risk element. Inspect stills against `references/quality-bar/<style>.jpg`; iterate until the same quality class.
7. **Preview:** the whole film when it is 20 s or shorter, otherwise a representative 15–20 s section (or the full VO length when requested), at 540×960 @ 30. Inspect stills at every important beat and transition midpoint; scan the MP4 for popping. Ask for approval before the final.
8. **Final:** 1080×1920 @ 60 MP4, VO muxed at its offset, audio −14 LUFS integrated, true peak below −1 dBFS. Verify with ffprobe, silencedetect sync against the source, and frames extracted from the MP4.
9. **Determinism:** everything from `useCurrentFrame()`/`useVideoConfig()`; `ThreeCanvas` from `@remotion/three`; no independent `useFrame` animation, wall clocks, unseeded randomness or CSS autoplay.
10. **Report** honestly what was verified, what was not, and how to reproduce; never claim a file exists without checking.

## How users invoke the skill

`/audira-motion` (or alias `/voynann-motion`) followed by an ordinary request, for example:

> `/audira-motion Aku mau bikin video evolusi televisi dari TV tabung sampai TV tipis sekarang.`

> `/audira-motion Aku mau video yang memperlihatkan cara kerja kipas angin, bagian dalamnya kelihatan. Aku punya VO MP3.`

> `/audira-motion Buat dunia 3D kota pertama di bulan yang bisa dijelajahi kamera. VO-nya menyusul.`

> `/audira-motion Bikin iklan 3D premium untuk botol minum fiktif, close-up material dan bagian-bagiannya terpisah lalu menyatu lagi.`

> `/audira-motion Cerita pendek kertas tentang tukang kebun kecil yang mengembalikan warna ke kota kertas. Musik saja.`

> `/audira-motion Buat animasi hologram 3D inti kuantum AI dengan lingkaran telemetri HUD berputar dan grid neon siber. Musik saja.`

> `/audira-motion Bikin video skema cetak biru (blueprint) 3D mesin turbojet pesawat, garis ukuran dimensi presisi lalu meledak terurai (exploded view). Ada VO MP3.`

> `/audira-motion Buat cerita animasi stop-motion plastisin/tanah liat (claymation) tentang monster kecil yang melompat kenyal di dunia jamur dan melambaikan tangan. Musik saja.`

> `/audira-motion Buat animasi 3D pulau melayang low-poly minimalis dengan pohon pinus bergoyang, sungai faset berkilau, dan pencahayaan fajar pastel ala Monument Valley. Musik santai.`

> `/audira-motion Buat video aksi 3D anime cel-shaded robot mecha tempur meluncur cepat dengan garis kecepatan manga (speed lines), semburan plasma, dan hentakan kamera snap-zoom. Musik saja.`

> `/audira-motion Buat animasi spatial computing elegan dengan kartu kaca buram (frosted glass) melayang, pembiasan prisma cahaya pelangi, tetesan cairan kristal optik, dan UI visionOS minimalis. Musik ambient modern.`

> `/audira-motion Buat video sains mikroskop elektron 3D heliks ganda DNA bersinar dengan pasangan basa adenin-timin berputar, vesikel sel berdenyut lembut, dan partikel sitoplasma melayang. VO medis MP3.`

> `/audira-motion Bikin lukisan kaligrafi tinta Cina (Sumi-e) 3D di atas kertas beras tua dengan pegunungan berkabut Shan Shui, sapuan kuas yang mengalir, dan stempel cap merah cinnabar. Musik kecapi guzheng santai.`

> `/audira-motion Buat animasi survei udara drone LiDAR 3D dengan ribuan titik awan data (point cloud) berketinggian warna, tirai pemindai laser menyapu lembah, dan telemetri GPS WGS84 presisi. Musik synth ambient.`

> `/audira-motion Bikin video makro 3D motherboard sirkuit PCB dengan jalur tembaga presisi, prosesor silikon BGA, dan aliran pulsa arus listrik amber meluncur masuk ke inti chip. Musik elektronik modern.`

> `/audira-motion Buat animasi stop-motion 3D balok mainan plastik (brick toy) di atas meja kayu, potongan balok terbang dan snap presisi membentuk rumah kecil, ada karakter mini melangkah ceria. Musik riang marimba.`

> `/audira-motion Bikin video maket arsitektur putih monokrom (white model) kota futuristik di atas meja obsidian, cahaya matahari bergerak memanjang bayangan gedung, lalu lapisan data zonasi kota diproyeksikan dengan cahaya cyan. Musik orkestra modern tenang.`

> `/audira-motion Maskot 3D robot Audira-Bot melayang ramah di studio futuristik, mata visor OLED berkedip dan tangan menunjuk judul materi presentasi. Musik futuristik upbeat.`

> `/audira-motion Bikin video edukasi cara buat game Roblox pakai AI, layar kode 3D melayang mengetik otomatis lalu koin dan karakter 3D melompat keluar ke depan layar. Musik lo-fi upbeat.`

> `/audira-motion Buat animasi 3D toy diorama panggung teater miniatur dengan karakter mainan blocky lucu melambaikan tangan, lampu footlight kayu hangat menyala, dan catatan label kertas berselotip. Musik santai ceria.`

> `/audira-motion Buat video sinematik detektif film noir 1940-an di lorong kota berkabut hujan, bayangan tirai venetian blinds di dinding bata dan siluet jas trench coat. Musik jazz moody sax.`

> `/audira-motion Buat animasi buku dongeng anak bergaya cat air Eropa (watercolor storybook) dengan bukit pastel lembut, pohon ek bergoyang, dan karakter beruang kecil melambai. Musik akustik hangat.`

Never require the buyer to understand internal files or paste a template prompt. Experience: install once, describe an idea, answer a few simple questions, confirm, approve setup, preview, refine, render.

## Brand kit

If the buyer attaches or keeps an `audira-brand.json` or `voynann-brand.json` (format: `BRAND_KIT.md`), copy it into the project as `src/brand.json`
(and any logo into `public/brand/`) and use `src/core/type/brand.ts`: `brandName()` for title/kicker/end-card text, the
handle and CTA in the closing overlay, and `brandAccent(background, styleColour)` for overlay labels and highlights (it
falls back to the style colour when contrast is too low). Keep the 3D world in the style's art direction unless the buyer
asks for brand colours in the scene; never extrude or animate a logo in 3D unless asked. Without a kit, stay brand-neutral.
If the buyer asks you to create a kit, write `audira-brand.json` from their words (hex colours) in the working folder.

## Output expectations

- Original Remotion project source (organised, configurable text/duration/palette where sensible).
- Preview and final MP4 when rendering succeeds, with their locations.
- Berkas `SOCIAL_CAPTIONS.md` dan **tampilan langsung teks caption siap pakai di respons akhir chat** untuk 5 platform utama: (1) TikTok, (2) Instagram Reels, (3) YouTube Shorts, (4) Facebook Trend, dan (5) X (Twitter).
- A short note of what was verified, what remains unverified and how to reproduce.
- No downloads from untrusted URLs; ask permission for installs and large downloads; original or licensed assets only (fonts, music, VO, models).

## Commercial License & Protection

Audira Skill Motion is proprietary commercial software authored by **AUDIRA (Agus Dwi R)**. Buyers are granted a non-exclusive license to render unlimited commercial and personal videos. Resale, sublicensing, unauthorized distribution, public repository uploads, or extraction of prompt engines and 3D kits is strictly prohibited. See `LICENSE.md` for full legal terms.

## Never edit the installed skill

Do not modify, add or delete files inside `SKILL_DIR` during a buyer session: the installed skill may be read-only or synced from the buyer's Claude account, and it must stay identical for every project. Keep project-specific learnings (what worked, failure modes, chosen VO offsets) in the buyer's project folder, for example `NOTES.md`, never in the style references or the registry.

## Where videos can be made

Rendering needs a local Claude Code session (the Code tab of the Claude desktop app, or the `claude` terminal) on the buyer's own computer with Node.js. A plain claude.ai chat cannot install packages or render these videos; if the buyer is there, explain kindly and point to INSTALLATION_GUIDE.md.
