# MANUSCRIPT — Kit Guide

> Style ID: 67. Illuminated manuscript and lontar palm-leaf books by candlelight: an open codex on a slanted lectern with a raised gold-leaf initial that gleams, ink lines being written by a quill one after another, and a Balinese-style lontar bundle (incised palm-leaf strips on a cord between wooden covers) that fans open. Parchment, lapis, vermilion rubrics and gold. All script is pseudo-script.

## Quick Start

```tsx
import { ManuscriptExample } from "./example/ManuscriptExample";
import { CodexLectern3D, quillPoint, INITIAL_POS } from "./scene/CodexLectern3D";
import { LontarBundle3D, LONTAR_POS } from "./scene/LontarBundle3D";
import { CandleLight3D } from "./scene/CandleLight3D";
import { getManuscriptCamera } from "./camera/rig";
import { ManuscriptOverlay } from "./camera/Overlay";
import { computeManuscriptState, lineProgress, pageToWorld, LECTERN } from "./core/motion";
import { drawPseudoLine, makeLontarTexture } from "./lib/materials";
```

Compositions: `ManuscriptPreview` (540x960@30) and `ManuscriptFinal` (1080x1920@60), 12 s.

## Signature Motion & Style Rules

1. **Candles are the key light:** two beeswax candles (point lights `#FFAD55`, decay 1.6, value-noise flicker), one casting soft shadows; ambient stays low and warm.
2. **Gold leaf is a raised plate:** the initial ornament is a separate plane with an `alphaMap`, metalness 0.9, PMREM reflections and an emissive pulse; a small gleam light glides across it in the hook and the payoff.
3. **Ink is written, not faded:** each line is its own strip whose width and texture `repeat.x` grow together (`lineProgress`), so strokes appear left to right under the quill nib.
4. **Lontar is physical:** 18 palm-leaf boxes with incised pseudo-glyph textures on top faces, a cord through the centre hole, carved covers; the top cover lifts away and the leaves fan around the cord.
5. **Pseudo-script only:** `drawPseudoLine` (minims, diamonds, ascenders) and the lontar loops are invented and unreadable; the initial is an abstract knot, not a letter.
6. **Camera:** gold-initial macro, follow the quill, track to the lontar, pull back to reveal the desk.
7. **Distinct from** VINTAGEFORGE (sepia copperplate engraving) and ISLAMICDOCUMENTARY (geometry and domes): here the story is handmade books, gold leaf, lapis, rubrics and palm leaves.

## Story Arc (example)

| Time | Beat |
| --- | --- |
| 0–2 s | Hook: macro on the gold-leaf initial as a candle gleam slides across it |
| 1.9–8.6 s | Quill writes 12 lines on the right page (one rubric line in red) |
| 5.4–7.2 s | Camera moves to the lontar; cover lifts (5.6–6.6 s) |
| 6.2–9.2 s | Lontar leaves fan open around the cord |
| 8.6–11 s | Payoff: pull back to the whole desk, initial flares |

## Known Limits

- Pages are flat planes in a shallow V; there is no page-turn simulation.
- The gold initial reads as warm gold in candlelight but not mirror-bright; raise `envMapIntensity` if a scene has a brighter environment.
- In the macro hook the parchment is near white; keep candle intensity at or below 2.6 when pushing closer.
