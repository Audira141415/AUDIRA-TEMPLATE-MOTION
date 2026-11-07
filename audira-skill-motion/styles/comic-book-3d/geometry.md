# STYLE DNA: Comic Book 3D (COMICFORGE) — Geometry & Mesh Topology
# AUDIRA STYLE DNA LIBRARY

---

## 1. Primary Mesh Archetypes
- **Hero:** capsules, spheres and cones with chunky proportions; cape as a 3-segment rigid hinge chain.
- **City:** instanced boxes (one draw call for bodies, one for ink hulls, one for windows).
- **Pages:** `ShapeGeometry` with a rectangular hole + 4 black card-thickness border boxes.
- **Burst:** jittered 14-point star shapes stacked black / yellow / red + lettering plane.

## 2. Ink Hull Rules
- Smooth meshes: back-face hull pushed out along normals (`uThick` 0.02–0.07).
- Boxes: scaled duplicate box with `BackSide` black (split normals would crack an extruded hull).
