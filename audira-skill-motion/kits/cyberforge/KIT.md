# CYBERFORGE kit — holographic 3D, HUD telemetry & cyber wireframes

Copy `kits/cyberforge/src/` into the project's `src/` (on top of the starter). It adds `src/kits/cyberforge/`
and needs only `remotion`, `@remotion/three`, `@react-three/fiber` and `three` (already present in the starter).

Time runs on **film frames at a 60 fps clock**: compute `const f = (frame / fps) * 60` once and pass `f` to
the camera, HoloCore, CyberGrid, DataStream and Overlay, so the 30 fps preview and the 60 fps final play identically.

| Folder | Content |
|---|---|
| `core/motion.ts` | Deterministic easing (`telemetry`, `camera`, `surge`, `sine`, `quantize`), `clamp`, `remap`, `seg`, and `blink` |
| `core/noise.ts` | Deterministic seeded PRNG, `hash(n)`, `hash2(x, y)`, and digital `glitchJitter(frame, seed)` |
| `lib/palette.ts` | OLED high-contrast sci-fi palette (`cyan`, `electricViolet`, `matrixLime`, `alertMagenta`, `solarAmber`, `voidDeep`) |
| `lib/materials.ts` | `createHoloLineMaterial`, `createHoloMeshMaterial`, `createCyberWireframeMaterial`, `createDataParticleMaterial` |
| `hud/TelemetryRings.tsx` | 3D procedural concentric rotating HUD circles with degree ticks and cardinal gaps |
| `hud/TargetReticle.tsx` | 3D holographic lock-on box and targeting brackets around hero models |
| `world/CyberGrid.tsx` | Perspective floor grid on X-Z plane with radial expanding radar pulse waves |
| `world/HoloCore.tsx` | Hero sci-fi quantum core: faceted energy icosahedron, outer wireframe cage, counter-rotating gimbal gyroscope rings, and energy conduits |
| `world/DataStream.tsx` | Floating quantum data nodes & particles rising along the Y axis |
| `world/Atmosphere.tsx` | Dark void ambient, primary cyan key, electric violet rim backlight, and matrix lime under-glow |
| `camera/rig.ts` | Deterministic 3-act camera pose interpolator (floor glide → rising orbital swoop → locked hero composition) |
| `camera/Overlay.tsx` | Screen-space 2D tactical HUD overlay (coordinates, azimuth/elevation, frame timecode, targeting status, safe area marks) |
| `example/` | `CyberforgeExample` — 8 s: quantum core boot-up, gimbal spin-up, HUD expansion, and target lock-on telemetry payoff |

## Register the example

In `src/Root.tsx`:

```tsx
import { CyberforgeExample, CYBERFORGE_EXAMPLE_SECONDS } from "./kits/cyberforge/example/CyberforgeExample.tsx";

<Composition
  id="CyberforgePreview"
  component={CyberforgeExample}
  durationInFrames={CYBERFORGE_EXAMPLE_SECONDS * preview.fps}
  fps={preview.fps}
  width={preview.width}
  height={preview.height}
/>
```

Then check stills:
`node scripts/stills.mjs out/cyber 0.5s,3.0s,5.5s,7.8s CyberforgePreview`

## Directing a CYBERFORGE film

1. **Hero Object First:** Whether an AI core, robotic limb, quantum satellite, or cyber security mainframe, author the geometry using semi-transparent materials with additive glow.
2. **Gimbal & Telemetry Choreography:** Counter-rotate rings to convey sophisticated robotic calibration. Ticks should quantize or snap to give a precision digital feel.
3. **Contrast & Void:** Maintain a deep black void (`#04060d`) background so neon cyan, electric violet, and lime pop without visual clutter.
4. **Lock-On Climax:** The camera locks, the reticle clamps tight, status flashes `TARGET: LOCKED`, and the core radiates peak emissive power.

## Known Limits
- High emissive scenes with additive blending require dark backgrounds to preserve readability; avoid bright daylight stages.
- Keep particle counts $\le 2500$ for optimal mobile render speeds and software rendering fallbacks.

