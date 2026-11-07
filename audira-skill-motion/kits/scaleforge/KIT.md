# SCALEFORGE — Kit Guide

> Extreme scale comparison as one continuous logarithmic zoom-out: an ant, a person, a skyscraper, a mountain, Earth and the Sun, each standing on a measuring ruler whose ticks re-decade as you zoom, with order-of-magnitude labels (10⁻³ m … 10⁹ m), a live frame-size readout and a white measuring studio that dissolves into deep space.

Style ID: 49

## Quick Start

```tsx
import { ScaleforgeExample } from "./example/ScaleforgeExample";
import { ScaleObjects3D } from "./scene/ScaleObjects3D";
import { MeasureRuler3D } from "./scene/MeasureRuler3D";
import { ScaleBackdrop3D } from "./scene/ScaleBackdrop3D";
import { getScaleCamera } from "./camera/rig";
import { ScaleOverlay } from "./camera/Overlay";
import { OBJECTS, zoomAt, toRender, fmtLen } from "./core/motion";
```

Compositions: `ScaleforgePreview` (540x960 @ 30) and `ScaleforgeFinal` (1080x1920 @ 60).

## How to adapt it

1. Edit `OBJECTS` in `core/motion.ts`: each subject has a measured size, a real centre and a height, all in metres. Model new subjects in metres with the base on y = 0.
2. Edit the zoom `KEYS`: one key per subject (exponent = log10 of metres per render unit, focus = real point at frame centre). Holds come from the smootherstep easing.
3. Never scale the camera: the zoom is the world transform `(P - C) / S`, so depth buffer and float precision stay healthy from millimetres to millions of kilometres.
4. `visibleSize` culls subjects that are sub-pixel or larger than 800 units; keep that window when adding galaxies or atoms.
5. Swap the backdrop for a zoom-in (Sun → atom): reverse the keys and invert `spaceMix`.

## Signature Motion & Style Rules

1. **One continuous zoom:** no cuts; each subject is held briefly, then the next decade arrives quickly.
2. **Everything is measured:** the ground ruler (major 10^k, minor 10^(k−1)) and an orange height bracket with a `10ⁿ m` label on the subject that fills the frame.
3. **White studio → deep space:** background lerps `#F2F4F7` → `#03050B` between exponents ~3.6 and ~6.2; stars fade in, the floor dissolves.
4. **Readable numbers:** the HUD shows the frame height as `10^x m` plus a human length (cm, m, km, million km) and a vertical log gauge.
5. **Honest sizes, compressed distances:** sizes are rounded real values; spacing between subjects is not to scale and the overlay says so.
