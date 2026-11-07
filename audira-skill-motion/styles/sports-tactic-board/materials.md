# STYLE DNA: Sports Tactic Board — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Notes |
| --- | --- | --- | --- | --- |
| **Painted Turf** | Stripes `#46A04C` / `#337F39` | `0.86` | `0.00` | CanvasTexture: stripes, seeded speckle, chalk lines |
| **Token Top** | Team colour + white ring + number | `0.28` | `0.05` | Glossy acrylic |
| **Token Side** | `#B8331F` / `#1A4BB0` | `0.30` | `0.15` | Slightly darker than the top |
| **Base Ring** | `#F3F5F7` | `0.35` | `0.00` | Separates token from grass |
| **Board Lip** | `#9AA6B2` | `0.28` | `0.85` | Brushed aluminium |
| **Telestrator** | `#FFE27A` / `#FF8A6A` / `#FFC94A` | — | — | Unlit, not tone-mapped |

---

## 2. Surface Rules
- Never use a photographic grass texture; the painted look is the brand.
- Chalk lines stay 92% white: pure white burns out under the floodlight key.
