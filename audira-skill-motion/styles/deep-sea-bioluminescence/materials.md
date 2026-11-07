# STYLE DNA: Deep-Sea Bioluminescence — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Opacity | Notes |
| --- | --- | --- | --- | --- | --- |
| **Jelly Bell** | lumen × 0.25 | `0.15` | `0.00` | `0.32` | Emissive lumen, intensity `0.22 + 0.6·pulse`, double-sided, no depth write |
| **Rim / Organs** | lumen × 1.6–3.2 (HDR) | — | — | `1.0` | `MeshBasicMaterial`, caught by bloom |
| **Tentacles** | lumen × 1.2 (HDR) | — | — | `0.6` | Additive blending |
| **Predator Hide** | `#1C2832` | `0.30` | `0.20` | `1.0` | Bumped sphere so lure light rakes across it |
| **Teeth** | `#E8E2CF` | `0.25` | `0.05` | `1.0` | Glints in lure light |
| **Marine Snow** | `#A9CBE0` | — | — | `0.75` | Fogged with distance |
| **Seabed Silt** | `#1B232B` | `0.95` | `0.00` | `1.0` | Only visible inside lure light |

---

## 2. Rules
- Only living things are emissive. Water, snow and silt never exceed 1.0.
- Use HDR colour (`Color.multiplyScalar`) instead of huge light intensities for glow.
