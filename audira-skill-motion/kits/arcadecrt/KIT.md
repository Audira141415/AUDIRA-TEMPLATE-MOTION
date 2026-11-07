# ARCADECRT — Kit Guide

Style ID: 66

> A dark arcade at midnight: one glowing upright cabinet runs an original pixel game on a curved CRT (barrel distortion, scanlines, aperture grille, RGB fringing, phosphor bloom). The camera pushes through the glass and the same level becomes a 3D voxel world the hero runs through.

## Quick Start

```tsx
import { ArcadecrtExample } from "./example/ArcadecrtExample";
import { ArcadeRoom3D } from "./scene/ArcadeRoom3D";
import { CrtCabinet3D, drawGame, SCREEN } from "./scene/CrtCabinet3D";
import { PixelWorld3D } from "./scene/PixelWorld3D";
import { PLATFORMS, COINS, STAR, heroX, heroY } from "./core/game";
import { getArcadeCamera } from "./camera/rig";
import { ArcadecrtOverlay } from "./camera/Overlay";
import { computeArcadeState } from "./core/motion";
```

Compositions (already registered in `starter/src/Root.tsx`): `ArcadecrtPreview` (540×960 @ 30) and `ArcadecrtFinal` (1080×1920 @ 60), 12 s.

## Files

- `example/ArcadecrtExample.tsx` — composition: renders the arcade OR the voxel world (switch hidden by the dive flash), CameraRig, overlay
- `core/game.ts` — original game 'ORBIT ROVER': sprite bitmap + palette, platforms, coins, goal star, scripted run/jump kinematics, score — shared by raster and voxels
- `core/motion.ts` — beats (power-on, push-in, dive, grab), joystick/button/coin-light state, seeded rng
- `scene/CrtCabinet3D.tsx` — extruded cabinet profile with side art, curved CRT mesh + CRT shader fed by a per-frame 96×128 canvas raster, marquee, joystick, buttons, coin door, bloom halos
- `scene/ArcadeRoom3D.tsx` — cosmic carpet, back wall, neon PLAY ZONE sign, instanced background cabinets with flickering screens and halos, coloured spill lights
- `scene/PixelWorld3D.tsx` — voxel terrain (instanced), voxel hero from the sprite (1 px = 1/8 unit), spinning coins, voxel goal star + burst, '+5000', starfield, low-poly planet
- `lib/materials.ts` — CRT shader (barrel, RGB convergence, scanlines, grille, vignette, refresh band, power-on line), glow sprite, carpet, side art, marquee textures
- `lib/palette.ts` — room darks + phosphor neons
- `camera/rig.ts` — wide → accelerating push into the glass → side-scroller tracking → low star-grab angle → pull back
- `camera/Overlay.tsx` — credit kicker, INSERT WORLD title, badge `ARCADECRT // 66`, live 1UP score, caption, PRESS START blink, in-world scanlines/vignette, dive flash

## Story Timeline (12 s example)

| Time | Beat |
| --- | --- |
| 0–1.6 s | Hook: dark arcade, CRT warms up from a bright line to full raster, PLAYER 1 READY, joystick wiggles |
| 1.6–7.25 s | Camera pushes in, accelerating until the curved glass and scanlines fill the frame |
| 7.3 s | Phosphor flash — we are inside the game |
| 7.3–10.1 s | The raster level is now voxels: hero runs and jumps across ledges, coins pop |
| 10.1–12 s | Payoff: hero grabs the goal star, voxel burst + '+5000', camera pulls back |

## Signature Motion & Style Rules

1. **One level, two renderings:** Raster (`drawGame`) and voxels (`PixelWorld3D`) read the same `core/game.ts`; 1 cell = 1 unit and 1 sprite pixel = 1/8 unit, so the dive is continuous.
2. **The CRT is a shader, not a texture:** Barrel curve, RGB fringing, scanlines, grille and vignette live in `makeCrtMaterial`; the canvas holds clean pixels (nearest filter).
3. **Darkness sells the glow:** Room ambient ≤ 0.2; every bright thing is an emitter (screens, marquee, sign, buttons) with an additive halo and a coloured point light.
4. **Hide the cut in light:** Switch from arcade to world only under the full-strength flash (≥ 0.9).
5. **Original IP only:** Invent the game title, sprite, cabinet art and marquee; never reference real games, characters or manufacturers.
6. **Keep scanlines inside:** In-world scanlines/vignette come from the overlay only after the dive.

## Determinism

Every pose, glitch and particle is derived from `useCurrentFrame()` (normalised to a 60 fps clock `f`). No `useFrame` animation, no `Date`, no unseeded `Math.random` (seeded `rng()` in `core/motion.ts`), no network textures — all textures are procedural `CanvasTexture`s or shaders.
