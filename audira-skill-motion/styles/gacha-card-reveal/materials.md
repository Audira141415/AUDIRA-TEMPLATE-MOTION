# STYLE DNA: Gacha Card Reveal — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Special | Notes |
| --- | --- | --- | --- | --- | --- |
| **Card front** | Canvas art | `0.22` | `0.25` | iridescence 0.8, clearcoat 1, emissiveMap 0.55 | always readable |
| **Foil overlay** | Rainbow diffraction canvas | — | — | additive, opacity 0.16–0.28, UV scroll | |
| **Card back / edge** | Navy emblem / gold `#C48A1E` | `0.25–0.3` | `0.3–0.9` | clearcoat | |
| **Capsule shell** | `#A8F0FF`, opacity 0.42 | `0.05` | `0.00` | emissive rarity tint | depthWrite off |
| **Capsule base** | `#3B2A9E` | `0.20` | `0.60` | iridescence 0.7 | |
| **Floor** | `#0E0C26` | `0.18` | `0.40` | clearcoat 1 | mirrors the beams |
| **Beams / rings / glow** | rarityColor | — | — | additive, toneMapped off | |

---

## 2. Spectacle Rules
- Additive effects never write depth; they sit on top of solid geometry.
- Only the card art and the HUD carry text; the 3D stage has no lettering.
