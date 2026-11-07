# STYLE DNA: Food Macro Tabletop — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Clearcoat | Notes |
| --- | --- | --- | --- | --- | --- |
| **Broth** | Amber `#C9852F` | `0.08` | `0.00` | `1.0` | sheen tint `#8E4E16` |
| **Noodles** | Wheat `#F2D27A` | `0.32` | `0.00` | `0.7` | sheen 0.3 |
| **Egg cut face** | Canvas yolk gradient | `0.20` | `0.00` | `1.0` | jammy centre |
| **Chashu** | Spiral fat/meat canvas map | `0.35` | `0.00` | `0.7` | caramelised edge `#6B3218` |
| **Stoneware glaze** | Charcoal `#1C2128` / cream `#EFE6D6` | `0.22–0.32` | `0.00` | `0.9–1.0` | iron-oxide rim |
| **Walnut table** | Procedural grain map | `0.42` | `0.00` | `0.35` | 5 planks, knots |
| **Spoon** | Steel `#D9D4CC` | `0.12` | `1.00` | — | reflects the env map |

---

## 2. Appetite Rules
- Food never drops below 50% value; shadows on food stay warm.
- Gloss sells freshness: every sauce or liquid has clearcoat 1.0.
