# STYLE DNA: Nusantara Folk Horror — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Emissive | Texture |
| --- | --- | --- | --- | --- | --- |
| **Packed Earth** | `#2B2620` tinted `#8C8070` | `1.00` | `0.00` | — | Canvas grit speckle, repeat 6x9 |
| **Footpath** | Dusty `#54493C` | `1.00` | `0.00` | — | Soft-edged alpha strip with pebbles |
| **Bamboo Culm** | `#55603E` | `0.70` | `0.00` | — | Vertical gradient + dark node bands |
| **Gedek Wall** | `#8A7350` | `0.92` | `0.00` | — | Chevron woven-bamboo pattern |
| **Thatch Roof** | `#2E2820` | `1.00` | `0.00` | — | Vertical straw strokes |
| **Banyan Bark** | `#3B3631` | `0.95` | `0.00` | — | Flat-shaded |
| **Pelita Tin** | `#9C8256` | `0.35` | `0.70` | `#4A2A0A` 0.6 | — |
| **Lit Window** | `#FFB866` | — | — | `#FF9A3C` 2.4 (toneMapped false) | — |
| **Presence** | `#EEF4FA` | unlit | — | — | Blurred canvas figure, no face |

---

## 2. Surface Rules
- Everything organic is matte (roughness ≥ 0.9); only the pelita tin and glass chimney catch speculars.
- Textures are procedural `CanvasTexture` (sRGB) from a seeded PRNG; no image downloads.
