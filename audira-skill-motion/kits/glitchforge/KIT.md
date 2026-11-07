# GLITCHFORGE — Kit Guide

Style ID: 68

> A pristine product-studio render (pearl torus-knot sculpture, chrome beads, white cyclorama) whose feed progressively corrupts — RGB channel split, scanline tears, macroblock displacement, datamosh smears, pixel-sorting streaks, 3D slice shear and ghost copies, a signal-lost colour-bar frame — then snaps back clean. All glitch timing is seeded and stepped at 12 Hz.

## Quick Start

```tsx
import { GlitchforgeExample } from "./example/GlitchforgeExample";
import { StudioSet3D } from "./scene/StudioSet3D";
import { HeroSculpture3D } from "./scene/HeroSculpture3D";
import { GlitchPost } from "./scene/GlitchPost";
import { GlitchShader, makeStudioEnv } from "./lib/materials";
import { getGlitchCamera } from "./camera/rig";
import { GlitchforgeOverlay } from "./camera/Overlay";
import { computeGlitchState, BEAT } from "./core/motion";
```

Compositions (already registered in `starter/src/Root.tsx`): `GlitchforgePreview` (540×960 @ 30) and `GlitchforgeFinal` (1080×1920 @ 60), 12 s.

## Files

- `example/GlitchforgeExample.tsx` — composition: studio lights (soft key, cyan + red kickers), CameraRig, scene, GlitchPost, overlay
- `core/motion.ts` — beats (hook burst, creep, corrupt, lost, snap, stamp) and the seeded 12 Hz glitch schedule → per-effect intensities
- `scene/StudioSet3D.tsx` — white coved cyclorama, plinth with cyan ring, broadcast test card on a stand, light-stand silhouette
- `scene/HeroSculpture3D.tsx` — pearl iridescent torus knot cut into 6 clip-plane slices that shear, additive red/blue wireframe ghosts, orbiting chrome beads
- `scene/GlitchPost.tsx` — EffectComposer: RenderPass (MSAA) → OutputPass → glitch ShaderPass; PMREM studio env map; useFrame used only to hand rendering to the composer
- `lib/materials.ts` — `GlitchShader` (tears, macroblocks, datamosh, RGB split, pixel sort, signal lost, scanlines), pearl + chrome materials, studio env
- `lib/palette.ts` — studio whites + RGB signal primaries
- `camera/rig.ts` — continuous product orbit + push-in; stepped frame-drop jitter only while the signal is lost
- `camera/Overlay.tsx` — REC timecode, DATA ROT title with RGB-split duplicates during errors, badge `GLITCHFORGE // 68`, status (SIGNAL OK / ERR / NO SIGNAL / RESTORED), bitrate, caption, credit

## Story Timeline (12 s example)

| Time | Beat |
| --- | --- |
| 0–1.1 s | Clean, expensive product orbit |
| 1.1–1.45 s | Hook: one hard burst (split + tears + blocks + ghosts), then clean again |
| 2.2–4.4 s | Creep: RGB split and scanline tears start to bleed in |
| 4.4–7.4 s | Corruption escalates: macroblocks, datamosh smears, pixel-sort streaks, 3D slice shear |
| 7.4–8.4 s | Signal lost: colour bars + snow, stepped frame drops |
| 8.45–12 s | Payoff: snaps back clean on a hero push-in; one tiny glitch stamp at 10.8 s |

## Signature Motion & Style Rules

1. **Start clean, earn the corruption:** The first second must look like a premium product render; glitches escalate in stages, never all at once.
2. **Deterministic glitch:** All randomness = hash(seed) with seed stepped at 12 Hz (`GLITCH_HZ`); no Math.random, no previous-frame buffers (datamosh is faked by stale motion vectors per block).
3. **Two layers of damage:** Full-frame post pass (2D) + slice shear and R/B ghosts in 3D, so corruption has depth.
4. **Camera stays smooth:** The image breaks, not the camera: keep the orbit continuous; only signal-lost frames add a stepped drop.
5. **Snap back hard:** Return to clean in one frame at `BEAT.snap`; let the clean hero frame breathe before any final stamp.
6. **White space is the canvas:** A bright studio makes RGB fringes and sort streaks read; avoid dark cyber HUD looks.

## Determinism

Every pose, glitch and particle is derived from `useCurrentFrame()` (normalised to a 60 fps clock `f`). No `useFrame` animation, no `Date`, no unseeded `Math.random` (seeded `rng()` in `core/motion.ts`), no network textures — all textures are procedural `CanvasTexture`s or shaders.
