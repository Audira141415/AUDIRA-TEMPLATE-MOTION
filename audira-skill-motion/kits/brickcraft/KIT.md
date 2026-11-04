# BRICKCRAFT — Kit Guide

> Stop-motion toy-brick films shot like macro photography on a real desk: a world built from interlocking plastic bricks with round studs, animated a pose at a time.

## Quick Start

```tsx
import { ToyRoomStage } from "./world/ToyRoomStage";
import { BrickAtmosphere } from "./world/Atmosphere";
import { getBrickCamera } from "./camera/rig";
import { BrickOverlay } from "./camera/Overlay";
```

## Motion Rules
1. **Characters & Bricks on Twos/Fours (12–15 FPS):** Stepped motion for all toy parts using `stepFrame(f, 4)`.
2. **Camera on Ones (60 FPS):** Camera moves smoothly across the macro tabletop without judder.
3. **Snap Overshoot:** Every brick arriving flies in on an arc and snaps into place with a subtle elastic click bounce (`snapOvershoot`).
4. **Specular Clearcoat Catchlights:** High clearcoat (0.85) on glossy ABS surfaces reflecting rectangular softbox lights.

