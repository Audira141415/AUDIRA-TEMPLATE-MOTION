# COMICFORGE — Kit Guide

Style ID: 51

> Western superhero comic in 3D: cel-shaded halftone materials with thick inverted-hull ink lines, Ben-Day dots printed in screen space, printed page panels the camera flies through, an original hero in action, speech balloon and an onomatopoeia burst on a CMYK palette.

## Quick Start

```tsx
import { ComicforgeExample } from "./example/ComicforgeExample";
import { CityPanels3D } from "./scene/CityPanels3D";
import { Hero3D } from "./scene/Hero3D";
import { Impact3D } from "./scene/Impact3D";
import { useComicMats, Inked, InkBox } from "./scene/Ink";
import { getComicCamera } from "./camera/rig";
import { ComicforgeOverlay } from "./camera/Overlay";
import { computeComicState } from "./core/motion";
```

Compositions (already registered in `starter/src/Root.tsx`): `ComicforgePreview` (540×960 @ 30) and `ComicforgeFinal` (1080×1920 @ 60), 12 s.

## Files

- `example/ComicforgeExample.tsx` — composition: ThreeCanvas + frame-driven CameraRig (useThree + useLayoutEffect) + overlay
- `scene/Ink.tsx` — material set (`useComicMats`), `Inked` (normal-extruded inverted hull) and `InkBox` (scaled hull for boxes)
- `scene/CityPanels3D.tsx` — halftone night sky, instanced skyline with ink hulls + lit windows, hero rooftop, two printed comic pages with panel-shaped holes
- `scene/Hero3D.tsx` — original hero 'Skyline Guardian' (cowl, star emblem, hinge-chain cape) with stand / crouch / fly / punch / victory poses
- `scene/Impact3D.tsx` — rogue spike-drone, instanced shards, KRA-KOOM! star burst + radial action rays, speech balloon, flight speed lines
- `lib/materials.ts` — halftone cel shader (3 hard bands + screen-space Ben-Day dots + toon specular), inverted-hull outline shader, canvas helpers
- `lib/palette.ts` — CMYK process + newsprint tokens
- `core/motion.ts` — beats, hero/drone kinematics, seeded rng, easing
- `camera/rig.ts` — page push-through → rooftop hold → chase cam → impact shake → crane-back
- `camera/Overlay.tsx` — issue kicker, italic stroked title, badge `COMICFORGE // 51`, narration caption box, credit (safe-zone scaled)

## Story Timeline (12 s example)

| Time | Beat |
| --- | --- |
| 0–3.6 s | Hook: printed comic page fills the frame; camera pushes through two panel borders into Neon Bay |
| 3.6–4.7 s | Low hero angle on the rooftop, cape flutters, crouch |
| 4.7–8.8 s | Leap and chase-cam flight with speed lines; speech balloon 'NOT IN MY CITY, TIN CAN!' |
| 8.8–9.4 s | Impact: drone shatters, KRA-KOOM! burst pops with overshoot, camera shake + punch-in |
| 9.4–12 s | Payoff: crane back over the skyline, victory pose, 'TO BE CONTINUED...' |

## Signature Motion & Style Rules

1. **Ink first:** Every hero prop gets an ink hull (normal-extruded for smooth meshes, scaled box for boxes, instanced hulls for the skyline). No soft outlines, no bloom.
2. **Ben-Day halftone shading:** Use `makeHalftoneMaterial`: lit band = flat colour, mid band = screen-space dots of the shade colour, dark band = solid shade. Dot cell scales with output height (11 px at 1920).
3. **CMYK palette only:** Cyan, magenta, yellow, key black plus newsprint and their overprints (red = M+Y, purple sky = C+M).
4. **Panels are space:** Comic pages are physical planes with panel-shaped holes; the camera moves through borders instead of cutting.
5. **Lettering is original:** Balloons, captions and onomatopoeia use your own words in Impact-style lettering with heavy black stroke.
6. **Pop on impact:** Bursts scale with easeOutBack overshoot, camera shake decays within ~0.6 s.

## Determinism

Every pose, glitch and particle is derived from `useCurrentFrame()` (normalised to a 60 fps clock `f`). No `useFrame` animation, no `Date`, no unseeded `Math.random` (seeded `rng()` in `core/motion.ts`), no network textures — all textures are procedural `CanvasTexture`s or shaders.
