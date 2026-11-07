# STYLE DNA: Y2K Chrome — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Special | Notes |
| --- | --- | --- | --- | --- | --- |
| **Liquid chrome** | `#F2F6FA` | `0.04` | `1.00` | iridescence 0.35, IOR 1.6 | reflects the sky env |
| **Soap bubble** | White, opacity 0.32 | `0.02` | `0.00` | iridescence 1.0, thickness 180–820 nm | depthWrite off, env ×2.2 |
| **Clouds** | `#FFFFFF` | `0.85` | `0.00` | sheen `#CFE7FF`, emissive 0.25 | soft and bright |
| **Sky dome** | Vertex gradient | — | — | unlit, toneMapped off | |

---

## 2. Chrome Rules
- Chrome without the sky env looks grey: always attach `SkyEnv`.
- Keep roughness ≤ 0.06 so reflections stay liquid-sharp.
