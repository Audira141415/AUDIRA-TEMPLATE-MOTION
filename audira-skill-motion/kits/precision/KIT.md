# PRECISION kit — premium 3D industrial product CMF & exploded view cinematics

Copy `kits/precision/src/` into the project's `src/` (on top of the starter). It adds `src/kits/precision/`
and needs only `remotion`, `@remotion/three`, `@react-three/fiber` and `three` (already present in the starter).

Time runs on **film frames at a 60 fps clock**: compute `const f = (frame / fps) * 60` once and pass `f` to
the camera, ExplodedAssembly, StudioStage and Overlay, so the 30 fps preview and the 60 fps final play identically.

| Folder | Content |
|---|---|
| `core/motion.ts` | Mechanical easing (`smoothStep`, `quinticInOut`, `magneticSnap`, `explodeEase`), `clamp`, `lerp`, `remap`, `seg` |
| `lib/palette.ts` | Industrial CMF palette (`spaceGray`, `anodizedSilver`, `titaniumNatural`, `ceramicGloss`, `copperAccents`, `laserOrange`) |
| `lib/materials.ts` | `createAnodizedAluminiumMaterial`, `createTitaniumMaterial`, `createCeramicClearcoatMaterial`, `createCopperCoreMaterial` |
| `assembly/ExplodedPart.tsx` | Exploded assembly with monotonic axial separation and magnetic latch reassembly |
| `world/StudioStage.tsx` | Overhead softbox illumination, edge kicker lights, and cyclorama shadow floor |
| `camera/rig.ts` | Macro seam inspection → 3/4 orbital exploded reveal → heroic reassembly packshot |
| `camera/Overlay.tsx` | Swiss design typographic callouts, micron tolerances, and CMF engineering badges |
| `example/` | `PrecisionExample` — 8 s industrial earbud reveal, monotonic explode, and magnetic snap reassembly |

## Register the example

In `src/Root.tsx`:

```tsx
import { PrecisionExample, PRECISION_EXAMPLE_SECONDS } from "./kits/precision/example/PrecisionExample.tsx";

<Composition
  id="PrecisionPreview"
  component={PrecisionExample}
  durationInFrames={PRECISION_EXAMPLE_SECONDS * preview.fps}
  fps={preview.fps}
  width={preview.width}
  height={preview.height}
/>
```

