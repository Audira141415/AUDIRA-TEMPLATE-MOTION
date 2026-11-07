# STYLE DNA: Gacha Card Reveal — Geometry & Mesh Topology
# AUDIRA STYLE DNA LIBRARY

---

## 1. Primary Mesh Archetypes
- **Capsule:** two hemispheres (R 0.62) scaled 1.28 in y into an egg, metallic gold band, icosahedron core + glow sprite, crack planes oriented on the shell normal.
- **Pedestal:** 6-sided cylinder (r 0.95/1.1, h 0.55) with a hexagonal emissive rim ring.
- **Card:** 1.2 × 1.7 × 0.025 box edge, front and back planes, foil overlay plane.
- **Confetti:** 520 instanced quads (0.07 × 0.11) with per-instance colour.
- **Beams:** additive planes 7 units tall with a vertical falloff texture.

---

## 2. Stage Staging
- Layer 1 (Foreground): confetti, shockwaves, gold motes, card aura.
- Layer 2 (Subject): capsule at `CAPSULE_CENTER`, then the card at `CARD_REST [0, 2.05, 0.4]`.
- Layer 3 (Midground): pedestal, floor rings (r 1.3–3.7), floor hotspot.
- Layer 4 (Background): beams (r 2.4–3.6), back bloom at `z = −4`, star field (r 9–15).
