# STYLE DNA: Glass Terrarium — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Notes |
| --- | --- | --- | --- | --- |
| **Glass** | `#F4FBF8` | `0.03` | `0.00` | Transmission 1, IOR 1.5, thickness 0.12, clearcoat 1, attenuation `#D8F2E4` |
| **Droplets** | `#FFFFFF` | `0.02` | `0.00` | Clearcoat, opacity 0.75 |
| **Moss** | `#5E8F3A` / `#7DAA45` / `#3F6E2C` | `0.95` | `0.00` | Per-instance colour |
| **Fern** | `#4E8A3A` → `#8CC25A` tip | `0.60` | `0.00` | Double-sided |
| **Substrate** | Gravel / charcoal / soil speckle canvases | `0.90–0.95` | `0.00` | Visible through glass |
| **Pool** | `#2B5E66` | `0.04` | `0.20` | Clearcoat, opacity 0.88 |
| **Snail Shell** | `#B07A45` / `#6E4526` bands | `0.30` | `0.00` | Clearcoat 1 |
| **Cork / Table** | Cork canvas / walnut grain canvas | `0.92` / `0.50` | `0.00` | Procedural |

---

## 2. Surface Rules
- Everything organic is matte; only glass, water, droplets and the shell are glossy.
- Keep the glass clean: no dirt textures, no labels.
