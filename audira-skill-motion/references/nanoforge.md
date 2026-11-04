# NANOFORGE — Style 15: molecular biology, DNA double-helix & Cryo-EM nanotech cinematics

**In this package:** the molecular biology & nanotech engine in `kits/nanoforge/` (procedural DNA double-helix, complementary nucleotide base pairs, undulating cellular vesicles, Brownian thermal drift, bioluminescent fluorescent lighting, 3-act microscopy camera rig, and Cryo-EM scale overlay); see `kits/nanoforge/KIT.md`.

## Which briefs belong here?

Automatically select NANOFORGE for briefs involving:
- "Sains, kedokteran, farmasi, bioteknologi, atau virologi"
- "Visualisasi heliks ganda DNA, struktur molekul, genetik, atau sintesis protein"
- "Nanoteknologi, pengantaran obat tertarget (targeted drug delivery), atau mikroskop elektron Cryo-EM"
- "Dunia seluler, vesikel lipid, membran fosfolipid, atau mikroorganisme biologis"
- "Eksplorasi mikroskopis cairan tubuh / sitoplasma dengan partikel berpendar (bioluminesensi)"

Describe the look in friendly Indonesian: *"Gaya visual mikroskop elektron dan biologi molekuler canggih dengan heliks DNA bersinar, membran sel berdenyut lembut, dan partikel bio-luminesensi mengambang."*

## Signature visual and narrative grammar

- **Authentic Helical Mechanics:** Procedural double-helix backbones with scientifically faithful complementary nucleotide pairings (Adenine-Thymine in Gold-Cyan, Guanine-Cytosine in Ruby-Violet) with hydrogen bond markers.
- **Hydrated Subsurface Translucency:** Cell vesicles utilize physical transmission ($IOR = 1.33$) mimicking aqueous cytoplasm and phospholipid hydration.
- **Brownian Thermal Agitation:** Microscopic objects continuously drift with subtle harmonic thermal flutter (`brownianDrift(f)`), conveying the living liquidity of cellular environments.
- **Deep Microscopic Contrast:** Dark fluid void background (`#02050f`) illuminated by fluorescent point kickers and top-down electron beam lighting.
- **Cryo-EM Telemetry Overlay:** Real-world electron microscope readouts (scale bars in nanometers `25 nm`, magnification ratios up to `650,000×`, accelerating voltage `200 kV`, and focal reticles).

## Act structure that works (8–20s films)

1. **Molecular Scan (0–25%):** Ultra macro entry scanning along individual nucleotide base-pairs; subtle Brownian jitter; electron beam illuminates the major groove.
2. **Helical Ascent (25–65%):** Camera executes a soaring helical orbit along the twisting DNA backbone; surrounding cellular vesicles pulse and float past; fluorescence reaches peak vibrancy.
3. **Cosmic Micro-Pullback (65–100%):** Camera pulls back into a majestic wide composition; the entire molecular architecture reveals itself suspended in the deep fluid cytoplasm; microscopy HUD confirms sequence stability.

## Determinism & QA checklist

- **Strict Determinism:** All helical turns, cellular respirations, particle drifts, and camera poses derive strictly from `f = (frame / fps) * 60`.
- **Lighting Balance:** Pair ambient blue cytoplasm lighting with sharp point lights so lipid membrane edges catch crisp specularity.
- **Performance:** Keep floating particle count under 1,000 for seamless 60 FPS mobile rendering.

