# STYLE DNA: Medical Anatomy — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Notes |
| --- | --- | --- | --- | --- |
| **Myocardium** | `#C8475A` | `0.36` | `0.00` | Clearcoat 1, sheen 0.6 `#FFB3BE`, opacity 1 → 0.22 |
| **Chambers** | `#3B7BFF` / `#FF3B4A` | `0.40` | `0.00` | Emissive 0.35, opacity 0.25 → 0.8 |
| **Vessels** | `#C42A3A` / `#2F5FC8` / `#8B3A8F` | `0.25` | `0.00` | Clearcoat, opacity 0.5, no depth write |
| **Valves** | `#F4EDE4` | `0.30` | `0.00` | Fade in with the reveal |
| **Blood Cells** | `#FF3B4A` / `#3B7BFF` | — | — | Unlit |
| **Hologram** | `#3FE0D0` / `#9FF5EC` | — | — | Additive, unlit |

---

## 2. Surface Rules
- Translucent layers never write depth (except the wall while it is opaque) so flow inside stays visible.
- No texture maps on tissue: the clean look comes from clearcoat + sheen + light.
