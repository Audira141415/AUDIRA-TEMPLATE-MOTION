# RISOFORGE — Style 53: Risograph Zine Print — Spot-Ink Overprint Pop-Up

**In this package:** the risograph zine engine in `kits/risoforge/` (multiply riso-ink shader with per-drum halftone and grain, stapled zine spread, six pop-up ink layers, rising overprint sun, stepped misregistration, registration-mark overlay); see `kits/risoforge/KIT.md`.

- **Kit Path:** `kits/risoforge/`
- **Style Number:** #53
- **Style DNA:** `styles/risograph-print/`
- **Primary Scene:** `ZineSpread3D` + `PopupLayers3D`
- **Background Token:** `#D9D2C4`
- **Badge:** `RISOFORGE // 53`

## Which briefs belong here?

Automatically select **RISOFORGE** for briefs involving:
- "Animasi gaya zine risograph dengan warna pink neon, biru dan kuning"
- "Poster indie / cetak sablon yang hidup jadi 3D pop-up"
- "Promo acara komunitas, festival musik, atau toko buku independen"
- "Cerita kota, tanaman, atau lingkungan dengan nuansa cetak handmade"
- "Explainer santai bertekstur kertas dengan efek tinta tumpang tindih"

Describe the look in friendly Indonesian:
> *"Gaya animasi 3D zine risograph: halaman zine berstaples yang lapisan cetaknya berdiri menjadi kota pop-up, tinta pink neon, biru dan kuning saling menumpuk (multiply) membentuk warna baru, dengan butiran halftone, tekstur kertas dan cetakan yang sedikit meleset."*

## Distinct from

PAPERWORLD is lit paper-craft with real colours and folds; RISOFORGE is print reproduction: flat spot inks, multiply overprint, halftone screens and misregistration. MEMPHISDIORAMA uses opaque pastel plastics, WATERCOLOR uses soft washes — neither overprints.

## Visual Guardrails
1. Keep text inside the 9:16 safe zone (top 180 px / bottom 380 px of 1920, scaled by height/1920).
2. Max three spot inks per film (swap the trio per episode, e.g. teal/orange/purple); never add a fourth opaque colour.
3. Ink materials must keep depthWrite off and multiply blending, or overprints turn into stacked opaque cards.
4. Misregistration offsets stay under 0.04 world units — more reads as a bug, not as print.
