# STYLE DNA: Film Noir — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Wetness / Clearcoat | Normal / Bump Type |
| --- | --- | --- | --- | --- | --- |
| **Wet Asphalt** | Dark Charcoal `#101216` | `0.18` (wet) / `0.75` (dry) | `0.02` | `0.85` | Coarse pebble road normal |
| **Rain Puddles** | Deep Black `#050608` | `0.02` | `0.00` | `1.00` | Smooth flat mirror reflection |
| **Damp Brick Wall** | Charcoal Grey `#1E2024` | `0.82` | `0.00` | `0.20` | Detailed mortared brick normal |
| **Trench Coat Fabric** | Heavy Wool `#181A1D` | `0.89` | `0.00` | `0.00` | Micro-twill woven cloth texture |
| **Vintage Streetlamp** | Cast Iron `#121315` | `0.45` | `0.70` | `0.10` | Pitted forged iron texture |
| **Neon Tube Sign** | Pale Amber `#FFB347` | `0.10` | `0.00` | `0.00` | Emissive `2.4`, high glow |

---

## 2. Atmospheric & Volumetric Effects
- **Rain Droplets:** Vertical streak geometry with refractive opacity (`opacity: 0.35`).
- **Ground Mist / Fog:** Low-lying volumetric density layer with exponential distance falloff.
- **Silver Halide Film Grain:** Post-processing noise pass simulating Kodak Double-X 5222 35mm motion picture film.

