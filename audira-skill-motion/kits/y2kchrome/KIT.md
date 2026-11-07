# Y2KCHROME — Kit Guide

> Y2K / Frutiger-aero: a lettering-free liquid-chrome blob floating above glossy clouds in an aqua sky, iridescent soap bubbles, chrome rings and four-point lens sparkles, playful bounce, and a payoff morph into a chrome sparkle star.

Style ID: 54

## Quick Start

```tsx
import { Y2kchromeExample } from "./example/Y2kchromeExample";
import { SkyDome3D } from "./scene/SkyDome3D";
import { ChromeBlob3D, BLOB_CENTER } from "./scene/ChromeBlob3D";
import { Bubbles3D } from "./scene/Bubbles3D";
import { getY2kchromeCamera } from "./camera/rig";
import { Y2kchromeOverlay } from "./camera/Overlay";
import { makeEnvScene, chromeMaterial, bubbleMaterial } from "./lib/materials";
import { computeBlobState } from "./core/motion";
```

Compositions: `Y2kchromePreview` (540x960@30) and `Y2kchromeFinal` (1080x1920@60).

## Signature Motion & Style Rules

1. **Sky-reflecting chrome:** chrome (metalness 1, roughness 0.04, light iridescence) is lit by a procedural sky env scene (`makeEnvScene`): blue zenith, white horizon, mint underglow, bright softbox panels and thin pink/lime/cyan streaks. Never use a grey studio env here.
2. **Aqua sky, glossy clouds:** vertex-gradient dome (`#1259E8 → #3FB8FF → #E9FBFF → #7EE8D6`) and instanced sheen clouds below the hero.
3. **Bubbles:** transparent physical spheres with `iridescence 1`, opacity ~0.32, envMapIntensity 2.2; some sit very close to the lens as foreground.
4. **Liquid wobble, not spikes:** the blob is a sphere displaced by smooth travelling sine lobes (no ferrofluid spikes, unlike FLUIDFORGE); satellites bulge it like metaballs before merging.
5. **Playful bounce:** impacts drive squash/stretch with `sin(13a)·e^{-3.2a}`; the morph uses `easeOutElastic`.
6. **No lettering on 3D objects** and no brand logos; Y2K type lives only in the HUD (glossy aero pills, blue gradient title).

## Timeline of the example (12 s)

| Time | Beat |
| --- | --- |
| 0–1.05 s | Hook: a chrome drop falls and splashes into the blob (crown droplets) |
| 1–8.4 s | Blob wobbles; three satellite droplets orbit and merge (4.6, 5.6, 6.6 s); rings and mini sparkles orbit |
| 8.6–9.9 s | Payoff: blob snaps into a four-point chrome sparkle star with elastic overshoot |
| 10.1 s | Bubble pop + lens flare, rings expand |

## Adapting

- Swap the hero morph target via `starRadius` (any polar function works: heart, flower, rounded star).
- Keep vertex count of the blob near 112×80; it is rebuilt on the CPU every frame.
- Overlay text stays inside the safe zone (top 180 px / bottom 380 px of 1080x1920).
