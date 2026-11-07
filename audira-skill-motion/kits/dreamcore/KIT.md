# DREAMCORE — Kit Guide

> Style ID: 64

> Dreamcore Surreal: a pastel pool room in white tile with water for a floor and oversized clouds hanging under its ceiling; a free-standing door in the pool opens by itself and sky light spills out. The camera floats down the room, through a great arch, into an endless shallow sea under a pink-lilac sky: doors standing in the water, a lone arch, giant slow clouds, iridescent bubbles, and a staircase rising out of the water to nowhere with a glowing door at the top. Gentle, eerie calm.

## Quick Start

```tsx
import { DreamcoreExample } from "./example/DreamcoreExample";
import { PoolRoom3D, ROOM } from "./scene/PoolRoom3D"; // tiled walls/ceiling, ledges, ladder, arch wall, hook door
import { DreamVista3D } from "./scene/DreamVista3D"; // sky dome + baked env, rippled water, stairs to nowhere, doors, clouds, bubbles
import { FloatingDoor3D } from "./scene/FloatingDoor3D"; // free-standing door with sky inside and light spill
import { getDreamCamera } from "./camera/rig";
import { DreamcoreOverlay } from "./camera/Overlay";
import { DreamCameraRig, DreamPost } from "./lib/post";
```

The sky gradient shader is also rendered into a PMREM environment map, so water, tile and bubbles reflect the same pastel sky.

## Signature Motion & Style Rules

1. **Impossible but calm:** architecture behaves wrongly (sky behind doors, clouds indoors, stairs ending in air) while everything moves slowly and quietly. No jump scares, no monsters.
2. **Pastel only:** sky `#9FBFFF → #FFC7E4 → #FFE9D6`, doors pink/mint/lilac, white tile with blue-grey grout. Exposure ≤ 0.7 and bloom threshold 0.95: pastel scenes blow out to white fast.
3. **Soft haze:** `FogExp2 #F6D9EE` around 0.013; more turns the frame into a milky blank.
4. **Floating camera:** Catmull-Rom keys at water height rising to ~2.4, roll ±0.025 rad, never stops; passes through the arch at ~8.4 s.
5. **Doors are portals:** each doorway shows bright sky (HDR), and a soft additive glow pool lies on the water in front of it.
6. **Payoff:** the door at the top of the stairs opens wider and glows (8.5–10.5 s) while the caption changes.

## Do / Don't

- Do keep it distinct from BACKROOMS (no yellow office carpet, no fluorescent buzz, no VHS) and from RETROWAVE/vaporwave (no neon grids, no sunset stripes, no statues).
- Do let empty space and silence carry the mood; one surreal element per beat.
- Don't add characters or text inside the 3D world; the HUD is the only text.
