# INKSTORY — Style 16: East Asian ink wash, Shan Shui misty mountains & zen calligraphy

**In this package:** the East Asian ink wash and calligraphy engine in `kits/inkstory/` (3D procedural calligraphic brush strokes with write-on progression, layered Shan Shui misty mountains with atmospheric perspective, swaying ink bamboo, cinnabar vermilion seal stamp, diffused paper-screen lighting, and vertical poetry calligraphy overlay); see `kits/inkstory/KIT.md`.

## Which briefs belong here?

Automatically select INKSTORY for briefs involving:
- "Seni tradisional Asia Timur, lukisan tinta (Sumi-e / Shan Shui), kaligrafi, atau budaya klasik"
- "Filosofi Zen, ketenangan, meditasi, teh (tea ceremony), mindfulness, atau harmoni alam"
- "Kisah sejarah, puisi kuno, legenda persilatan (Wuxia), atau sastra klasik"
- "Pemandangan pegunungan berkabut, bambu berayun lembut, dan sapuan kuas artistik"
- "Branding bertema kebijaksanaan, keanggunan abadi (*timeless elegance*), atau warisan budaya (*heritage*)"

Describe the look in friendly Indonesian: *"Gaya lukisan tinta tradisional (Sumi-e) di atas kertas beras tua dengan pegunungan berkabut, sapuan kuas kaligrafi yang mengalir, dan cap stempel merah cinnabar."*

## Signature visual and narrative grammar

- **Textured Xuan Paper Atmosphere:** Warm organic paper background (`#f5f0e6`) with subtle paper fiber roughness, never a sterile digital white.
- **Layered Atmospheric Perspective:** Silhouettes of distant misty peaks rendered with fading ink washes (*pomo*), evoking profound spatial depth and serenity.
- **Dynamic Brush Gesture Dynamics:** Procedural 3D stroke ribbons with authentic pressure dynamics (delicate entry, heavy saturated belly, sharp tapering flick).
- **Vermilion Chop Accent:** A bold cinnabar red seal stamp (`#c23b2b`) that snaps onto the composition to anchor the balance of Yin and Yang.
- **Vertical Poetic Typography:** Elegant vertical Hanzi/Kanji or Latin calligraphic typography (`writing-mode: vertical-rl`) honoring scroll tradition.

## Act structure that works (8–20s films)

1. **The First Stroke (0–25%):** Quiet Xuan paper canvas awakens; camera pans gently tracking the animated arrival of a bold calligraphic ink stroke.
2. **Mist & Mountain Ascent (25–65%):** Camera glides vertically through drifting mist layers; distant indigo Shan Shui peaks and swaying bamboo groves emerge.
3. **The Crimson Seal (65–100%):** The red cinnabar seal stamps rhythmically onto the canvas; camera settles into a peaceful, perfectly balanced landscape framing; vertical verse fades in gently.

## Determinism & QA checklist

- **Strict Determinism:** All brush write-on curves, mist billow cycles, and camera poses derive strictly from `f = (frame / fps) * 60`.
- **Contrast & Tone:** Keep ink pigments rich and velvety (`#141312` to `#323c4a`) against the warm paper ground to prevent washed-out flat imagery.
- **Frame Rate:** Maintains steady 60 FPS performance by keeping geometry lightweight and using procedural cylinder sweeps.

