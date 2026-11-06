# STYLE DNA: Watercolor Storybook — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Translucency | Normal / Bump Type |
| --- | --- | --- | --- | --- | --- |
| **Cold-Press Paper Base** | Warm Cream `#F9F6EE` | `0.96` | `0.00` | `0.08` | High-frequency cotton pulp paper texture |
| **Watercolor Washes** | Translucent pastels | `0.88` | `0.00` | `0.15` | Wet-on-wet pigment pooling normal map |
| **Graphite Contours** | Soft Graphite `#3A3836` | `0.92` | `0.02` | `0.00` | Textured pencil stroke bump |
| **Character Felt/Wool** | Terracotta `#D48C70` | `0.95` | `0.00` | `0.20` | Soft cloth / felt fuzziness |

---

## 2. Watercolor Bleed Shader Mechanics
- **Edge Darkening (Pigment Pooling):** Border pixels receive a $15\%$ boost in pigment saturation to mimic natural watercolor drying behavior.
- **Granulation (Mottling):** Subtle procedural noise simulating cobalt/ultramarine sediment settling into paper crevices.

