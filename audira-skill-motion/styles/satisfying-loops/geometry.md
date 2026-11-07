# STYLE DNA: Satisfying Loops — Geometry & Mesh Topology
# AUDIRA STYLE DNA LIBRARY

---

## 1. Primary Mesh Archetypes
- **Cyclorama:** one `PlaneGeometry` (1×80 segments) bent into floor → quarter arc (R 2.6) → wall, vertex-coloured.
- **Sand block:** 8 slices × 4 strata boxes (`W 0.15`, `H 0.6`, `D 0.8`); slice k flips onto a stack at height `k·W`.
- **Heart mould:** `ExtrudeGeometry` of a bezier heart (depth 0.42, bevel 0.03); liquid = same outline at 94% scale.
- **Shape board:** rounded-rectangle `Shape` with 4 holes (circle, square, triangle, star) extruded 0.22; pieces use the same outlines minus a 0.03 clearance.

---

## 2. Studio Staging
- Layer 1 (Foreground): glossy candy spheres at `z ≈ 2.2–3.0`.
- Layer 2 (Subject): station object on its plinth (`PLINTH_TOP = 0.14`).
- Layer 3 (Midground): neighbouring stations visible at the frame edges during glides.
- Layer 4 (Background): pastel decor at `z ≈ −3.2…−4.1` against the curved wall.
