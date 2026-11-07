# STYLE DNA: Classical Marble Museum — Geometry & Mesh Topology
# AUDIRA STYLE DNA LIBRARY

---

## 1. Primary Mesh Archetypes
- **Head:** `SphereGeometry(1, 180, 140)` displaced along normals by gaussian chisel features (jaw taper, brow ridge, sockets + blank eyeballs, nose bridge→tip, nostril wings, cheekbones, lips with parting groove, chin, ears), scaled `(0.86, 1.0, 0.95) × 0.4`.
- **Hair & Beard:** hair-cap and beard-mass ellipsoids + 420 / 300 instanced drill-cut locks (twisted squashed spheres) oriented to the surface normal.
- **Torso:** partial sphere with diagonal himation folds (`sin(22·d) + sin(47·d)` over the left side), neck cylinder, turned `LatheGeometry` socle.
- **Plinth:** base, shaft and cornice boxes in a cooler marble.
- **Architecture:** fluted columns (96-segment cylinder, 20 flutes by vertex displacement) with torus base and echinus/abacus capital; walls with dado and gilt rail; coffered ceiling with a skylight opening; gilded frame (outer + inner fillet).

---

## 2. Depth Staging
- Background: oxblood wall, gilded painting, back columns.
- Midground: the bust on its plinth.
- Foreground: skylight beam, dust motes, near columns sliding past the orbit.
- HUD: kicker, serif title, wall-label card.
