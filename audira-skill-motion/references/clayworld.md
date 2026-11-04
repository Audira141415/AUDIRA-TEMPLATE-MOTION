# CLAYWORLD — Style 11: tactile stop-motion claymation & plasticine diorama

**In this package:** the tactile stop-motion engine in `kits/clayworld/` (stepped frame cadence quantizer, volume-preserving squash-and-stretch scale solver, procedural fingerprint noise, plasticine clay materials, clay character puppet, tabletop diorama with mushrooms and trees, warm miniature studio lighting, and stop-motion camera rig) with an 8 s clay creature example; see `kits/clayworld/KIT.md`.

## Which briefs belong here?

Automatically select CLAYWORLD for briefs involving:
- "Animasi claymation / tanah liat / plastisin gaya stop-motion"
- "Cerita karakter lucu, hangat, taktil ala Aardman (Wallace & Gromit / Shaun the Sheep)"
- "Diorama meja buatan tangan (handcrafted tabletop) dengan jamur, pohon, atau binatang kecil"
- "Video edukasi anak, konten emosional, atau animasi yang ingin terasa sangat organik dan non-AI"
- "Karakter kenyal yang melompat dengan fisika squash and stretch yang ekspresif"

Describe the look in friendly Indonesian: *"Gaya animasi stop-motion plastisin/tanah liat (claymation) buatan tangan yang hangat dan taktil, dengan gerakan melompat kenyal (squash & stretch) pada ritme 15 FPS ala film studio Aardman."*

## Signature visual and narrative grammar

- **Stepped Stop-Motion Cadence:** Poses update every 4 frames (`stepFrame(f, 4)` = 15 FPS cadence inside a 60 FPS video), eliminating artificial robotic CG smoothness and mimicking physical armature animation.
- **Physical Plasticine Materials:** High diffuse roughness (`0.85–0.92`), low metalness, and subtle procedural fingerprint micro-indentations.
- **Volume-Preserving Squash and Stretch:** Characters deform elastically upon jump and impact while strictly maintaining geometric mass ($s_x \times s_y \times s_z \approx 1$).
- **Tabletop Miniature Studio Optics:** Warm key softbox lighting, soft peach tabletop bounce light, and shallow depth of field framing a miniature set.
- **Discrete Stop-Motion Blinking:** Eyes snap between open spheres and flat pressed lids over 1–2 stepped frames, avoiding smooth tweened eyelids.

## Act structure that works (8–20s films)

1. **Awakening & Macro Glimpse (0–25%):** Close-up on sleepy clay lump; first stepped stretch; character opens eyes with discrete two-frame blink.
2. **Playful Hop & Diorama Reveal (25–65%):** Character performs energetic squash-and-stretch hops; camera drifts backward to reveal the colorful mushroom and foliage diorama.
3. **Connection & Hero Hold (65–100%):** Character lands safely, looks directly at the camera with an expressive wave or gesture, and settles into a warm, joyful final frame.

## Determinism & QA checklist

- **Strict Determinism:** All step calculations, squash factors, and camera tracks derive purely from `f = (frame / fps) * 60`.
- **Avoid 60 FPS CG Smoothness:** Ensure character transforms are wrapped with `stepFrame(f, 4)` to preserve stop-motion charm.
- **Lighting Coherence:** Maintain warm miniature studio tones (`#fff1db` key, `#d5c5b1` tabletop) to prevent cold artificial renders.

