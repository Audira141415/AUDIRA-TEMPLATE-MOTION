# RISOFORGE — Kit Guide

Style ID: 53

> Risograph zine come alive: a stapled zine spread whose printed layers hinge up into a pop-up city; fluorescent pink, blue and yellow spot inks overprint through true multiply blending, with grainy halftone, paper tooth dropouts and jittering misregistration.

## Quick Start

```tsx
import { RisoforgeExample } from "./example/RisoforgeExample";
import { ZineSpread3D } from "./scene/ZineSpread3D";
import { PopupLayers3D } from "./scene/PopupLayers3D";
import { useRisoInks } from "./scene/inks";
import { getRisoCamera } from "./camera/rig";
import { RisoforgeOverlay } from "./camera/Overlay";
import { computeRisoState, misregister } from "./core/motion";
```

Compositions (already registered in `starter/src/Root.tsx`): `RisoforgePreview` (540×960 @ 30) and `RisoforgeFinal` (1080×1920 @ 60), 12 s.

## Files

- `example/RisoforgeExample.tsx` — composition: flat (no tone mapping) ThreeCanvas with soft shadows, CameraRig with animated up-vector, overlay
- `scene/ZineSpread3D.tsx` — cutting mat, stacked signatures, floor page + standing backdrop page, staples, inks printed on the backdrop (horizon glow, halftone sky, rising sun, birds)
- `scene/PopupLayers3D.tsx` — six hinged ink cut-outs: blue skyline, pink skyline with window knock-outs, yellow hills, blue+yellow monstera (prints green), grass + flowers
- `scene/inks.tsx` — one material per drum × density (`useRisoInks`)
- `lib/materials.ts` — riso ink shader (multiply CustomBlending, halftone screen per drum angle, paper-tooth grain + dropouts), paper and cutting-mat CanvasTextures
- `lib/palette.ts` — Riso Fluorescent Pink / Blue / Yellow + paper stock tokens, drum ids
- `core/motion.ts` — beats, staggered pop-up lift (easeOutBack), stepped 10 fps misregistration per drum, seeded rng
- `camera/rig.ts` — top-down over the spread → swing to page level → dolly through the layers → rise on the sunrise
- `camera/Overlay.tsx` — registration marks, misregistered multiply title, badge `RISOFORGE // 53`, ink-swatch caption card, edition line, credit

## Story Timeline (12 s example)

| Time | Beat |
| --- | --- |
| 0–1.6 s | Hook: top-down on the stapled zine — the city is still a flat print |
| 1.5–4.6 s | Layers hinge up one by one with a paper overshoot while the camera swings down to page level |
| 4.8–8.4 s | Dolly low through grass, plant and skylines; monstera leaves unfurl, blue × yellow prints green |
| 8.4–10.6 s | Payoff: the yellow sun rises behind the skylines, overprinting pink into orange |
| 10.4–12 s | Registration tightens, camera rises for the hero frame |

## Signature Motion & Style Rules

1. **Inks multiply, never mix:** Every ink is `makeRisoInk` (src × dst). Only three drums exist; secondary colours must come from overlap (pink×blue violet, pink×yellow orange, blue×yellow green).
2. **Paper is the light:** Render `flat` (no tone mapping) on cream stock; ink outputs mix(white, ink, coverage) so empty areas stay paper.
3. **Halftone per drum:** Density < 0.97 switches to a dot screen; each drum has its own screen angle. Dot cell = 9 px × height/1920.
4. **Misregistration jitters:** Each drum's layers shift by a seeded offset re-rolled at 10 fps (`misregister`), max ~0.03 world units; it tightens on the payoff.
5. **Layers are paper:** Flat ShapeGeometry cut-outs hinged on the floor page; knock-out holes (windows, leaf splits) let back layers print through.
6. **Zine framing:** Keep the spine, staples, page edges and cutting mat in at least the hook frame so it reads as a printed object.

## Determinism

Every pose, glitch and particle is derived from `useCurrentFrame()` (normalised to a 60 fps clock `f`). No `useFrame` animation, no `Date`, no unseeded `Math.random` (seeded `rng()` in `core/motion.ts`), no network textures — all textures are procedural `CanvasTexture`s or shaders.
