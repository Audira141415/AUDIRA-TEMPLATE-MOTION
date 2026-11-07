# SKETCHFORGE — Kit Guide

Style ID: 63

> An object is born on a sketchbook page: a pencil draws construction lines and a sketchy oblique drawing, the edges peel off the paper into a 3D wireframe, clay fills the wire bottom-up, one accent colour floods in, and the finished model lifts off the page. Graphite grey, paper cream, one accent.

## Quick Start

```tsx
import { SketchforgeExample } from "./example/SketchforgeExample";
import { SketchbookDesk3D, Pencil3D } from "./scene/SketchbookDesk3D";
import { FlatSketch, LiftWire, pencilTip, useStrokes } from "./scene/HouseSketch3D";
import { HouseSolid3D, ChimneySmoke } from "./scene/HouseSolid3D";
import { buildStrokes, HOUSE } from "./core/house";
import { getSketchCamera } from "./camera/rig";
import { SketchforgeOverlay } from "./camera/Overlay";
import { computeSketchState, flatten } from "./core/motion";
```

Compositions (already registered in `starter/src/Root.tsx`): `SketchforgePreview` (540×960 @ 30) and `SketchforgeFinal` (1080×1920 @ 60), 12 s.

## Files

- `example/SketchforgeExample.tsx` — composition: flat ThreeCanvas with soft shadows, key + cool rim light, CameraRig, lifted house group, overlay
- `core/house.ts` — stroke model of the original little house: edge / construction / hatch strokes with draw windows ∝ length and lift delays by height
- `core/motion.ts` — beats (draw → extrude → clay → colour → lift), `flatten()` oblique page projection, seeded rng, easing
- `scene/HouseSketch3D.tsx` — `FlatSketch` (instanced graphite strokes on the page, double sketchy pass, overshoot) and `LiftWire` (edges lerp from page projection to 3D with a peel arc), `pencilTip`
- `scene/HouseSolid3D.tsx` — solid house behind a rising world-space clip plane (clay pass), per-part clay → final colour lerp, glowing windows, chimney smoke
- `scene/SketchbookDesk3D.tsx` — graphite desk, hard-cover sketchbook, paper CanvasTexture with notes, spiral binding, eraser, shavings, animated pencil
- `lib/materials.ts` — paper, desk and hatch CanvasTextures, colour lerp helper
- `lib/palette.ts` — graphite / paper / single vermilion accent tokens
- `camera/rig.ts` — top-down over the page → orbit down during extrude/clay → around to a low hero angle
- `camera/Overlay.tsx` — study kicker, handwritten title, badge `SKETCHFORGE // 63`, SKETCH/WIRE/CLAY/COLOUR/LIFT stage strip, caption card, credit

## Story Timeline (12 s example)

| Time | Beat |
| --- | --- |
| 0–2.7 s | Hook: pencil draws guides, the oblique house drawing and roof hatching on the sketchbook page |
| 2.5–4.9 s | Edges peel off the paper (low lines first) and extrude into a 3D graphite wireframe; camera orbits down |
| 4.7–7.0 s | Clay pass: a clip plane rises and fills the wire with matte clay |
| 6.9–9.2 s | Colour pass: walls go cream, roof graphite, door/chimney/frames vermilion, windows glow |
| 9.0–12 s | Payoff: the finished house lifts off the page with a soft overshoot, chimney smoke, low hero angle over the original sketch |

## Signature Motion & Style Rules

1. **Three hue families:** Graphite greys, paper creams and ONE accent. The 'full colour' stage is built only from these; swap the accent per episode, never add a second.
2. **The sketch stays:** `FlatSketch` remains on the page after the object lifts — the viewer must always see where it came from.
3. **Lines lift low-to-high:** Each edge's lift delay ∝ its height, with a small peel arc; construction lines never lift, they fade like soft erasing.
4. **Fill is a clip plane:** Clay appears behind a world-space clipping plane (`gl.localClippingEnabled`); include the lift offset in its constant.
5. **Flat colour output:** Render `flat` (no tone mapping) so cream and graphite stay true; a warm key + cool rim give the 3D read.
6. **New objects = new stroke model:** For a sneaker, chair or gadget write a new `buildStrokes()` + solid component; keep the same phases.

## Determinism

Every pose, glitch and particle is derived from `useCurrentFrame()` (normalised to a 60 fps clock `f`). No `useFrame` animation, no `Date`, no unseeded `Math.random` (seeded `rng()` in `core/motion.ts`), no network textures — all textures are procedural `CanvasTexture`s or shaders.
