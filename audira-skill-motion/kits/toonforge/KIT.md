# TOONFORGE kit — cel-shaded 3D anime, ink contours & manga speed lines

Copy `kits/toonforge/src/` into the project's `src/` (on top of the starter). It adds `src/kits/toonforge/`
and needs only `remotion`, `@remotion/three`, `@react-three/fiber` and `three` (already present in the starter).

Time runs on **film frames at a 60 fps clock**: compute `const f = (frame / fps) * 60` once and pass `f` to
the camera, MechaCore, SpeedLines, and AnimeDiorama, so the 30 fps preview and the 60 fps final play identically.

| Folder | Content |
|---|---|
| `core/motion.ts` | Deterministic easing (`animeSnap`, `whip`, `charge`), `impactShake(tAfterImpact)` for screen rattle |
| `core/noise.ts` | Deterministic noise for speed line flicker and action streak variation |
| `lib/palette.ts` | Anime action palette (`inkBlack`, `inkOutline`, `mechaArmor`, `mechaAccent`, `sakuraPink`, `skyCyan`, `crimsonImpact`) |
| `lib/materials.ts` | `createCelMaterial` (MeshToon), `createInkOutlineMaterial` (BackSide inverted hull), `createSpeedLineMaterial` |
| `effects/SpeedLines.tsx` | Procedural radial anime speed lines that burst and converge on focal action beats |
| `character/MechaCore.tsx` | Hero cel-shaded mecha craft with inverted-hull ink contours, swept wings, and twin plasma thrusters |
| `world/AnimeDiorama.tsx` | Cel-shaded velocity tunnel rings and distant comic horizon strips |
| `world/Atmosphere.tsx` | High-contrast anime lighting with sharp direct sunlight and saturated ambient fill |
| `camera/rig.ts` | Decisive anime camera cuts, snap-zooms, Dutch tilt angles, and impact shake |
| `camera/Overlay.tsx` | Manga action comic letterboxing, action callout banners, and episode title stamps |
| `example/` | `ToonforgeExample` — 8 s: idle warm-up, thruster ignition snap, radial speed lines, and heroic banking roll |

## Register the example

In `src/Root.tsx`:

```tsx
import { ToonforgeExample, TOONFORGE_EXAMPLE_SECONDS } from "./kits/toonforge/example/ToonforgeExample.tsx";

<Composition
  id="ToonforgePreview"
  component={ToonforgeExample}
  durationInFrames={TOONFORGE_EXAMPLE_SECONDS * preview.fps}
  fps={preview.fps}
  width={preview.width}
  height={preview.height}
/>
```

Then check stills:
`node scripts/stills.mjs out/toon 0.5s,2.8s,5.0s,7.8s ToonforgePreview`

## Directing a TOONFORGE film

1. **Inverted Hull Contours:** Every hero object must feature an inverted backface outline (`side: THREE.BackSide`) slightly scaled up ($1.04\times–1.08\times$) to deliver authentic hand-drawn manga ink lines.
2. **Snap Zooms & Dutch Tilts:** Avoid sluggish western cinematics. Use `animeSnap` with fast acceleration and sudden stops, paired with a $15^\circ–25^\circ$ Dutch camera roll during high-speed moves.
3. **Speed Lines on Impacts:** Trigger `<SpeedLines />` on acceleration or impact moments to multiply the sensation of velocity.
4. **Action Callout Overlays:** Bold Japanese/alphanumeric comic banners with high-contrast drop-shadows provide instant manga impact.

## Known Limits
- Very dense organic meshes with non-manifold edges may produce uneven inverted-hull outlines; ensure normals are cleanly oriented.

