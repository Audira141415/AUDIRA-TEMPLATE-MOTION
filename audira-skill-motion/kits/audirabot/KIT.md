# AUDIRABOT kit — The Official 3D Autonomous Mascot Companion Engine

> **Style ID:** 29 (Official Mascot Flagship)  
> **Brand Mascot:** AUDIRA-BOT  
> **Architect:** AUDIRA (Agus Dwi R)  

Copy `kits/audirabot/src/` into the project's `src/` (on top of the starter). It adds `src/kits/audirabot/`
and needs only `remotion`, `@remotion/three`, `@react-three/fiber` and `three` (already present in the starter).

Time runs on **film frames at a 60 fps clock**: compute `const f = (frame / fps) * 60` once and pass `f` to
the camera, AudiraBotMesh, and AudirabotOverlay so the 30 fps preview and 60 fps final play identically.

| File | Content |
|---|---|
| `robot/AudiraBotMesh.tsx` | Modular 3D Mascot: Ceramic egg body, curved obsidian visor, OLED digital eyes, golden ears, articulated gesturing arms, and plasma thruster glow |
| `core/motion.ts` | State machine: Natural breathing hover levitation, banking tilt, dynamic eye blinking, and emotion shifts (`CURIOUS`, `THINKING`, `HAPPY`, `ALERT`) |
| `lib/palette.ts` | Official mascot tokens (`chassisWhite`, `visorGlass`, `eyeCyan`, `eyeAmber`, `eyeGreen`, `thrusterPlasma`, `accentGold`) |
| `lib/materials.ts` | Physical materials: Clearcoat visor glass, porcelain white ceramic, emissive OLED eyes, and plasma thruster volume |
| `camera/rig.ts` | Mascot camera choreographies (low-angle hero entrance, companion dialogue tracking, wide 3/4 framing) |
| `camera/Overlay.tsx` | HUD companion dialogue card, status badge, and speech bubbles |
| `example/AudirabotExample.tsx` | `AudirabotExample` — 8s complete preview composition |

## How to Register in `src/Root.tsx`

```tsx
import { AudirabotExample, AUDIRABOT_EXAMPLE_SECONDS } from "./kits/audirabot/example/AudirabotExample";

<Composition
  id="AudirabotPreview"
  component={AudirabotExample}
  durationInFrames={AUDIRABOT_EXAMPLE_SECONDS * preview.fps}
  fps={preview.fps}
  width={preview.width}
  height={preview.height}
/>
```

## Using AUDIRA-BOT in Other Styles (Universal Companion)
You can embed `<AudiraBotMesh f={f} />` into ANY scene (like `INNERWORKS`, `CIRCUITFORGE`, or `URBANFORGE`) to act as the presenter/pointer!
