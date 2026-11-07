# ARCADECRT — Style 66: Arcade Cabinet & CRT — Dive Through the Glass into the Pixel World

**In this package:** the arcade & CRT engine in `kits/arcadecrt/` (procedural cabinet, CRT shader fed by a live canvas raster, original game level shared with a voxel world, arcade room with instanced cabinets, dive transition, score overlay); see `kits/arcadecrt/KIT.md`.

- **Kit Path:** `kits/arcadecrt/`
- **Style Number:** #66
- **Style DNA:** `styles/arcade-crt/`
- **Primary Scene:** `ArcadeRoom3D` + `CrtCabinet3D` → `PixelWorld3D`
- **Background Token:** `#07060F`
- **Badge:** `ARCADECRT // 66`

## Which briefs belong here?

Automatically select **ARCADECRT** for briefs involving:
- "Animasi mesin arcade retro dengan layar CRT yang menyala"
- "Video nostalgia game jadul, masuk ke dalam layar game"
- "Promo game indie pixel art / event gaming / rental arcade"
- "Cerita sejarah video game dengan nuansa 80-90an"
- "Explainer tentang cara kerja layar tabung (CRT) atau game klasik"

Describe the look in friendly Indonesian:
> *"Gaya animasi 3D ruang arcade malam hari: mesin arcade menyala dengan game pixel orisinal di layar CRT melengkung (scanline, glow, warna RGB meleset), joystick dan tombol, lalu kamera menembus layar dan dunia pixel-nya berubah menjadi dunia voxel 3D."*

## Distinct from

RETROWAVE is a synthwave sunset grid with a CRT overlay; PIXELSTORY is 2.5D pixel-character storytelling; HD2D puts pixel sprites in a lit diorama; VOXELVERSE builds handcrafted voxel worlds. ARCADECRT is about the physical arcade machine and the CRT tube itself, and the dive from raster into voxels.

## Visual Guardrails
1. Keep text inside the 9:16 safe zone (top 180 px / bottom 380 px of 1920, scaled by height/1920).
2. Raster stays at low resolution (≤ 128 px tall) with nearest filtering — sharp pixels make the CRT effects read.
3. No real game IP, logos, cabinet brands or characters.
4. Voxel instance count ≤ ~2,000 (terrain + hero + effects) for a ~2 min final render.
