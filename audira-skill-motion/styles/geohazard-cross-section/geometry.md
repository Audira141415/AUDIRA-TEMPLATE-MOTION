# STYLE DNA: Geohazard Cross-Section — Geometry & Mesh Topology
# AUDIRA STYLE DNA LIBRARY

---

## 1. Primary Mesh Archetypes
- **Earth Block:** three `ExtrudeGeometry` bodies (crust, slab, mantle) from 2D profiles, depth 3.6, front cut face at z = +1.8.
- **Land Skin:** 100x8 plane displaced to `surfaceY(x)` with vertex colours (shelf / sand / grass).
- **Sea:** 150x16 surface grid displaced by `waveH` every frame + a triangle-strip curtain on the cut face from crest to seafloor.
- **Fault:** tube along `slabTop` (radius 0.022) + additive glow tube (0.07).
- **Town:** 44 instanced box houses + 4-sided cone roofs, 80 instanced cone trees, 34 instanced route dots, beacon cylinder.

---

## 2. Staging Layers
- Layer 1 (Foreground): drifting lab dust (instanced, 140).
- Layer 2 (Subject): fault, hypocentre and rings; later the wave crest.
- Layer 3 (Middle Ground): strata, slab, mantle, sea, town.
- Layer 4 (Background): plinth, floor grid fading into the slate void.
- Layer 5 (HUD): magnitude, seismograph, ETA, warning ramp, stage caption, sprite labels.
