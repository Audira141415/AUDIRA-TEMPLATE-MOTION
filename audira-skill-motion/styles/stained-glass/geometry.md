# STYLE DNA: Stained Glass — Geometry & Mesh Topology
# AUDIRA STYLE DNA LIBRARY

---

## 1. Primary Mesh Archetypes
- **Lancet:** rectangle `3.0 × 5.0` + equilateral pointed arch (radius 3, apex y ≈ 4.6), built as a `THREE.Shape` used for the lead backing and the wall hole.
- **Rose:** centre disc + rings of 8 / 16 / 32 `RingGeometry` sectors (gap-inset), with raised torus leads at r = 0.315 / 0.695 / 0.995 / 1.215.
- **Quarries:** diamond lattice (half sizes 0.17 × 0.24), inset 16 %, one `InstancedMesh` with per-instance colour.
- **Wall:** `ExtrudeGeometry` (depth 0.7, bevel 0.06) with the lancet hole, giving a deep splayed reveal.
- **Nave:** flagstone floor plane, two foreground columns with plinths, iron saddle bars.

---

## 2. Depth Staging
- Background: blackened space behind the glass.
- Midground: the window in its stone reveal.
- Foreground: columns, dust motes, coloured floor pool, light shafts.
- HUD: kicker, serif title, pane counter caption.
