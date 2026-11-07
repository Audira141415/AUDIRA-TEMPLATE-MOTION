# STYLE DNA: Satisfying Loops — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Clearcoat | Notes |
| --- | --- | --- | --- | --- | --- |
| **Kinetic sand** | Pastel strata | `1.00` | `0.00` | — | seeded grain bump, scale 0.6 |
| **Liquid layers** | Pink / lilac / mint | `0.12` | `0.00` | `1.0` | two clipping planes per layer, DoubleSide |
| **Glass mould** | White, opacity 0.32 | `0.04` | `0.00` | `1.0` | depthWrite off, renderOrder 2 |
| **Shape pieces** | Sky / butter / mint / pink | `0.25` | `0.00` | `1.0` | emissive pulse on payoff |
| **Board & plinths** | Lilac / off-white | `0.35–0.40` | `0.00` | `0.5–0.6` | bevelled edges |
| **Blade & nozzle** | Chrome `#E8ECF2` | `0.12` | `1.00` | — | |
| **Cyclorama** | Vertex gradient | `0.92` | `0.00` | — | matte paper sweep |

---

## 2. Satisfaction Rules
- Matte vs gloss contrast (sand vs candy) is the tactile hook; keep both in every shot.
- No texture noise on the backdrop; it must read as infinite.
