# STYLE DNA: Food Macro Tabletop — Geometry & Mesh Topology
# AUDIRA STYLE DNA LIBRARY

---

## 1. Primary Mesh Archetypes
- **Dishware:** `LatheGeometry` profiles (outer glaze + inner glaze as two lathes), 96 segments, thin rim torus.
- **Noodles:** 24 Catmull-Rom curves swept as `TubeGeometry` (radius 0.021); lifted strands re-solve their first 60% toward the chopstick tip.
- **Toppings:** half-sphere eggs with a textured cut face, sliced cylinders (chashu) with a spiral cross-section texture, a thin nori box.
- **Garnish:** instanced torus rings (scallion), instanced spheres (sesame), instanced discs (chili-oil beads).

---

## 2. Tabletop Staging
- Layer 1 (Foreground): scallion stalks, sesame crumbs, steam, chopsticks.
- Layer 2 (Subject): hero bowl at the origin, broth surface `y = 0.44`.
- Layer 3 (Midground): soy dish, linen napkin, chopstick rest on walnut planks.
- Layer 4 (Background): glow-pool wall at `z = −9.5` and bokeh sprites at `z = −5.5…−9`.
