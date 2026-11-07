# STYLE DNA: Wayang Shadow Puppet — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Asset Layer | Base Color (Albedo) | Roughness | Metalness | Notes |
| --- | --- | --- | --- | --- |
| **Painted Rawhide (puppets)** | Canvas: prada gold `#D9A441`, red `#A8321E`, green `#2E6B57`, black face `#17110D` | `0.50` | `0.20` | `alphaTest 0.45`, double-sided, tatahan holes punched |
| **Kelir Front** | Cream radial `#FFF6E2` to `#CDBB98` | `0.95` | `0.00` | Faint emissive `#7A5428` x flicker |
| **Kelir Back** | Hot radial `#FFD27E` to `#4A1A08` | unlit | — | `MeshBasicMaterial`, cloth weave lines |
| **Shadow Planes** | Black silhouette, blur 2.5 px | unlit | — | Transparent, depthWrite false |
| **Carved Teak** | `#3A2416` tinted `#B07850` | `0.60` | `0.00` | Canvas wood grain |
| **Batik (kawung / parang)** | Soga `#6B3E1F`, cream `#E8D3A8`, indigo `#1E2A5A` | `0.75–0.92` | `0.00` | Wax-crackle veins |
| **Bronze Gamelan / Blencong** | `#B07A3A` | `0.32` | `0.85` | `envMapIntensity 1.2` |
| **Prada Gold Trim** | `#D9A441` | `0.30` | `0.80` | Finials and rail |
| **Gedebog** | `#B9B27A` | `0.75` | `0.00` | — |

---

## 2. Surface Rules
- Puppet art is procedural canvas: fills with gold outlines, then `destination-out` perforations (dot rows, teardrops, borders).
- The shadow texture is the colour canvas passed through `brightness(0) blur(2.5px)`, so holes always line up.
