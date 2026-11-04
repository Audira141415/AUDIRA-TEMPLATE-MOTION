# INKSTORY kit — East Asian ink wash, Shan Shui misty mountains & zen calligraphy

Copy `kits/inkstory/src/` into the project's `src/` (on top of the starter). It adds `src/kits/inkstory/`
and needs only `remotion`, `@remotion/three`, `@react-three/fiber` and `three` (already present in the starter).

Time runs on **film frames at a 60 fps clock**: compute `const f = (frame / fps) * 60` once and pass `f` to
the camera, InkBrushStroke, VermilionSeal, InkMountainDiorama and Overlay, so the 30 fps preview and the 60 fps final play identically.

| Folder | Content |
|---|---|
| `core/motion.ts` | Deterministic zen easing (`zenFloat`, `brushStroke`, `smoothWash`), and `mistBillow` |
| `core/noise.ts` | Deterministic noise, organic edge fraying, and ink splatter generation |
| `lib/palette.ts` | Traditional Sumi-e palette (`agedXuanPaper`, `pineSootBlack`, `denseInk`, `dilutedWash`, `vermilionCinnabar`, `bambooMoss`) |
| `lib/materials.ts` | `createXuanPaperMaterial`, `createDenseInkMaterial`, `createInkWashMistMaterial`, `createVermilionSealMaterial` |
| `canvas/InkBrushStroke.tsx` | 3D procedural calligraphic sweeping ribbon with dynamic brush pressure write-on |
| `canvas/VermilionSeal.tsx` | Traditional square red cinnabar artist chop mark with rhythmic stamping physics |
| `world/InkMountainDiorama.tsx` | 3D layered Shan Shui peaks, billowing paper mist, swaying ink bamboo, and brush gestures |
| `world/Atmosphere.tsx` | Diffused morning paper-screen illumination, gentle key light, and warm paper fill |
| `camera/rig.ts` | Deterministic 3-act scroll trajectory (horizontal scroll pan → vertical mountain reveal → peaceful wide framing) |
| `camera/Overlay.tsx` | Vertical calligraphic poetry (`writing-mode: vertical-rl`), dynastic seal border, and minimal title |
| `example/` | `InkstoryExample` — 8 s traditional scroll journey: brush stroke write-on, mountain mist reveal, and seal stamp payoff |

## Register the example

In `src/Root.tsx`:

```tsx
import { InkstoryExample, INKSTORY_EXAMPLE_SECONDS } from "./kits/inkstory/example/InkstoryExample.tsx";

<Composition
  id="InkstoryPreview"
  component={InkstoryExample}
  durationInFrames={INKSTORY_EXAMPLE_SECONDS * preview.fps}
  fps={preview.fps}
  width={preview.width}
  height={preview.height}
/>
```

## Directing an INKSTORY film

1. **Aged Paper Ground:** Always maintain warm, textured Xuan paper (`#f5f0e6`) as the background. Avoid stark sterile digital whites.
2. **Atmospheric Depth:** Use layered semi-transparent mountain silhouettes and mist planes to create the authentic sense of vast, quiet distance (*Shan Shui*).
3. **Pacing & Restraint:** The camera should move with contemplative, unhurried grace (`ease.zenFloat`). The red cinnabar seal should stamp firmly to ground the entire composition.

