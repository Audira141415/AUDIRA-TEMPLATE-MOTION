# ABYSSFORGE — Kit Guide

> Style ID: 52

> Bioluminescent Deep-Sea Descent: a slow camera dive from the last god-rays of the twilight zone into the midnight zone, drifting marine snow, original pulsing jellyfish in cyan / magenta / violet light, and a payoff where a lure flickers on and reveals an anglerfish-like predator ("lanternmaw") over the trench floor. A submersible sonar HUD counts the metres down.

## Quick Start

```tsx
import { AbyssforgeExample } from "./example/AbyssforgeExample";
import { WaterColumn3D } from "./scene/WaterColumn3D"; // fog/background ramp, god-rays, marine snow, plankton, seabed
import { Jellyfish3D, JELLIES } from "./scene/Jellyfish3D"; // lathe bells, tube tentacles, pulse-driven glow
import { Lanternmaw3D, ANGLER_POS } from "./scene/Lanternmaw3D"; // payoff creature + lure light
import { getAbyssCamera } from "./camera/rig";
import { AbyssforgeOverlay } from "./camera/Overlay";
import { AbyssCameraRig, AbyssPost } from "./lib/post"; // per-frame camera + bloom / ACES / vignette / grain
```

All motion derives from `t = frame / fps` (`core/motion.ts`): `descent(t)`, `cameraDepthY(t)`, `depthMetres(t)`, `pulse()`, `lureLight()`. Seeded PRNG `mulberry32` only.

## Signature Motion & Style Rules

1. **Depth is the clock:** background + `FogExp2` colour ramp teal `#0E4A6B` → twilight `#06223A` → ink `#020A14`. Surface light (`surfaceLight`) is gone by ~42 % of the descent; below that every visible photon comes from a creature.
2. **Light is alive:** bioluminescence uses HDR colours (`color × 1.2–3.2`) on basic materials so bloom (threshold ~0.78) catches only living light. Never bloom the water.
3. **Jelly pulse grammar:** sharp contraction, slow relax (`pow(sin, 2.4)`); bell squeezes X/Z −20 %, stretches Y +14 %; glow and point light peak on the squeeze.
4. **Place creatures on the camera's schedule:** `at(time, x, z, …)` puts a jelly 2.4 units under the camera at the moment it should be featured, so the descent always has a subject.
5. **Marine snow is tiny:** 2,200 instanced flakes, radius ≤ 0.022; big flakes near the lens read as debris.
6. **Payoff:** the lure flickers (8.6–9.4 s) then steadies; the camera target eases from the water column to the creature; the jaw opens; the sonar shows the big echo and the caption turns amber.
7. **HUD:** depth counter (m), zone name (sunlight < 200 m, twilight < 1,000 m, midnight < 4,000 m), pressure ≈ 1 atm per 10 m, temperature, rotating sonar sweep. Text stays out of the top 180 px and bottom 380 px.

## Do / Don't

- Do keep the creature original (no real species mascot, no film monster); exaggerate the lure, teeth and photophores.
- Do keep point lights mounted every frame (change intensity, never mount/unmount) so shaders do not recompile mid-render.
- Don't add coral reefs, sunlight caustics on the floor or bright tropical fish: this is the aphotic zone.
