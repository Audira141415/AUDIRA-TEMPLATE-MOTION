# STYLE DNA: Pencil Sketch to 3D (SKETCHFORGE) — Geometry & Mesh Topology
# AUDIRA STYLE DNA LIBRARY

---

## 1. Stroke Model
- Every visible edge of the object is a stroke `{a, b, kind}` in 3D.
- `flatten(p) = (x + 0.42z, 0, 0.5z − 0.95y + 0.35)` — an oblique projection that reads as a hand drawing seen from above.
- Strokes render as instanced unit cylinders (one draw call per set).

## 2. Solid Model
- Box walls, extruded triangular gables, two rotated roof slabs, chimney, door, porch, framed windows.
- Same dimensions as the stroke model (`HOUSE`), so wire and solid coincide.
