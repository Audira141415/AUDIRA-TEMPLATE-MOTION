# DEVFORGE kit — 3D Spatial IDE & Game Dev Hustle Engine

> **Style ID:** 30 (Tech Creator & No-Code Gamedev Flagship)  
> **Brand/Pillar:** 5. Teknologi Tinggi & Komersial  
> **Architect:** AUDIRA (Agus Dwi R)  

Copy `kits/devforge/src/` into the project's `src/` (on top of the starter). It adds `src/kits/devforge/`
and requires only `remotion`, `@remotion/three`, `@react-three/fiber` and `three`.

Time runs on **film frames at a 60 fps clock**: compute `const f = (frame / fps) * 60` once and pass `f` to
the camera, IdeWindow3D, and DevforgeOverlay so the 30 fps preview and 60 fps final play identically.

| File | Content |
|---|---|
| `ide/IdeWindow3D.tsx` | 3D Floating IDE: Glassmorphic dark chassis, macOS window controls, syntax-highlighted typewriter code, and 3D game asset that spawns/pops out of code |
| `core/motion.ts` | State machine: Code char reveal, isometric floating drift, damped spring asset spawning, and metric profit badge popups |
| `lib/palette.ts` | IDE theme tokens (`editorBg`, `codeKeyword`, `codeFunc`, `accentNeon`, `metricProfit`, `amberGold`) |
| `lib/materials.ts` | Physical glass materials, neon borders, and metallic coin/stud shaders |
| `camera/rig.ts` | Kinetic camera choreography (wide isometric view, macro code punch-in, dramatic pull-back to 3D payoff) |
| `camera/Overlay.tsx` | HUD deployment badge, live estimated revenue card (+$1,250 Robux), and mobile safe-zone protected educational callouts |
| `example/DevforgeExample.tsx` | `DevforgeExample` — 8s complete preview composition |

## How to Register in `src/Root.tsx`

```tsx
import { DevforgeExample, DEVFORGE_EXAMPLE_SECONDS } from "./kits/devforge/example/DevforgeExample";

<Composition
  id="DevforgePreview"
  component={DevforgeExample}
  durationInFrames={DEVFORGE_EXAMPLE_SECONDS * preview.fps}
  fps={preview.fps}
  width={preview.width}
  height={preview.height}
/>
```
