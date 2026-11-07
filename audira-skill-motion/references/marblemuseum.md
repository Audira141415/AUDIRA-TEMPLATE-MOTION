# MARBLEMUSEUM — Style 61: Classical Marble Sculpture & Museum Gallery

**In this package:** the museum engine in `kits/marblemuseum/` (a procedurally sculpted original Greco-Roman style bust: chisel-feature displacement head, 720 drill-cut hair/beard locks, drapery-folded torso, turned socle, moulded plinth; world-space procedural marble veining shader for any mesh; oxblood gallery with dado and gilt rail; fluted columns; gilded frame with an original dusk painting; polished two-tone floor with `RoomEnvironment` reflections; skylight spot, warm rim, additive beam and dust motes; restrained bloom/ACES; and a museum wall-label HUD); see `kits/marblemuseum/KIT.md`.

- **Kit Path:** `kits/marblemuseum/`
- **Style Number:** #61
- **Primary Scene:** `MarbleBust3D` + `Gallery3D`
- **Background Token:** `#120807`
- **Badge:** `MARBLEMUSEUM // 61`

## Which briefs belong here?

Automatically select **MARBLEMUSEUM** for briefs involving:
- "Filsafat Yunani / Romawi, stoikisme, pemikir klasik, kutipan bijak"
- "Sejarah peradaban kuno, kekaisaran, tokoh legendaris" (tanpa meniru wajah tokoh nyata)
- "Penjelasan seni, museum, patung, dan warisan budaya"
- Konten edukasi yang butuh wibawa, ketenangan, dan nuansa 'ruang galeri'
- Seri kutipan / pelajaran hidup dengan kartu label museum sebagai teks

Describe the look in friendly Indonesian:
> *"Patung dada marmer putih bergaya Yunani-Romawi dengan urat abu-abu halus berdiri di atas alas di galeri museum berdinding merah tua; kamera mengitarinya pelan dan khidmat, cahaya skylight jatuh ke wajahnya, debu berkilau di berkas cahaya, lalu kartu label museum muncul."*

## Visual Guardrails
1. Keep 9:16 safe zones (top 180 px / bottom 380 px at 1080×1920); the label card sits bottom-left above the 380 px zone.
2. Marble must never clip to pure white: check the brightest still first; lower the spot, not the veins.
3. Distinct from BRUTALFORGE (raw concrete, hard pop shadows) and VINTAGEFORGE (paper/ink): here it is polished stone, gilt and warm skylight.
4. Pass the Mute Test: the label card names the object without audio.
5. Original faces only; no likeness of a real historical person or a real museum piece.
