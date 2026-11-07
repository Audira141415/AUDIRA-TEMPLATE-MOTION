# STYLE DNA: Geohazard Cross-Section — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Notes |
| --- | --- | --- | --- | --- |
| **Continental Crust** | Strata canvas (sediment → granite) | `0.85` | `0.00` | Wavy bands, seeded grain |
| **Oceanic Slab** | Basalt `#3D4752` + pillow speckle | `0.75` | `0.00` | Darker top face `#2B333C` |
| **Mantle** | Gradient `#E0702F` → `#8E2F1C` | `0.80` | `0.00` | Emissive map 0.28 |
| **Sea Surface** | `#2E8FC0` → foam `#E9F7FF` by height | `0.12` | `0.10` | Opacity 0.82, vertex colours |
| **Water Curtain** | `#4BA9D6` → `#14506F` | — | — | Unlit, opacity 0.78 |
| **Houses / Roofs** | Off-whites / `#B85B43` | `0.70` | `0.00` | Instanced |

---

## 2. Surface Rules
- Front-face UVs are shape coordinates; `fitBlock` maps the whole block to 0..1 so strata line up across bodies.
- Keep strata contrast gentle; the fault and rings must be the brightest things on the cut face.
