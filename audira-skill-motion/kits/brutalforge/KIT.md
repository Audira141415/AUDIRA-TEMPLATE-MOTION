# BRUTALFORGE kit — BRUTALFORGE kit — 3D Neo-Brutalism Pop & High-Energy Strobe

Copy `kits/brutalforge/src/` into the project's `src/` (on top of the starter). It adds `src/kits/brutalforge/`
and needs only `remotion`, `@remotion/three`, `@react-three/fiber` and `three` (already present in the starter).

Time runs on **film frames at a 60 fps clock**: compute `const f = (frame / fps) * 60` once and pass `f` to
the camera, world stage, and overlay so the 30 fps preview and 60 fps final play identically.

| Folder | Content |
|---|---|
| `core/motion.ts` | Deterministic easing and progress helpers |
| `lib/palette.ts` | Official color tokens (neoYellow, cyberCyan, acidGreen, hotPink, inkBlack, pureWhite) |
| `lib/materials.ts` | Shaders and materials factory for BRUTALFORGE |
| `world/ObjectStage.tsx` | Core 3D visual scene components |
| `camera/rig.ts` | 3-act deterministic camera motions |
| `camera/Overlay.tsx` | 2D HUD and typography layer |
| `example/` | `BrutalforgeExample` — 8s complete preview composition |

## Register the example in `src/Root.tsx`

```tsx
import { BrutalforgeExample, BRUTALFORGE_EXAMPLE_SECONDS } from "./kits/brutalforge/example/BrutalforgeExample";

<Composition
  id="BrutalforgePreview"
  component={BrutalforgeExample}
  durationInFrames={BRUTALFORGE_EXAMPLE_SECONDS * preview.fps}
  fps={preview.fps}
  width={preview.width}
  height={preview.height}
/>
```
