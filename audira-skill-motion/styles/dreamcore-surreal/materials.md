# STYLE DNA: Dreamcore Surreal — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Notes |
| --- | --- | --- | --- | --- |
| **Pool Tile** | `#E9E7E6` canvas tiles, grout `#B9C2CC` | `0.18` | `0.00` | env 0.7, 8 × 8 tiles per 2 units |
| **Water** | `#9FD6EA` | `0.04` | `0.00` | clearcoat 0.6, ripple normal map (scale 0.12) scrolling slowly |
| **Clouds** | `#FFFFFF`, emissive `#E9D9F2` × 0.12 | `1.00` | `0.00` | env 0.4, gentle breathing scale |
| **Door Leaves** | pink / mint / lilac | `0.45` | `0.00` | Frames `#E9E7E6`, brass knob metal 1.0 |
| **Doorway Sky** | Gradient canvas × (0.9 + 1.6·glow) | — | — | `MeshBasicMaterial`, HDR for bloom |
| **Bubbles** | `#FFFFFF` | `0.05` | `0.00` | iridescence 1.0, opacity 0.28 |

---

## 2. Rules
- Every reflective surface reflects the same baked pastel sky.
- Keep albedos below pure white; brightness comes from the sky, not the surfaces.
