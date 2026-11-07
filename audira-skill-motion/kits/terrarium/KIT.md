# TERRARIUM — Kit Guide

> A living glass-jar terrarium in macro: refractive curved glass with condensation droplets, gravel-charcoal-soil layers, moss cushions, ferns, pebbles, tiny mushrooms, a little pool, a gliding snail, and a full day-to-night cycle inside 12 seconds that ends with glowing mushrooms and fireflies.

Style ID: 62

## Quick Start

```tsx
import { TerrariumExample } from "./example/TerrariumExample";
import { GlassJar3D } from "./scene/GlassJar3D";
import { JarGarden3D } from "./scene/JarGarden3D";
import { Snail3D } from "./scene/Snail3D";
import { getTerraCamera, leafPose } from "./camera/rig";
import { TerraOverlay } from "./camera/Overlay";
import { dayState, soilY, snailAt } from "./core/motion";
```

Compositions: `TerrariumPreview` (540x960 @ 30) and `TerrariumFinal` (1080x1920 @ 60).

## How to adapt it

1. Landscape: edit `soilY` (mound, ripple, pool dip) in `core/motion.ts`; moss, pebbles, ferns, mushrooms, pool and snail all sit on it.
2. Vessel: edit `PROFILE` in `GlassJar3D` (lathe radius/height pairs) for a bottle, bowl, cloche or aquarium.
3. Time of day: edit the `KEYS` in `dayState` (sky, sun colour/intensity/elevation, night factor); night drives mushroom glow, fireflies, bokeh and the clock.
4. Inhabitant: swap `Snail3D` for another small creature; keep it slow and give it a path through `snailAt`.

## Signature Motion & Style Rules

1. **Real glass:** `MeshPhysicalMaterial` transmission 1, IOR 1.5, roughness ≤ 0.04, clearcoat 1. The jar is drawn last so it refracts the garden.
2. **Macro scale cues:** condensation droplets on the inner wall, speckled substrate bands visible through the glass, an out-of-focus fern in the foreground.
3. **One cycle per film:** morning → midday → dusk → night; colour temperature and sky change, never a cut.
4. **Night payoff is gentle bioluminescence:** mushroom caps emit `#B8FF9A`, a short-range green point light, warm fireflies; no neon.
5. **Slow life:** fern sway ≤ 0.04 rad, snail moves ~0.6 units in 12 s, droplets slide a few at a time.
