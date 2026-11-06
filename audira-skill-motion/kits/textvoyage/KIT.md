# TEXTVOYAGE kit — TEXTVOYAGE kit — Spatial Giant 3D Kinetic Typography & Monoliths

Copy `kits/textvoyage/src/` into the project's `src/` (on top of the starter). It adds `src/kits/textvoyage/`
and needs only `remotion`, `@remotion/three`, `@react-three/fiber` and `three` (already present in the starter).

Time runs on **film frames at a 60 fps clock**: compute `const f = (frame / fps) * 60` once and pass `f` to
the camera, world stage, and overlay so the 30 fps preview and 60 fps final play identically.

| Folder | Content |
|---|---|
| `core/motion.ts` | Deterministic easing and progress helpers |
| `lib/palette.ts` | Official color tokens (abyssBlack, monolithTitanium, volumetricLight, coreAccentGold, horizonMist) |
| `lib/materials.ts` | Shaders and materials factory for TEXTVOYAGE |
| `lib/blockFont.ts` | 5 × 7 block glyphs (A–Z, 0–9, space, hyphen) and `layoutBlocks(text)`; no font files needed |
| `world/MonolithType.tsx` | `MonolithType`: a word built from extruded blocks (one instanced mesh per word) |
| `world/ObjectStage.tsx` | `MonolithGateway`: recycling corridor of titanium/gold gates, polished floor, and two giant `MonolithType` words (prop `words`) that grow as the camera approaches |
| `camera/rig.ts` | 3-act deterministic camera motions |
| `camera/Overlay.tsx` | 2D HUD and typography layer |
| `example/` | `TextvoyageExample` — 8s complete preview composition |

## Register the example in `src/Root.tsx`

```tsx
import { TextvoyageExample, TEXTVOYAGE_EXAMPLE_SECONDS } from "./kits/textvoyage/example/TextvoyageExample";

<Composition
  id="TextvoyagePreview"
  component={TextvoyageExample}
  durationInFrames={TEXTVOYAGE_EXAMPLE_SECONDS * preview.fps}
  fps={preview.fps}
  width={preview.width}
  height={preview.height}
/>
```
