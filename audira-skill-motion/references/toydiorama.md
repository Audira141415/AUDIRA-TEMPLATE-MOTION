# TOYDIORAMA — Style 31: Stylized 3D Toy Diorama & Miniature Theatrical Stage

**In this package:** the commercial 3D toy diorama engine in `kits/toydiorama/` (miniature wooden stage platform, vintage warm footlights, tiered cardboard and soft clay scenery flats on wooden dowels, stylized blocky toy characters, matte plastic & soft clay PBR materials, taped kraft paper annotations, static macro theatrical camera rig, and bold editorial overlays); see `kits/toydiorama/KIT.md`.

## Which briefs belong here?

Automatically select **TOYDIORAMA** for briefs involving:
- "Animasi diorama panggung teater miniatur 3D dengan karakter mainan lucu"
- "Video komersial produk/tech explainer bergaya toy diorama matte plastic & soft clay"
- "Karakter figur mainan blocky dengan prop mini, label kertas ditempel selotip (taped paper label)"
- "Animasi editorial storytelling bergaya miniatur berkualitas tinggi ala Apple/Google/Dropbox motion"
- "Panggung teater mini dengan lampu footlight hangat dan background sinematik gelap"

Describe the look in friendly Indonesian:
> *"Gaya animasi 3D Toy Diorama panggung teater miniatur yang hangat dan profesional, dengan karakter mainan blocky bermaterial matte plastic dan soft clay, panggung kayu bertingkat dengan lampu footlight klasik, label catatan kertas berselotip, dan kamera makro statis yang konsisten."*

## Signature Visual & Narrative Grammar

- **Visual Identity:** Stylized blocky 3D toy characters, geometric low-poly-inspired shapes with rounded edges and simplified proportions. Matte plastic and soft clay materials (roughness 0.72–0.85).
- **Environment:** Miniature theatrical stage with walnut plank flooring, warm glowing footlights, and tiered scenery flats (mountains, sun disc, soft drifting clouds) held by wooden dowels.
- **Lighting:** Cinematic soft studio lighting, 3200K warm key spotlight, subtle 5600K cool rim separator, and warm golden floor footlights.
- **Static Camera:** Eye-level or slightly elevated theatrical macro perspective (FOV 32°). No pan, no tilt, no zoom!
- **Animation:** Smooth 60 FPS toy-like character movements, natural gestures, physical prop slide-ins with spring damping, discrete natural eye blinks.
- **Graphic Design:** Bold editorial typography, small paper labels with semi-translucent washi tape annotations.
- **Strict Avoidances:** No photorealistic human characters, no flat 2D cartoons, no glossy chrome, no erratic camera movement.

## Determinism & QA Checklist

- **Strict Determinism:** All procedural animations derive purely from `f = (frame / fps) * 60`.
- **Camera Rigidity:** Ensure camera coordinates remain strictly static to preserve diorama integrity.
- **Safe Margins:** All editorial overlays and taped labels strictly respect the 9:16 mobile safe zone (1080×1920).
