# UKIYOFORGE — Kit Guide

> Style ID: 57. Japanese woodblock print (ukiyo-e) rendered as layered 3D paper sheets: stylised curling waves with claw foam, a twin-peak mountain, rowing boats, a rising vermilion sun, flat colour fields in Prussian blue, vermilion and ochre, carved key-lines, washi fibre grain, a cartouche title box and a red seal. Original composition; it does not recreate any historical print.

## Quick Start

```tsx
import { UkiyoforgeExample } from "./example/UkiyoforgeExample";
import { PrintLayers3D } from "./scene/PrintLayers3D";
import { GreatCrest3D } from "./scene/GreatCrest3D";
import { PrintLayer } from "./scene/PrintLayer";
import { getUkiyoCamera } from "./camera/rig";
import { UkiyoOverlay } from "./camera/Overlay";
import { computeUkiyoState, depthScale, PRINT_EYE } from "./core/motion";
import { makeWaveRowTexture, makeGreatCurlTexture, makeMountainTexture } from "./lib/materials";
```

Compositions: `UkiyoforgePreview` (540x960@30) and `UkiyoforgeFinal` (1080x1920@60), 12 s.

## Signature Motion & Style Rules

1. **Print-space authoring:** every sheet is placed in print coordinates (u, v) and re-projected to its depth with `depthScale(z) = (PRINT_EYE - z) / PRINT_EYE`. From the print eye (`[0, 0, 9]`) the stack locks into one flat woodblock image; from anywhere else it is a paper diorama with real parallax.
2. **Flat ink, no tone mapping:** `NoToneMapping`, strong warm ambient (1.55) + one soft key (1.1) so Prussian blue, vermilion and ochre stay print-true.
3. **Paper drop shadows:** one directional light with a 2048 PCF-soft shadow map; every cut-out sheet casts and receives (`alphaTest 0.5`), giving the layered-paper depth cue.
4. **Carved key-lines and claws:** all art is canvas-drawn: bokashi gradients, inner carved stripes following the wave face, black key-lines, white foam claws, washi fibres and block grain.
5. **Camera:** hook low in the trough under the crest, glide through the sheets, settle onto the print eye for the payoff, then a slow push-in.
6. **Payoff:** the great crest leans and breaks, foam flecks burst ballistically, the red seal stamps beside the cartouche (ease-out-back).
7. **Pseudo-script only:** cartouche and seal use random brush strokes, never real characters.

## Story Arc (example)

| Time | Beat |
| --- | --- |
| 0–2 s | Hook: under the towering crest, claws and spray overhead |
| 2–8.4 s | Glide between the sheets: wave rows heave, boats ride, sun rises behind the mountain |
| 8.2–10.6 s | Payoff: camera locks onto the print eye, the crest breaks, spray bursts |
| 10.1–10.5 s | Red seal stamps |
| 10.5–12 s | Slow push-in on the finished print |

## Known Limits

- Sheets are flat planes; extreme side angles reveal the cut edges (intended, but keep the camera within about ±35°).
- The wave-plus-mountain motif is a genre convention; keep compositions original (wave from the right, twin peaks, own colour story) and never trace a famous print.
- Shadows use one map over a ±12 m frustum; very close macro shots may show soft shadow edges.
