# CYBERFORGE — Style 09: holographic 3D, HUD telemetry & cyber wireframes

**In this package:** the holographic sci-fi engine in `kits/cyberforge/` (procedural 3D telemetry rings, rotating gimbals, targeting brackets, infinite cyber grid floor, upward data streams, holographic wireframe and faceted crystal materials, 3-act cinematic camera rig, and 2D tactical HUD overlay) with an 8 s quantum-core example; see `kits/cyberforge/KIT.md`.

## Which briefs belong here?

Automatically select CYBERFORGE for briefs involving:
- "Teknologi masa depan / sci-fi / kecerdasan buatan (AI)"
- "Visualisasi quantum computing, data matrix, atau sistem neural"
- "Hologram 3D, wireframe bersinar, dan antarmuka HUD militer/taktis"
- "Sistem keamanan siber (cybersecurity), blockchain, atau arsitektur satelit luar angkasa"
- "Animasi robotik canggih dengan kalibrasi sensor dan targeting reticle"

Describe the look in friendly Indonesian: *"Gaya hologram 3D futuristik dengan wireframe neon bercahaya, lingkaran telemetri HUD yang berputar, dan lantai grid cyber."*

## Signature visual and narrative grammar

- **True 3D Holographic Optics:** Objects possess depth, internal energy crystals, outer wireframe cages, and counter-rotating gimbal rings. Rendered with additive blending, faceted transmission, and Fresnel edge emission.
- **Deep Void Background:** The background is an ultra-deep space void (`#04060d`), ensuring intense contrast on OLED mobile screens and eliminating washed-out daylight distractions.
- **Concentric Telemetry Rings:** Precision-ticked circular HUD rings rotating at discrete deterministic rates around the subject, complete with degree ticks and cardinal notch gaps.
- **Tactical Lock-On Brackets:** 3D corner brackets that track the hero object and snap inward as targeting lock reaches 100%, accompanied by status color shifts (Cyan → Alert Magenta).
- **Infinite Perspective Cyber Grid:** An expansive floor grid on the X-Z plane with radial radar/scanline pulses expanding outwards.
- **2D Screen-Space HUD Overlay:** High-tech monospace readouts (frame counter, timecode, azimuth, elevation, flux frequency, and 9:16 mobile crop brackets).

## Act structure that works (8–20s films)

1. **Boot & Calibration (0–25%):** Dark void awakens with an expanding floor radar pulse; initial low-angle camera glide; inner core starts breathing with subtle energy flicker.
2. **Analysis & Spin-Up (25–65%):** Gyroscope gimbal rings accelerate in counter-rotating directions; HUD telemetry rings expand; upward data streams activate; camera executes a majestic orbital swoop.
3. **Target Lock & Power Climax (65–100%):** Camera locks target; corner reticles clamp tight; status shifts to `TARGET: LOCKED`; core reaches peak emissive radiance and camera settles into a heroic portrait composition.

## Determinism & QA checklist

- **Strict Determinism:** All rotations, particle elevations, pulse waves, and camera trajectories derive purely from `f = (frame / fps) * 60`. No non-deterministic `useFrame` state or unseeded `Math.random()`.
- **Text Legibility:** All HUD overlay text uses high-contrast cyan (`#00f0ff`) or bright white (`#d0f7ff`) on dark backgrounds, strictly inside 9:16 safe areas.
- **Performance:** Additive particles and lines are batched into single buffer geometries; particle counts stay below 2,500 to guarantee smooth 60 FPS playback on all hardware.

