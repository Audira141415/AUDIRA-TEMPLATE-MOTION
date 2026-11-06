# STYLE DNA: 3D Toy Diorama — Geometry & Mesh Topology
# AUDIRA STYLE DNA LIBRARY

---

## 1. Primary Mesh Archetypes
- **Body & Limbs:** Chunky, beveled rectangular prisms with cylindrical joints.
- **Head & Torso:** Softened cuboid with significant fillet bevels (`bevelRadius: 0.08 - 0.12`).
- **Eyes & Features:** Flush 2.5D geometric tokens (circles/arcs) mapped onto the face mesh.
- **Stage Environment:**
  - *Floor:* Horizontal beveled wood planks (4-6 planks across the stage).
  - *Scenery Flats:* Tiered 2.5D cardboard cutouts (hills, trees, clouds) mounted on thin vertical wooden dowel pins.
  - *Footlights:* Row of 7 miniature half-spherical brass housing fixtures along the stage apron.

---

## 2. Poly Budget & Edge Smoothing
- **Poly Budget:** Low-to-Mid Poly (`15,000 - 35,000 triangles` per hero character).
- **Edge Softening:** Continuous curvature (Fillet / Chamfer) with minimum 3 subdivision segments on all corners to ensure soft tactile catch-lights.
- **Silhouette Rule:** Chunky, clear toy-like proportions. Silhouette must be readable from 20 feet away.
- **Strict Avoidance:** No photorealistic organic skin creases, no razor-sharp CAD corners (`bevel < 0.01` is forbidden).

