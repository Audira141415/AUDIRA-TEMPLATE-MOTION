# FILMNOIR — Kit Guide

> Classic 1940s Cinematic Film Noir: high-contrast Chiaroscuro lighting, deep black shadows, Venetian blinds shadow cutter, wet reflective asphalt puddles, vintage tungsten streetlight, and trench-coat detective silhouette.

## Quick Start

```tsx
import { FilmNoirExample } from "./example/FilmNoirExample";
import { NoirStreet3D } from "./scene/NoirStreet3D";
import { DetectiveSilhouette3D } from "./scene/DetectiveSilhouette3D";
import { getFilmNoirCamera } from "./camera/rig";
import { FilmNoirOverlay } from "./camera/Overlay";
```

## Signature Motion & Style Rules

1. **Chiaroscuro Contrast:** Pitch black shadows (`#060709`), warm amber tungsten key light (`#FFE3A0`), and cold moon rim (`#A3BFDB`).
2. **Wet Surface Reflections:** PBR asphalt roughness <= 0.2 with subtle red neon reflection in puddles.
3. **Venetian Blinds Cutter:** 3D gobo slits casting authentic horizontal shadow bars across the brick wall and detective.
4. **Cinematic Dutch Angle:** Low camera angle with subtle Dutch tilt and forward dolly track.
