# SCALEFORGE — Style 49: Extreme Scale Comparison & Logarithmic Zoom

**In this package:** the scale-comparison engine in `kits/scaleforge/` (log-zoom world transform with per-frame culling, six procedural subjects modelled in real metres — glossy ant, architectural scale figure, setback skyscraper with canvas facade, displaced snow-capped mountain, fictional blue planet with clouds and atmosphere, granulated Sun with corona — a re-decading instanced ground ruler, measuring brackets and order-of-magnitude labels, star field, studio floor, foreground motes, and a HUD with frame-size readout, log gauge and subject captions); see `kits/scaleforge/KIT.md`.

- **Kit Path:** `kits/scaleforge/`
- **Style Number:** #49
- **Primary Scene:** `ScaleObjects3D` + `MeasureRuler3D` + `ScaleBackdrop3D`
- **Background Token:** `#F2F4F7 → #03050B`
- **Badge:** `SCALEFORGE // 49`

## Which briefs belong here?

Automatically select **SCALEFORGE** for briefs involving:
- "Perbandingan ukuran: dari semut sampai matahari"
- "Seberapa besar alam semesta? Zoom out dari manusia ke planet"
- "Video edukasi orde besaran, notasi ilmiah 10 pangkat n"
- "Bandingkan tinggi gedung, gunung, dan planet"
- "Seberapa kecil virus dibanding sel? (zoom-in, balik urutan kunci)"

Describe the look in friendly Indonesian:
> *"Gaya perbandingan skala ekstrem: satu zoom-out logaritmik tanpa putus dari semut, manusia, gedung pencakar langit, gunung, Bumi, sampai Matahari, masing-masing berdiri di atas penggaris ukur dengan label orde besaran 10 pangkat n, sementara studio putih perlahan berubah menjadi luar angkasa."*

## Not this style
- Zooming IN from orbit to a real terrain target with reticles: use SATELLITEBRIEFING.
- Molecules and cells as the subject (not a size comparison): use NANOFORGE.
- Data bars made of physical plates: use DATAPHYSICAL.

## Visual Guardrails
1. Every size shown must be a sourced, rounded real value; log it in `research/SOURCE_REGISTER.md`.
2. State that distances between subjects are not to scale.
3. Only one subject bracket + label at a time (two during hand-off), never a cluttered chart.
4. Maintain 9:16 safe zones (top 180 px / bottom 380 px of 1080x1920 clear of text).
5. Mute Test: frame readout + caption must name the subject and its size without audio.
