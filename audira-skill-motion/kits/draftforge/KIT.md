# DRAFTFORGE kit — architectural CAD blueprints & technical schematics

Copy `kits/draftforge/src/` into the project's `src/` (on top of the starter). It adds `src/kits/draftforge/`
and needs only `remotion`, `@remotion/three`, `@react-three/fiber` and `three` (already present in the starter).

Time runs on **film frames at a 60 fps clock**: compute `const f = (frame / fps) * 60` once and pass `f` to
the camera, CadModel, DraftingTable, DimensionLine, and Overlay, so the 30 fps preview and the 60 fps final play identically.

| Folder | Content |
|---|---|
| `core/motion.ts` | Deterministic easing (`draft`, `snap`, `pan`, `sine`), `clamp`, `remap`, `seg` |
| `core/noise.ts` | Deterministic seeded PRNG, `hash(n)`, `hash2(x, y)` |
| `lib/palette.ts` | Blueprint tokens (`blueprintNavy`, `gridFine`, `gridMajor`, `cadWhite`, `cadCyan`, `dimensionGold`, `stampCrimson`) |
| `lib/materials.ts` | `createCadLineMaterial`, `createGhostLineMaterial`, `createDimensionLineMaterial`, `createBlueprintMeshMaterial` |
| `cad/DimensionLine.tsx` | 3D technical dimension callout with offset extension lines, measurement span, and arrowheads |
| `cad/CompassRose.tsx` | 3D architectural north arrow and circular degree compass |
| `cad/TitleBlock.tsx` | Standard ISO/ANSI engineering title block drawing stamp |
| `world/DraftingTable.tsx` | Blueprint paper background with millimeter grid divisions (fine and major) and sheet margin borders |
| `world/CadModel.tsx` | Hero technical mechanical assembly with animated CAD line drawing, rotating turbine rotors, and exploded view |
| `camera/rig.ts` | 3-act camera pose interpolator (top-down orthographic draft → isometric projection tilt → exploded assembly hold) |
| `camera/Overlay.tsx` | Screen-space 2D architectural border, coordinate zone markers [E-4], graphic scale bar (1:25), and title block |
| `example/` | `DraftforgeExample` — 8 s: blueprint rollout, vector line drafting, dimension callouts, and exploded assembly reveal |

## Register the example

In `src/Root.tsx`:

```tsx
import { DraftforgeExample, DRAFTFORGE_EXAMPLE_SECONDS } from "./kits/draftforge/example/DraftforgeExample.tsx";

<Composition
  id="DraftforgePreview"
  component={DraftforgeExample}
  durationInFrames={DRAFTFORGE_EXAMPLE_SECONDS * preview.fps}
  fps={preview.fps}
  width={preview.width}
  height={preview.height}
/>
```

Then check stills:
`node scripts/stills.mjs out/draft 0.5s,2.5s,5.0s,7.8s DraftforgePreview`

## Directing a DRAFTFORGE film

1. **Orthographic to Isometric:** Start with a flat top-down or elevation view to establish the 2D blueprint look, then tilt into 3D isometric to deliver the "blueprint springing into 3D life" moment.
2. **Dimension Lines:** Pair key features with dimension lines (`<--- 4.80 m --->` or `Ø 1.60 m`) to emphasize scale and engineering precision.
3. **Exploded Assembly:** Keep parts moving strictly along their assembly axes (usually Z or X), with dashed alignment centerlines.
4. **Drawing Stamp:** Ensure the Title Block displays the project title, drawing scale, and an "APPROVED" status stamp in the bottom-right corner.

## Known Limits
- High line count models (> 20,000 vector segments) can impact WebGL draw calls; merge static line buffers into single line segment geometries where possible.

