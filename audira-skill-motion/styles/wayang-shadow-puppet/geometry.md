# STYLE DNA: Wayang Shadow Puppet — Geometry & Mesh Topology
# AUDIRA STYLE DNA LIBRARY

---

## 1. Primary Mesh Archetypes
- **Kelir:** two 5.0 x 2.6 m planes back to back (lit front, glowing back) with parang batik bands top and bottom.
- **Gawangan Frame:** carved posts (0.24 m boxes), top beam, kawung batik panel, gold finials and rail.
- **Gedebog:** two horizontal cylinders (r 0.16, 7.8 m) at y 0.5–0.57.
- **Puppets:** single planes (aspect 1:2) with canvas colour texture and `alphaTest 0.45`, a horn-rod cylinder (cempurit) running into the gedebog. Kesatria and raksasa 1.5 m, gunungan 1.9 m, simpingan 1.15 m.
- **Projected Shadows:** unit planes scaled by `k * size`, placed at z = +0.007 (front) and z = -0.008 (back, double-sided).
- **Blencong:** bronze ellipsoid vessel, ring handle, hanging chain, teardrop flame, additive glow sprite.
- **Gamelan & Hall:** two hanging gongs with bosses, a six-pot kettle rack, four pendopo pillars with batik bases.

---

## 2. Depth Staging
- Layer 1 (Foreground): gongs (left), kettle rack (right), blencong.
- Layer 2 (Subject): puppets on rods, z 0.2–1.05.
- Layer 3 (Screen): kelir with shadows, z 0.
- Layer 4 (Background): carved frame, batik panel, pendopo pillars, indigo hall fog (7–18 m).
- Layer 5 (HUD): amber kicker, serif title, indigo/gold badge, quote card, credit.
