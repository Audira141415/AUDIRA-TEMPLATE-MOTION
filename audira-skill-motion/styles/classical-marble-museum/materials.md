# STYLE DNA: Classical Marble Museum — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Extras | Notes |
| --- | --- | --- | --- | --- | --- |
| **Statuary Marble** | `#E9DFCF` + world-space veins | `0.30` | `0.00` | clearcoat 0.25, sheen 0.15, emissive `#3A2A1C` × 0.04 | Veins: two sine fields warped by 5-octave fbm, grey→umber |
| **Plinth / Columns** | `#E7E1D7` / `#E4DDD1` | `0.38–0.40` | `0.00` | vein strength 0.4–0.45 | Cooler, quieter stone than the bust |
| **Gilt Frame & Rail** | `#C99A3E` | `0.28` | `1.00` | env 1.1 | Reflects the procedural environment |
| **Gallery Walls** | `#5A1A17` | `0.85` | `0.00` | — | Dado `#2E0E0C`, gilt rail |
| **Polished Floor** | Two-tone slabs `#CFC6B8 / #26221E` | `0.16` | `0.05` | env 0.8 | Canvas texture with fine veins and joints |
| **Painting** | Original dusk landscape canvas | `0.70` | `0.00` | — | Loose oil-stroke texture |

---

## 2. Rules
- Vein the marble in world space so seams never show on sculpted or instanced parts.
- Keep emissive lift tiny: subsurface is suggested by the warm rim, not by glow.
