# STYLE DNA: 3D Toy Diorama — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | SSS | Normal / Bump Type |
| --- | --- | --- | --- | --- | --- |
| **Character Plastic** | Pastel tones / Terracotta | `0.78` | `0.02` | `0.10` | Fine matte injection-mold plastic grain |
| **Soft Clay Props** | Primary `#E0A96D` / `#FF5E3A` | `0.88` | `0.00` | `0.18` | Subtle hand-pressed plasticine stippling |
| **Stage Wood Planks** | Walnut `#2A1810` / Oak `#4A2E1B` | `0.65` | `0.00` | `0.00` | Satin varnished wood grain |
| **Footlight Housing** | Antique Brass `#D4AF37` | `0.32` | `0.85` | `0.00` | Brushed vintage metal |
| **Footlight Bulb** | Warm amber `#FFA94D` | `0.10` | `0.00` | `0.00` | Emissive `1.8`, soft bloom |
| **Kraft Paper Labels** | Kraft tan `#D2B48C` | `0.92` | `0.00` | `0.05` | Recycled fibrous paper grain |
| **Washi Tape** | Semi-translucent white | `0.60` | `0.00` | `0.40` | Translucent adhesive tape texture |

---

## 2. Shader & Specular Guardrails
- **Max Specular Luminance:** Clamped to `0.30` (prevents harsh mirror highlights).
- **Subsurface Scattering:** Subtle wax-like glow on thin clay edges (e.g. ears, small hats) to emphasize physical warmth.
- **Normal Map Strength:** Kept below `0.25` so textures look microscopic and miniature rather than coarse rock.

