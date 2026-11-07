# STYLE DNA: Y2K Chrome — Geometry & Mesh Topology
# AUDIRA STYLE DNA LIBRARY

---

## 1. Primary Mesh Archetypes
- **Liquid blob:** `SphereGeometry(1, 112, 80)` displaced on the CPU every frame (travelling sine lobes + satellite bulges), normals recomputed.
- **Sparkle star:** superellipse radius $r(\theta) = (|\cos\theta|^{p} + |\sin\theta|^{p})^{-1/p}$, `p = 0.62`, z flattened to 42%.
- **Chrome rings:** two thin tori (R 1.55 / 1.9) on tilted, counter-rotating axes.
- **Mini sparkles:** the same superellipse outline extruded and heavily bevelled (puffy chrome).
- **Clouds:** 9 banks × 8 instanced spheres, squashed ellipsoids.

---

## 2. Sky Staging
- Layer 1 (Foreground): near-lens bubbles at `z ≈ 2.2–3.5`, lens sparkles.
- Layer 2 (Subject): blob at `[0, 0.35, 0]` with rings and minis.
- Layer 3 (Midground): cloud banks at `y ≈ −2.6…−4`, `z ≈ −2…−9`.
- Layer 4 (Background): gradient sky dome (R 45) and sun glow sprite.
