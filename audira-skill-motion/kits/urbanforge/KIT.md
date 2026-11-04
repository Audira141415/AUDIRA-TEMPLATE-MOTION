# URBANFORGE — Kit Guide

> A pure white massing model of a real urban district stands on a plinth in a dark exhibition room, and a projector paints data onto it as light: height metrics, zoning envelopes, and solar shadow studies.

## Quick Start

```tsx
import { ArchitecturalPlinth } from "./world/ArchitecturalPlinth";
import { UrbanAtmosphere } from "./world/Atmosphere";
import { getUrbanCamera } from "./camera/rig";
import { UrbanOverlay } from "./camera/Overlay";
```

## Motion Rules
1. **Model is Matter, Data is Light:** The architectural model is matte plaster white (`modelWhite`); color is never painted into textures, only projected as glowing light washes.
2. **Real Solar Path:** Moving directional sun casts changing physical shadow footprints across building canyons.
3. **Data Waves:** Sequential layers (height matrix, civic zoning, flood levels) sweep across facades with soft luminous wavefronts.
4. **Architectural Cameras:** Macro rooftop glides at building scale, crane ascents, and high isometric masterplan views.

