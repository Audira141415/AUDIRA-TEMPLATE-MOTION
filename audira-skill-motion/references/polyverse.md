# POLYVERSE — Style 12: faceted low-poly worlds & floating islands

**In this package:** the flat-shaded low-poly engine in `kits/polyverse/` (faceted procedural nature, stacked-cone pine trees with wind sway, faceted low-poly river with vertex waves, geometric drifting clouds, subterranean rock cones, crystal monolith, pastel dawn/sunset lighting, and telephoto isometric camera rig) with an 8 s floating island example; see `kits/polyverse/KIT.md`.

## Which briefs belong here?

Automatically select POLYVERSE for briefs involving:
- "Animasi 3D low-poly / pulau melayang (floating island diorama)"
- "Gaya minimalis poligon datar (flat shading) ala game *Monument Valley* atau *Journey*"
- "Pemandangan alam geometris pastel (hutan pinus, sungai faceted, awan geometri, batu kristal)"
- "Video meditasi, musik santai, konten eksplorasi zen, atau game indie"
- "Sudut pandang isometrik sinematik yang tenang dan memanjakan mata"

Describe the look in friendly Indonesian: *"Gaya dunia 3D minimalis low-poly dengan permukaan poligon berfaset datar (flat-shaded), pulau melayang di udara, pohon pinus bergoyang tertiup angin, dan tata cahaya fajar pastel ala game Monument Valley."*

## Signature visual and narrative grammar

- **True Flat Shading:** Every surface has `flatShading: true` enabled, giving visible polygonal triangle facets that catch distinct highlights and shadows.
- **Floating Island Architecture:** Suspended landmasses featuring an inverted subterranean rock cone underneath, lush emerald grass plateau on top, and embedded natural features.
- **Harmonious Pastel Palette:** Emerald green, slate basalt, crystal blue, sunset amber, and soft dawn skies, avoiding garish neon or muddy grays.
- **Secondary Natural Kinetics:** Subtle wind sway on foliage (`windSway`), rippling polygon vertices on water surfaces (`waterWave`), and floating clouds.
- **Telephoto Isometric Framing:** Narrow field of view (28°–32°) producing a calm, perspective-compressed miniature landscape.

## Act structure that works (8–20s films)

1. **Dawn Emergence (0–25%):** Soft dawn light warms the low-poly horizon; camera initiates a gentle glide past pine trees; clouds drift into the frame.
2. **Terrain Exploration & River Drift (25–65%):** Camera arcs around the island; low-poly river sparkles with vertex displacement; central crystal monolith pulses with pastel light.
3. **Majestic Hero Isometric Hold (65–100%):** Camera pulls back into a grand 3/4 isometric composition capturing the entire floating island suspended in the peaceful sky.

## Determinism & QA checklist

- **Strict Determinism:** All wind sways, water ripples, cloud drifts, and camera positions derive purely from `f = (frame / fps) * 60`.
- **Preserve Facets:** Ensure no smooth vertex normals are computed on terrain or tree foliage meshes.
- **Clean Silhouette:** Ensure the floating island's underside cone forms a clean geometric silhouette against the sky.

