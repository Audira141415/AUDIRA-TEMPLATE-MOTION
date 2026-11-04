# TOONFORGE — Style 13: cel-shaded 3D anime, ink contours & manga speed lines

**In this package:** the cel-shaded anime action engine in `kits/toonforge/` (MeshToon materials with sharp light termination, inverted-hull black ink outlines, procedural radial manga speed lines, mecha flight physics, velocity tunnel rings, impact camera shake, and dramatic comic letterboxing) with an 8 s mecha valkyrie example; see `kits/toonforge/KIT.md`.

## Which briefs belong here?

Automatically select TOONFORGE for briefs involving:
- "Animasi 3D anime / cel-shading / gaya kartun Jepang"
- "Aksi mecha, robot tempur, pesawat jet futuristik, atau karakter bergaya manga"
- "Efek garis kecepatan (manga speed lines), ledakan aksi komik, dan snap zoom dramatis"
- "Video promosi gaming, konten kreator jejepangan, atau cerita aksi berenergi tinggi"
- "Garis kontur tinta hitam (ink outline) dengan warna cerah kontras tinggi"

Describe the look in friendly Indonesian: *"Gaya animasi 3D anime cel-shaded dengan garis kontur tinta hitam khas manga, garis kecepatan aksi (speed lines), snap-zoom kamera dramatis, dan efek visual komik berenergi tinggi."*

## Signature visual and narrative grammar

- **Cel-Shaded Lighting:** Pure `MeshToonMaterial` with stepped diffuse lighting that creates sharp boundaries between light and shadow, avoiding muddy 3D gradients.
- **Inverted-Hull Ink Contours:** Black backface meshes scaled slightly larger than the geometry to create uniform, camera-independent comic ink lines.
- **Dynamic Manga Speed Lines:** Procedural radial lines converging on the focal craft during boost and acceleration phases.
- **Anime Camera Grammar:** Decisive snap-zooms with micro-overshoot (`animeSnap`), dramatic $15^\circ–25^\circ$ Dutch tilt banking, and exponential impact shake (`impactShake`).
- **Comic Book UI Framing:** Bold high-contrast action banners, letterbox framing, and comic sound-effect typography.

## Act structure that works (8–20s films)

1. **Dramatic Silhouette & Idle (0–25%):** Close-up framing on the craft in low power; ink outlines crisp against the dawn sky; cockpit canopy illuminates.
2. **Thruster Ignition & Speed Burst (25–65%):** Instant camera snap; impact screen shake; twin plasma thrusters ignite; radial speed lines erupt as craft banks into aerodynamic roll.
3. **Heroic Glide & Comic Freeze (65–100%):** Speed lines ease into high-speed slipstream; camera pulls back into an iconic battle-ready Dutch tilt pose; action callout locks into place.

## Determinism & QA checklist

- **Strict Determinism:** All speed line flickers, thruster pulses, and camera trajectories derive purely from `f = (frame / fps) * 60`.
- **Outline Integrity:** Verify that inverted-hull outline meshes share matching transforms and do not detach during rotations.
- **High-Contrast Separation:** Ensure rim lighting (`#ff7597`) separates dark mecha parts from dark background horizons.

