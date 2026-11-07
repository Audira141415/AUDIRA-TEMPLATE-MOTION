# MOSAICFORGE — Kit Guide

> Style ID: 60

> Tessellated Mosaic: 6,700 hand-cut tesserae (instanced glazed ceramic + gold smalti) rain down and settle in a wave into an original picture — a rising sun-bird over a gilded sun on a lapis field, framed by a terracotta key border. Each tile follows the contours of the image (andamento), sits with a slight per-tile tilt so the raking light glints across the glaze, and the camera glides low over the grout bed before rising overhead to reveal the whole image.

## Quick Start

```tsx
import { MosaicforgeExample } from "./example/MosaicforgeExample";
import { TesseraeField3D, TESSERAE_COUNT } from "./scene/TesseraeField3D"; // two InstancedMeshes, drop + settle per tile
import { MosaicHall3D } from "./scene/MosaicHall3D"; // grout bed, stone surround, raking key, RoomEnvironment, dust
import { layTiles, sample, birdSdf } from "./lib/image"; // the SDF "cartoon" + tile layout and orientation
import { getMosaicCamera } from "./camera/rig";
import { MosaicforgeOverlay } from "./camera/Overlay";
import { MosaicCameraRig, MosaicPost } from "./lib/post";
```

To make a new picture, replace `birdSdf` / `sample` in `lib/image.ts`: return a colour, a `gold` flag and a rotation (contour angle) for any point on the 6 × 9 panel. Picture "up" is world −z.

## Signature Motion & Style Rules

1. **Single-colour stones:** every tessera is one flat colour with ±9 % tone jitter; the image lives in the arrangement, never in a texture.
2. **Andamento:** tiles rotate to the gradient of the subject's signed distance field near shapes, and to circles around the sun in the background; a dark umber outline row traces every shape.
3. **Two materials only:** glazed ceramic (`MeshPhysicalMaterial`, clearcoat 0.7) and gold smalti (metal 1.0, roughness 0.32) lit by a procedural `RoomEnvironment` (no network HDRI).
4. **Imperfect setting:** grid jitter ±6 mm, size 90–97 % of pitch, tilt ±0.045 rad so the glaze catches light differently per tile; grout `#8F806B` stays darker than every tile.
5. **Drop grammar:** each tile falls from 2.2–4.8 units with a spin that decays, lands at 72 % of its 1.1 s flight, hops once (6 %), then sits. The wave runs from the near edge to the far edge (`tileDelay`).
6. **Camera:** low glide behind the settling wave (tiles rain past the lens) → continuous rise to near-overhead (y ≈ 12.6) for the full reveal at ~9–11 s.

## Do / Don't

- Do keep the palette to terracotta, lapis, ochre, cream and gold; bright modern colours break the material truth.
- Do keep the subject bold and outlined: mosaics read at distance through silhouette.
- Don't use photos or textures for the picture, and don't copy real mosaics or logos.
