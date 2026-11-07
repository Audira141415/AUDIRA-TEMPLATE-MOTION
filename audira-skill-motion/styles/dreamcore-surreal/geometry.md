# STYLE DNA: Dreamcore Surreal — Geometry & Mesh Topology
# AUDIRA STYLE DNA LIBRARY

---

## 1. Primary Mesh Archetypes
- **Pool Room:** 7 × 5.5 × 12.5 box of tiled planes, ledges, ladder rails; far wall is an `ExtrudeGeometry` with a round-arch hole (half width 1.8, springing 3.0).
- **Floating Door:** two posts + lintel, a doorway plane with a sky gradient, a hinged leaf with two raised panels and a brass knob, an additive light pool on the water.
- **Stairs to Nowhere:** 18 boxes (1.5 × 0.2 × 0.5) rising 0.2 / running 0.42, a stringer underneath, a door on the top step.
- **Clouds:** 6 clusters × 26 instanced spheres (one `InstancedMesh`), sizes 0.85 indoors to 5.2 outside.
- **Water:** 200 × 200 plane; **Sky:** sphere radius 90 with a gradient shader; **Bubbles:** 48 instanced iridescent spheres.

---

## 2. Depth Staging
- Background: sky dome, giant clouds, distant arch.
- Midground: doors on the water, stairs to nowhere, the arch wall.
- Foreground: tiled ledges, indoor clouds, bubbles drifting past the lens.
- HUD: dream-log kicker, title, caption.
