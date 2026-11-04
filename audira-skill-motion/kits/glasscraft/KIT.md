# GLASSCRAFT kit — spatial glassmorphism, refractive liquid prisms & VisionOS acoustics

Copy `kits/glasscraft/src/` into the project's `src/` (on top of the starter). It adds `src/kits/glasscraft/`
and needs only `remotion`, `@remotion/three`, `@react-three/fiber` and `three` (already present in the starter).

Time runs on **film frames at a 60 fps clock**: compute `const f = (frame / fps) * 60` once and pass `f` to
the camera, GlassCard, LiquidDroplet, GlassSanctuary and Overlay, so the 30 fps preview and the 60 fps final play identically.

| Folder | Content |
|---|---|
| `core/motion.ts` | Deterministic easing (`spatialFloat`, `smooth`, `liquidWave`, `snapIn`), `buoyancy`, and `liquidWobble` |
| `core/noise.ts` | Deterministic seeded PRNG, optical noise, and surface tension perturbation |
| `lib/palette.ts` | Optical prism & glass palette (`frostedGlass`, `prismCyan`, `prismMagenta`, `prismAmber`, `prismEmerald`, `voidDark`) |
| `lib/materials.ts` | `createFrostedGlassMaterial`, `createLiquidPrismMaterial`, `createChromaticRimMaterial`, `createObsidianFloorMaterial` |
| `spatial/GlassCard.tsx` | 3D floating frosted slab with beveled edges, internal refractive prism chip, and gyroscopic tilt |
| `spatial/LiquidDroplet.tsx` | Optical refractive glass spheres orbiting with organic surface tension breathing and wobble |
| `world/GlassSanctuary.tsx` | Hero spatial computing stage: floating frosted card, multi-color refractive liquid orbs, and specular obsidian floor |
| `world/Atmosphere.tsx` | High-key softbox lighting, ambient fill, and dual chromatic cyan/magenta rim point lights |
| `camera/rig.ts` | Deterministic 3-act spatial camera trajectory (macro edge glance → 3/4 gyroscopic tilt → telephoto hero pull-back) |
| `camera/Overlay.tsx` | Frosted pill badges, refraction index (IOR) telemetry, frame counter, and spatial computing UI |
| `example/` | `GlasscraftExample` — 8 s: macro glass glance, gyroscopic parallax floating, and prismatic optical payoff |

## Register the example

In `src/Root.tsx`:

```tsx
import { GlasscraftExample, GLASSCRAFT_EXAMPLE_SECONDS } from "./kits/glasscraft/example/GlasscraftExample.tsx";

<Composition
  id="GlasscraftPreview"
  component={GlasscraftExample}
  durationInFrames={GLASSCRAFT_EXAMPLE_SECONDS * preview.fps}
  fps={preview.fps}
  width={preview.width}
  height={preview.height}
/>
```

Then check stills:
`node scripts/stills.mjs out/glass 0.5s,3.0s,5.5s,7.8s GlasscraftPreview`

## Directing a GLASSCRAFT film

1. **Physical Transmission & Refraction:** Use `meshPhysicalMaterial` with transmission $\ge 0.9$, thickness $\ge 1.0$, and IOR between 1.45 (acrylic) and 1.52 (glass) to let background geometry refract organically.
2. **Chromatic Edge Dispersion:** Pair glass bodies with subtly scaled wireframes or rim lights in complementary prismatic colors (cyan + magenta) to simulate optical dispersion.
3. **Spatial Buoyancy:** Objects should feel as though suspended in zero-gravity fluid; avoid harsh mechanical snaps in favor of smooth harmonic floating (`buoyancy(f)`).
4. **Frosted 2D UI:** Overlays use `backdropFilter: blur(20px)` with translucent white borders (`rgba(255, 255, 255, 0.2)`) and rounded pill contours.

