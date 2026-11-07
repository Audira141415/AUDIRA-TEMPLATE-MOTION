# COMICFORGE — Style 51: Western Comic Book 3D — Cel-Shaded Ink, Ben-Day Halftone & Panel Flythrough

**In this package:** the western comic-book engine in `kits/comicforge/` (halftone cel shader, inverted-hull ink, printed page panels the camera flies through, original hero rig, villain drone, onomatopoeia burst, speech balloon, issue-style overlay); see `kits/comicforge/KIT.md`.

- **Kit Path:** `kits/comicforge/`
- **Style Number:** #51
- **Style DNA:** `styles/comic-book-3d/`
- **Primary Scene:** `CityPanels3D` + `Hero3D` + `Impact3D`
- **Background Token:** `#2B2E8C`
- **Badge:** `COMICFORGE // 51`

## Which briefs belong here?

Automatically select **COMICFORGE** for briefs involving:
- "Animasi superhero gaya komik Amerika 3D dengan titik halftone"
- "Cerita aksi pahlawan kota, ledakan BOOM, balon kata"
- "Explainer seru bergaya halaman komik untuk anak muda"
- "Promo produk dengan panel komik dan efek onomatopoeia"
- "Recap pertandingan atau berita dengan gaya pop-art comic"

Describe the look in friendly Indonesian:
> *"Gaya animasi 3D komik superhero Barat: karakter cel-shaded dengan garis tinta tebal, titik-titik halftone Ben-Day, kamera yang menembus bingkai panel halaman komik, balon kata dan ledakan tulisan 'KRA-KOOM!' dengan warna cetak CMYK."*

## Distinct from

TOONFORGE is anime cel-shading with manga speed lines and soft anime palettes; COMICFORGE is Western print: CMYK process colours, Ben-Day dot shading, panel borders, caption boxes and onomatopoeia. BRUTALFORGE uses flat neo-brutalist UI blocks, not printed comic pages.

## Visual Guardrails
1. Keep text inside the 9:16 safe zone (top 180 px / bottom 380 px of 1920, scaled by height/1920).
2. Original characters and lettering only — no publisher characters, logos or trade dress.
3. Black ink lines must stay visible at 540×960 preview: hull thickness >= 0.02 world units at 4–8 units camera distance.
4. One onomatopoeia burst per beat; never stack more than one balloon on screen.
