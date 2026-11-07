# ANATOMIX — Kit Guide

> Hospital-grade medical anatomy explainer: a stylised, non-gory heart with a glossy myocardium that turns translucent to reveal four chambers, valves and glass-like great vessels, red and blue blood-flow particles that surge on every 72 BPM beat, clinical teal hologram rings, a scanning slice, and HUD labels with leader lines projected from 3D anchors.

Style ID: 56

## Quick Start

```tsx
import { AnatomixExample } from "./example/AnatomixExample";
import { Heart3D } from "./scene/Heart3D";
import { BloodFlow3D } from "./scene/BloodFlow3D";
import { HoloSuite3D } from "./scene/HoloSuite3D";
import { getAnatomyCamera, projectToScreen } from "./camera/rig";
import { AnatomyOverlay } from "./camera/Overlay";
import { beat, ANCHORS, VESSELS, BLUE_PATHS, RED_PATHS } from "./core/motion";
```

Compositions: `AnatomixPreview` (540x960 @ 30) and `AnatomixFinal` (1080x1920 @ 60).

## How to adapt it

1. New organ: replace `heartify` (a deform of a unit sphere) and the chamber ellipsoids; lungs = two heartify-style deforms + a bronchial tree of tubes; kidney = bean deform + ureter tube.
2. Flow: edit `BLUE_PATHS` / `RED_PATHS` (Catmull-Rom centre-lines through chambers and vessels). Particles ride them with `flowPhase`, which surges once per beat.
3. Labels: add an entry to `ANCHORS` (world point, side, colour) and a time in `TL.labels`. The overlay projects it with the same camera pose, so leader lines always land on the anatomy.
4. Rhythm: change `BPM`; the lub-dub envelope, chamber squeeze, ECG trace and particle surge all follow.

## Signature Motion & Style Rules

1. **Stylised and clean, never gory:** glossy clearcoat tissue, no blood splatter, no open wounds, no realistic cadaver detail.
2. **Colour is physiology:** red `#FF3B4A` = oxygen-rich, blue `#3B7BFF` = oxygen-poor, teal `#3FE0D0` = instrument/hologram. Do not use red or blue for anything else.
3. **Reveal, then explain:** open on the opaque beating organ (hook), fade the wall to ~22% to show the inside, then add circuits one at a time.
4. **Labels are HUD, not 3D text:** crisp HTML cards with leader lines from projected anchors, kept in the side columns of the safe zone.
5. **Always say it is a stylised educational model;** never give diagnosis or treatment advice.
