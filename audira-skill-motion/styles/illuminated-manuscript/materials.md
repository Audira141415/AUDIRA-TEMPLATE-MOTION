# STYLE DNA: Illuminated Manuscript & Lontar — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Notes |
| --- | --- | --- | --- | --- |
| **Parchment Pages** | `#F0E0BC` to `#C9A96E` with stains | `0.85` | `0.00` | Canvas: vines, lapis box, pseudo-script |
| **Iron-Gall Ink** | `#2A1A10`, rubric `#B0301E` | `0.35` | `0.00` | Transparent strips, alphaTest 0.2 |
| **Gold Leaf Initial** | `#B8801C` | `0.30` | `0.90` | alphaMap ornament, envMapIntensity 0.7, emissive `#7A5010` 0.1–0.7 |
| **Leather Binding** | `#5A1A12` | `0.60` | `0.00` | — |
| **Lontar Leaf** | `#D9B97A` top, `#B8964F` edges | `0.62` / `0.80` | `0.00` | Fibre streaks, incised glyph rows, centre hole |
| **Carved Covers** | `#5A3A1E` wood | `0.50` | `0.00` | Gold inlay strip on the top cover |
| **Walnut Desk / Lectern** | `#3A2416` / `#4A2C18` | `0.55` | `0.00` | Canvas grain |
| **Beeswax** | `#EFE3C6` | `0.45` | `0.00` | Sheen 0.6, faint emissive |
| **Ink Pot** | `#1A1410` | `0.10` | `0.00` | Clearcoat 1 |

---

## 2. Surface Rules
- All script is procedural pseudo-script; the initial is an abstract knot ornament, never a letter.
- Gold must sit on lapis so it reads as illumination, not as a sticker.
