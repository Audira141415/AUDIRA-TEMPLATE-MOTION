# STYLE DNA: Needle-Felt Wool — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Special | Notes |
| --- | --- | --- | --- | --- | --- |
| **Felt** | Per part × fibre map | `1.00` | `0.00` | sheen 1, sheenRoughness 0.75 | fibre map also used as bump (1.2) |
| **Fuzz shells** | Part colour lifted 12–30% | `1.00` | `0.00` | alphaMap speckle, alphaTest 0.35 + 0.13·level | DoubleSide, no transparency sorting |
| **Yarn** | Brown / green / rust | `0.95` | `0.00` | sheen 1 | |
| **Bead eyes & nose** | `#14100E` | `0.08` | `0.00` | clearcoat 1 | only glossy element besides button |
| **Button sun** | `#F2B53B` | `0.35` | `0.00` | clearcoat 0.6 | |
| **Embroidery thread** | `#FFF6E3` / `#B5532F` | `1.00` | `0.00` | — | |

---

## 2. Textile Rules
- Never add clearcoat to wool or felt.
- Fibre texture repeat 0.8–4 depending on part size so fibres stay a consistent scale.
