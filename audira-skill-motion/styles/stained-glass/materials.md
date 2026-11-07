# STYLE DNA: Stained Glass — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Notes |
| --- | --- | --- | --- | --- |
| **Pot-Metal Glass** | Jewel tone × `sunGlow` (HDR) | — | — | `MeshBasicMaterial` + seedy-glass canvas map (streaks, bubbles, darker edges) |
| **Lead Came** | `#1A1B1E` | `0.45` | `0.70` | Backing shape + torus leads + saddle bars |
| **Ashlar Wall** | `#B9AE9C` × stone map | `0.92` | `0.00` | Canvas coursed blocks, mortar `#5E574C`, weathering speckle |
| **Flagstones** | `#A79C8A` × flag map | `0.55` | `0.05` | Slight sheen so coloured light reads |
| **Floor Light Pool** | Window image, blurred 5 px | — | — | Additive, opacity `assembled × sunGlow` |
| **Dust Motes** | `#FFE2A8` × 1.3 | — | — | Additive, twinkling |

---

## 2. Rules
- A pane is one flat colour; texture only modulates it.
- The floor pool is generated from the same pane list as the window, so they always match.
