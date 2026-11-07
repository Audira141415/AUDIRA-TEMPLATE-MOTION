# STYLE DNA: Sports Tactic Board — Geometry & Mesh Topology
# AUDIRA STYLE DNA LIBRARY

---

## 1. Primary Mesh Archetypes
- **Pitch Board:** 6.8 x 10.4 field of play + 0.18 run-off, on a composite slab with a brushed aluminium lip.
- **Puck Tokens:** cylinder `r 0.17, h 0.075` (32 segments) on a white base ring; material array side/top/bottom with the number on the top face.
- **Goals:** 0.8 wide, 0.26 tall cylinder posts, alpha-grid nets (back, roof, sides); the back net bulges on a goal.
- **Telestrator:** TubeGeometry lanes (radius 0.022) revealed by `drawRange`; instanced dash boxes + triangular cone head for runs; instanced trail spheres.
- **Stadium Bowl:** open back-faced cylinder tiers and 4,200 instanced light dots; four floodlight towers.

---

## 2. Staging Layers
- Layer 1 (Foreground): near tokens and the ball trail when the camera is low.
- Layer 2 (Subject): ball holder with yellow halo, active lane / run arrow.
- Layer 3 (Middle Ground): full pitch with both formations, goals and nets.
- Layer 4 (Background): stadium bowl bokeh, floodlight glows, fog falloff.
- Layer 5 (HUD): score bug, minute clock, formation chips, step card.
