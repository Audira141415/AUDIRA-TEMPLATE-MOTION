# STYLE DNA: Ukiyo-e Woodblock — Geometry & Mesh Topology
# AUDIRA STYLE DNA LIBRARY

---

## 1. Primary Mesh Archetypes
- **PrintLayer:** a unit plane with a canvas texture, scaled and positioned from print coordinates (u, v, w, h) and its depth z.
- **Sky Sheet:** 10 x 11 print units at z = -11 (oversized so it never shows an edge).
- **Sun, Clouds, Mountain:** z = -10.6, -10 / -9.5, -8.5.
- **Wave Rows:** five 8-unit-wide sheets at z = -7, -5.5, -4, -2.4, +0.6 (9, 6, 4, 3, 2.4 crests; amplitude grows toward the viewer).
- **Boats:** two sheets tucked between wave rows at z = -4.7 and -3.1.
- **Great Crest:** 3.3 x 6.6 sheet at z = -1, crest top near v = 2, lip near u = -0.1.
- **Spray:** 140 instanced circles with keyline dot texture, depth 0.05–1.25 m in front of the crest.
- **Cartouche & Seal:** z = -0.4 / -0.3, left margin.

---

## 2. Depth Staging
- Layer 1 (Foreground): front wave row, spray, cartouche, seal.
- Layer 2 (Subject): the great crest.
- Layer 3 (Middle Ground): wave rows and boats.
- Layer 4 (Background): mountain, clouds, sun, sky.
- Layer 5 (HUD): washi title card with vermilion rule, vermilion badge, quote card, credit chip.
