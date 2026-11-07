# STYLE DNA: Embroidery & Textile — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Extras |
| --- | --- | --- | --- | --- |
| **Silk Floss** | Crimson / vermilion / blush / leaf / moss | `0.42` | `0.00` | Physical: sheen 1, sheenRoughness 0.35, clearcoat 0.25 |
| **Gold Thread** | `#E2B04A` | `0.22` | `1.00` | envMapIntensity 1.6 |
| **French Knots** | Saffron `#F2B632` | `0.50` | `0.00` | Sheen `#FFE8A0` |
| **Linen** | `#E4D6BC` plain weave | `0.88` | `0.00` | Bump from weave canvas, scale 0.6, repeat 14 |
| **Songket** | Plum `#4A0F24` + gold floats | `0.42` | mask x 1.0 | `metalnessMap` = gold mask, repeat 2 |
| **Beech Hoop** | `#D8B48A` / `#C99C6C` | `0.40–0.45` | `0.00` | — |
| **Brass Clamp** | `#C9A04A` | `0.25` | `1.00` | — |
| **Steel Needle** | `#D8DCE2` | `0.15` | `1.00` | envMapIntensity 2 |

---

## 2. Surface Rules
- Gold floats are drawn as short horizontal dashes in alternating gold tones so they read as woven, not printed.
- Silk must never use metalness; the sheen alone carries the satin highlight.
