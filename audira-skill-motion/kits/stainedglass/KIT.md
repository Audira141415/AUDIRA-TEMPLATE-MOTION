# STAINEDGLASS — Kit Guide

> Style ID: 58

> Stained-Glass Leadlight: a pointed lancet window with a rose at its crown, built from 273 jewel-tone pot-metal panes set in dark lead cames. Panes fly in and seat piece by piece (rose first, then diamond quarries top-down) into an original scene — sky, a fruiting tree, hills and a river — while the camera pulls back through a stone nave. At the payoff the sun flares through the rose and paints coloured light pools on the flagstones, with dust motes drifting in the shafts.

## Quick Start

```tsx
import { StainedglassExample } from "./example/StainedglassExample";
import { LeadlightWindow3D } from "./scene/LeadlightWindow3D"; // instanced diamond quarries, rose segments, lead, saddle bars, sun flare
import { Nave3D } from "./scene/Nave3D"; // splayed stone wall, flagstones, columns, light shafts, floor light pool, dust motes
import { buildPanes, lancetShape, insideLancet } from "./lib/window"; // window layout + the "cartoon" colour function
import { getStainedCamera } from "./camera/rig";
import { StainedglassOverlay } from "./camera/Overlay";
import { StainedCameraRig, StainedPost } from "./lib/post";
```

To change the picture, edit `picture(x, y, …)` in `lib/window.ts`: it returns the glass colour for each quarry centre. The floor pool texture is generated from the same pane list, so the light on the floor always matches the window.

## Signature Motion & Style Rules

1. **One colour per pane:** never gradient a pane; variation comes from the seedy-glass texture (streaks, bubbles, thicker edges) and ±8 % tone jitter.
2. **Lead is the drawing:** panes are inset 16 % so the dark came (`#1A1B1E`, metal 0.7) shows between them; rose rings get raised torus leads; iron saddle bars cross the lancet.
3. **Glass is lit from behind:** panes use unlit `MeshBasicMaterial` whose colour = pane colour × `sunGlow(t)`; bloom threshold 0.82 so only the brightest glass and the sun flare bloom.
4. **Assembly grammar:** each pane flies from the nave side (z +2.4…+5), tumbling, and seats with `easeOutBack`; a glint flashes on seating and decays (`exp(-3.2 s)`). Order: rose heart → rose rings → quarries from the apex down to the sill.
5. **Light must land:** the floor pool (blurred window image, additive) and four tinted shafts scale with `assembled(t) × sunGlow(t)`.
6. **Camera:** nose-to-glass on the rose heart (hook) → reverent pull-back through the nave → low final framing with the floor pool in the foreground and the window above.

## Do / Don't

- Do keep jewel tones saturated (ruby, sapphire, emerald, amber, gold); avoid pastel or clear glass (that is GLASSCRAFT) and gold-seam ceramics (that is KINTSUGI).
- Do keep imagery original and non-figurative or simple (trees, suns, birds, boats); no religious figures copied from real windows, no logos.
- Don't light the stone brighter than the glass: the window must be the brightest object in frame.
