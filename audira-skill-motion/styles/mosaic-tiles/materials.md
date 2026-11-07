# STYLE DNA: Mosaic Tiles — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Clearcoat | Notes |
| --- | --- | --- | --- | --- | --- |
| **Glazed Ceramic / Stone** | Per-instance (terracotta, lapis, ochre, cream, umber) | `0.42` | `0.00` | `0.7` (rough 0.18) | `MeshPhysicalMaterial`, instance colour × 0.9–1.08 |
| **Gold Smalti** | Per-instance gold `#E6B54A` / pale `#F2D27A` | `0.32` | `1.00` | — | Reflects the procedural environment |
| **Lime Grout** | `#8F806B` + sand speckle canvas | `0.95` | `0.00` | — | Always darker than the tiles |
| **Stone Surround** | `#6E5A48` × 0.75–1.05 | `0.85` | `0.00` | — | Slabs with tiny yaw jitter |
| **Dust** | `#FFE0B0` × 1.2 | — | — | — | Additive, opacity 0.5 |

---

## 2. Rules
- The image is made by colour per instance, never by a texture map.
- Keep two materials so the whole field costs two draw calls.
