# POLYVERSE kit — faceted low-poly worlds & floating islands

Copy `kits/polyverse/src/` into the project's `src/` (on top of the starter). It adds `src/kits/polyverse/`
and needs only `remotion`, `@remotion/three`, `@react-three/fiber` and `three` (already present in the starter).

Time runs on **film frames at a 60 fps clock**: compute `const f = (frame / fps) * 60` once and pass `f` to
the camera, FloatingIsland, trees, water, and clouds, so the 30 fps preview and the 60 fps final play identically.

| Folder | Content |
|---|---|
| `core/motion.ts` | Deterministic easing (`glide`, `sun`, `sine`), `windSway(f)` for pine trees, `waterWave(x, z, f)` for faceted rivers |
| `core/noise.ts` | Deterministic noise for procedural terrain vertices and cloud scattering |
| `lib/palette.ts` | Pastel low-poly palette (`grassEmerald`, `rockSlate`, `waterSurface`, `cloudWhite`, `crystalMonolith`, `sunWarm`, `skyDawn`) |
| `lib/materials.ts` | Flat-shaded materials (`createPolyMaterial`, `createPolyWaterMaterial`, `createPolyCloudMaterial`, `createPolyCrystalMaterial`) |
| `nature/LowPolyTree.tsx` | Faceted stacked-cone pine tree with deterministic wind sway |
| `nature/LowPolyCloud.tsx` | Clustered dodecahedron geometric clouds drifting on the wind |
| `nature/LowPolyWater.tsx` | Low-poly faceted river surface with procedural vertex bobbing |
| `world/FloatingIsland.tsx` | Hero floating island: subterranean inverted rock cone, grass plateau, boulders, winding river, and glowing crystal monolith |
| `world/Atmosphere.tsx` | Dawn/sunset pastel lighting with warm sun and crisp faceted triangle shadows |
| `camera/rig.ts` | Telephoto isometric camera orbit with shallow focal depth |
| `camera/Overlay.tsx` | Minimalist Swiss typography overlay, spatial coordinates, and diorama metadata |
| `example/` | `PolyverseExample` — 8 s: dawn light over floating sanctuary, swaying pines, rippling river, and majestic isometric spiral orbit |

## Register the example

In `src/Root.tsx`:

```tsx
import { PolyverseExample, POLYVERSE_EXAMPLE_SECONDS } from "./kits/polyverse/example/PolyverseExample.tsx";

<Composition
  id="PolyversePreview"
  component={PolyverseExample}
  durationInFrames={POLYVERSE_EXAMPLE_SECONDS * preview.fps}
  fps={preview.fps}
  width={preview.width}
  height={preview.height}
/>
```

Then check stills:
`node scripts/stills.mjs out/poly 0.5s,2.5s,5.0s,7.8s PolyversePreview`

## Directing a POLYVERSE film

1. **Flat Shading is Sacred:** Always set `flatShading: true` on all materials. Smoothing normals ruins the low-poly aesthetic; facets must catch distinct light values on adjacent triangles.
2. **Pastel Harmony:** Use soft, harmonious color palettes (emerald, slate, coral, peach, sky blue) rather than saturated primary colors.
3. **Telephoto Isometric Camera:** Keep camera FOV narrow (28°–34°) to maintain the isometric miniature feel and avoid extreme wide-angle distortion.
4. **Subtle Secondary Motion:** Trees swaying in the wind, rippling water vertices, and drifting clouds breathe life into the geometric stillness.

## Known Limits
- Very dense meshes with > 50,000 polygons defeat the low-poly aesthetic; keep polygon counts low and clean.

