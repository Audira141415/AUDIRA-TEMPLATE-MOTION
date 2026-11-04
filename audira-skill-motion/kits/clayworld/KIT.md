# CLAYWORLD kit — tactile stop-motion claymation & plasticine diorama

Copy `kits/clayworld/src/` into the project's `src/` (on top of the starter). It adds `src/kits/clayworld/`
and needs only `remotion`, `@remotion/three`, `@react-three/fiber` and `three` (already present in the starter).

Time runs on **film frames at a 60 fps clock**: compute `const f = (frame / fps) * 60` once and use
`stepFrame(f, 4)` for authentic 15 FPS stop-motion character cadence, so the 30 fps preview and the 60 fps final play identically.

| Folder | Content |
|---|---|
| `core/motion.ts` | `stepFrame(f, step)` (stop-motion quantizer), `squashScale(factor)` (volume-preserving dough physics), `clamp`, `remap`, `seg` |
| `core/noise.ts` | Deterministic fingerprint bump pattern and plasticine surface indent jitter |
| `lib/palette.ts` | Aardman-inspired clay tones (`terracotta`, `mustard`, `olive`, `coral`, `dustyTeal`, `clayCream`, `earthBrown`, `charcoal`, `studioBackground`) |
| `lib/materials.ts` | `createClayMaterial`, `createBeadEyeMaterial`, `createClayGroundMaterial` (high roughness, soft diffuse scatter) |
| `character/ClayCreature.tsx` | Handcrafted clay creature with discrete stepped eye-blinks, volume squash-and-stretch, and waving clay hands |
| `world/ClayDiorama.tsx` | Rolled-out plasticine clay ground slab, clay mushrooms, round clay trees, and molded pebbles |
| `world/Atmosphere.tsx` | Warm tabletop miniature studio lighting with key softbox, peach reflector bounce, and warm rim light |
| `camera/rig.ts` | Miniature tabletop camera rig with physical stop-motion stepped micro-drift |
| `camera/Overlay.tsx` | Subtle radial vignette, stop-motion title card, and tactile handcrafted framing |
| `example/` | `ClayworldExample` — 8 s: waking clay critter, 2 squash-and-stretch hops, curious blinks, and friendly wave |

## Register the example

In `src/Root.tsx`:

```tsx
import { ClayworldExample, CLAYWORLD_EXAMPLE_SECONDS } from "./kits/clayworld/example/ClayworldExample.tsx";

<Composition
  id="ClayworldPreview"
  component={ClayworldExample}
  durationInFrames={CLAYWORLD_EXAMPLE_SECONDS * preview.fps}
  fps={preview.fps}
  width={preview.width}
  height={preview.height}
/>
```

Then check stills:
`node scripts/stills.mjs out/clay 0.5s,2.8s,5.0s,7.8s ClayworldPreview`

## Directing a CLAYWORLD film

1. **Stepped Cadence is Vital:** Never animate characters with smooth 60 FPS interpolation — that produces plastic CG toy movement. Quantize character poses with `stepFrame(f, 4)` (15 FPS) or `stepFrame(f, 5)` (12 FPS) to achieve genuine stop-motion tactile warmth.
2. **Squash & Stretch (Volume Preservation):** When clay hits the ground, it squashes wide ($s_y < 1$, $s_x, s_z > 1$). In mid-air, it stretches tall ($s_y > 1$, $s_x, s_z < 1$).
3. **Imperfect Edges:** Plasticine is hand-rolled; avoid razor-sharp CAD corners. Use rounded bevels, spheres, and soft capsules.
4. **Warm Tabletop Lighting:** Soft warm key light with colored bounce makes clay look delicious and tactile on mobile screens.

## Known Limits
- Very dense morphing meshes can reduce WebGL performance; use hierarchical groups of primitive clay parts rather than real-time mesh booleans.

