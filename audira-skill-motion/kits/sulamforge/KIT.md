# SULAMFORGE — Kit Guide

> Style ID: 59. Embroidery and woven textile in macro 3D: satin-stitch silk threads that grow stitch by stitch on linen stretched in a beech embroidery hoop, a steel needle and live thread laying each stitch, gold metallic threads and a songket (tenun) base cloth whose gold supplementary-weft floats catch a travelling light.

## Quick Start

```tsx
import { SulamforgeExample } from "./example/SulamforgeExample";
import { HoopStudio3D, FAB_Y } from "./scene/HoopStudio3D";
import { StitchField3D } from "./scene/StitchField3D";
import { getSulamCamera } from "./camera/rig";
import { SulamOverlay } from "./camera/Overlay";
import { computeSulamState, stitchGrow } from "./core/motion";
import { buildPattern, activeStitch } from "./lib/pattern";
import { silkMaterial, goldThreadMaterial, makeSongketTextures } from "./lib/materials";
```

Compositions: `SulamforgePreview` (540x960@30) and `SulamforgeFinal` (1080x1920@60), 12 s.

## Signature Motion & Style Rules

1. **Stitch = instance:** every stitch is one instance of a unit thread cylinder (`InstancedMesh` per thread colour), positioned from its start point and grown along its length by `stitchGrow` (0.14 s per stitch). About 640 stitches + 46 French knots.
2. **Real embroidery grammar:** satin stitch across petals (3-shade crimson to blush), fishbone stitch on leaves, overlapping stem stitch, French-knot centre, gold couched outlines, songket-style gold diamond ring.
3. **Silk vs gold:** silk is `MeshPhysicalMaterial` with sheen + light clearcoat; gold thread is metal 1.0 / roughness 0.22 with a PMREM `RoomEnvironment` so it reflects.
4. **Songket cloth:** canvas-drawn plum tenun with pucuk rebung triangles and a diamond lattice; a white mask drives `metalnessMap`, so only the gold floats glint.
5. **Needle & live thread:** the needle tip follows the active stitch and dips at both ends; the thread is a `TubeGeometry` rebuilt each frame from the needle eye.
6. **Macro camera:** tracks the needle tip during the hook, rises and arcs while the flower fills, reveals hoop and songket, then a warm grazing light sweeps across for the gold payoff.
7. **Overlay:** safe-zone title, stitch counter, beat kicker, badge `SULAMFORGE // 59`, `Creator: AUDIRA`.

## Story Arc (example)

| Time | Beat |
| --- | --- |
| 0–2.4 s | Hook: macro on the needle laying the first satin petal |
| 2.4–5.6 s | Remaining petals fill, accelerating |
| 5.2–7.6 s | Stem and fishbone leaves; French knots bloom at 6 s |
| 7.4–9.2 s | Gold diamond ring; camera reveals the hoop and songket |
| 9.0–11.2 s | Payoff: gold petal outlines + light sweep glints across gold floats |

## Known Limits

- Stitches are straight cylinders; satin fills read slightly faceted at the petal tips in extreme macro.
- No thread twist texture (radius ~6 mm in scene units is too small to show it at 540 px).
- The pattern is authored in `lib/pattern.ts`; a new motif needs its own stitch generator (shapes + timing).
