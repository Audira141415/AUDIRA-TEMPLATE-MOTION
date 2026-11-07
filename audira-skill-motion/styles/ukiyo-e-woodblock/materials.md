# STYLE DNA: Ukiyo-e Woodblock — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Notes |
| --- | --- | --- | --- | --- |
| **Washi Sheet (all layers)** | Canvas art | `0.96` | `0.00` | `alphaTest 0.5`, double-sided, casts + receives shadow |
| **Sky** | Bokashi `#0F2747` to `#1F4A7A` to `#9DB5CC` to `#EED9A8` | `0.96` | `0.00` | Fibre grain x1.4 |
| **Waves** | `#1F4A7A` to `#0F2747`, stripes `#5D86B0` | `0.96` | `0.00` | Key-line `#1B1A1F` 4 px, foam claws `#F6F0E1` |
| **Mountain** | Dawn `#A8442C` to `#5C4A6A` to `#0F2747` | `0.96` | `0.00` | Snow cap with drips |
| **Sun** | Vermilion `#D9472B` | `0.96` | `0.00` | Darker rim `#A8301C` |
| **Cartouche** | Washi `#EFE3C8`, vermilion border | `0.96` | `0.00` | Pseudo-script strokes only |
| **Seal** | Vermilion with carved paper strokes | `0.96` | `0.00` | Pseudo-glyph |

---

## 2. Surface Rules
- Washi grain: thin pale fibre strokes plus faint horizontal block-grain streaks, applied with `source-atop` so cut-out alpha is preserved.
- Never use metalness, gloss or emissive on print sheets.
