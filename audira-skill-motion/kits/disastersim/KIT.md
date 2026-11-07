# DISASTERSIM — Kit Guide

> Calm, educational geohazard explainer on a sliced earth block: layered continental crust, a subducting oceanic slab, a glowing mantle, a locked fault that loads and slips, seismic rings, then a tsunami that slows and steepens toward a coastal town model, with a magnitude readout, seismograph and a warning-level ramp.

Style ID: 48

## Quick Start

```tsx
import { DisastersimExample } from "./example/DisastersimExample";
import { EarthBlock3D } from "./scene/EarthBlock3D";
import { TsunamiWater3D } from "./scene/TsunamiWater3D";
import { CoastalTown3D } from "./scene/CoastalTown3D";
import { getDisasterCamera } from "./camera/rig";
import { DisasterOverlay } from "./camera/Overlay";
import { EVENT, waveH, surfaceY, slabTop } from "./core/motion";
```

Compositions: `DisastersimPreview` (540x960 @ 30) and `DisastersimFinal` (1080x1920 @ 60).

## How to adapt it

1. Change the margin profile in `core/motion.ts`: `LAND_PTS` (seafloor + coast + hill) and `slabTop` (slab dip). The extruded block, land skin and water curtain all rebuild from these.
2. Retime the event with `EVENT` (slip, magnitude count, route on, shoreline arrival). `waveH` derives the landward and seaward pulses from these times.
3. For other hazards keep the block and swap the payload: a volcano (magma chamber in the mantle texture), a landslide (rotate a crust wedge), liquefaction (shake the town instances).
4. Labels are sprites made by `makeLabel`; give each a time window so no more than two are on screen.

## Signature Motion & Style Rules

1. **Cut-face first:** the front of the block is the explainer surface (strata textures, fault line, rings, chevrons). Always open on it.
2. **Calm, not sensational:** no destruction, no victims, no red screen flashes. The payoff is people having a route to high ground, shown by the green route and beacon.
3. **Warning colours are a ramp:** teal MONITORING, yellow ADVISORY, orange WARNING, red-orange MOVE TO HIGH GROUND. Use only these for hazard state.
4. **Physically honest wave:** low and long offshore, slower and taller near shore (shoaling), plus a seaward pulse. Never a surfing curl.
5. **Lab setting:** slate void, plinth and floor grid, fine dust in the foreground. Mark scenarios as fictional unless the brief cites a real event and its sources.
