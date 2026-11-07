# FELTCRAFT — Kit Guide

> Needle-felted wool and stitched-fabric diorama: puffy felt hills with blanket stitches on every crest, a felt sun button, pompom clouds on threads, yarn trees with felt apples, and an original fuzzy wool fox ("Kopi") animated on twos like stop-motion, under cosy warm light.

Style ID: 55

## Quick Start

```tsx
import { FeltcraftExample } from "./example/FeltcraftExample";
import { FeltLandscape3D } from "./scene/FeltLandscape3D";
import { WoolFox3D, foxHandLocal } from "./scene/WoolFox3D";
import { YarnTree3D, FeltApple, TREE_POS } from "./scene/YarnTree3D";
import { Fuzzy, SPHERE, CONE, CYL } from "./scene/Fuzzy";
import { getFeltcraftCamera } from "./camera/rig";
import { FeltcraftOverlay } from "./camera/Overlay";
import { computeFoxPose, stepT, poseJitter } from "./core/motion";
```

Compositions: `FeltcraftPreview` (540x960@30) and `FeltcraftFinal` (1080x1920@60).

## Signature Motion & Style Rules

1. **Felt, not clay:** `feltMaterial` = roughness 1, cloth sheen 1, fibre map used as colour and bump. No clearcoat on wool. This is what separates FELTCRAFT from CLAYWORLD.
2. **Fuzz shells:** every wool part goes through `<Fuzzy>`: base felt mesh + 1–4 alpha-tested shells, each slightly larger and sparser. Spacing 0.035–0.08 of the part size.
3. **Visible handwork:** blanket stitches (instanced capsule bars over the crest + running thread tube) on hills, running-stitch path, cross-stitched button sun, stitched scarf. At least one stitch line must be readable in every shot.
4. **Stop-motion on twos:** puppets and props pose at 12 per second via `stepT()`, with a seeded per-pose `poseJitter` (hand placement). The camera moves smoothly at full frame rate (motion-control rig).
5. **Cosy light:** warm key `#FFE4BC` with soft shadows, warm point light near the subject, warm rim from behind for fuzz edges, hemisphere fill. No cold or dark grading.
6. **Notions as foreground:** yarn ball with knitting needles, wooden thread spool and pompom flowers frame the bottom of the shot.

## Timeline of the example (12 s)

| Time | Beat |
| --- | --- |
| 0–1.8 s | Hook: button sun rises; Kopi pops up from behind the front hillock |
| 2.2–6.9 s | Six hops along the stitched path toward the yarn tree |
| 7.4–8.75 s | Bump: tree shakes, one felt apple drops into Kopi's paws |
| 9.3–11 s | Payoff: apple raised overhead, felt hearts pop, camera pushes in |

## Adapting

- New character: build it from `Fuzzy` parts (spheres/cones) plus bead eyes; keep the `children` slot for held props.
- New landscape: add `HillDef` entries (crest function + depth); stitches follow the crest automatically.
- Overlay text stays inside the safe zone (top 180 px / bottom 380 px of 1080x1920).
