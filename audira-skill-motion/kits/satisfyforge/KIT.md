# SATISFYFORGE — Kit Guide

> Oddly-satisfying loops on a seamless pastel studio sweep: a kinetic-sand block sliced into perfect striped layers, a glass heart filled with three colours that stop exactly on their lines, and pastel shapes dropping into precisely matching holes. Soft blurred shadows, three-quarter studio dolly.

Style ID: 50

## Quick Start

```tsx
import { SatisfyforgeExample } from "./example/SatisfyforgeExample";
import { StudioSweep3D, STATIONS, PLINTH_TOP } from "./scene/StudioSweep3D";
import { SandSlice3D } from "./scene/SandSlice3D";
import { LiquidFill3D } from "./scene/LiquidFill3D";
import { ShapeDrop3D } from "./scene/ShapeDrop3D";
import { getSatisfyforgeCamera } from "./camera/rig";
import { SatisfyforgeOverlay } from "./camera/Overlay";
import { SLICE_TIMES, FILL_LAYERS, DROP_TIMES, settle } from "./core/motion";
```

Compositions: `SatisfyforgePreview` (540x960@30) and `SatisfyforgeFinal` (1080x1920@60).

## Signature Motion & Style Rules

1. **Seamless cyclorama:** floor curves into the wall (radius 2.6) with a peach→lilac vertex gradient; no horizon line, ever.
2. **Exact targets:** every action ends precisely on its mark (slice stack height `k·W`, liquid plane on its line, piece flush in its hole). Arrivals use cubic ease + a tiny damped `settle()` overshoot (≤ 0.04 units).
3. **Soft shadows:** one overhead softbox with `VSMShadowMap`, `shadow-radius 14`; hemisphere fill keeps shadows lilac, never black.
4. **Pastel candy materials:** clearcoat plastic for tools and pieces, roughness 1 + grain bump for sand, glossy clipped volumes for liquid.
5. **Liquid fill by clipping:** the liquid is the mould's inner volume with two world-space clipping planes per layer (`gl.localClippingEnabled = true`). No fluid sim.
6. **Camera:** three-quarter dolly sliding between stations (`stationX`), constant slow sway, final drop toward a top-down view on the payoff.

## Timeline of the example (12 s)

| Time | Beat |
| --- | --- |
| 0–3.9 s | Loop 1 SLICE: chrome blade cuts 8 slices, each flips onto a neat striped stack |
| 4.2–7.6 s | Loop 2 FILL: pink, lilac and mint layers pour into an upright glass heart |
| 8–11.2 s | Loop 3 FIT: circle, square, triangle, star drop into matching holes; star seats at ~10.7 s (payoff glow + "PERFECT FIT") |

## Adapting

- New loop = new station component placed at an `x` in `STATIONS`, driven by its own time table in `core/motion.ts`.
- Keep every repeated element countable and aligned; randomness only from `mulberry32` for decor.
- Overlay text stays inside the safe zone (top 180 px / bottom 380 px of 1080x1920).
