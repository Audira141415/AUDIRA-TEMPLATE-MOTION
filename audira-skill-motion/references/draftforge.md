# DRAFTFORGE — Style 10: architectural CAD blueprints & technical schematics

**In this package:** the CAD blueprint drafting engine in `kits/draftforge/` (millimeter drafting grid table, 3D vector line drawing, dimension callouts with arrows, compass rose, engineering title block stamp, graphic scale bar, and isometric camera rig) with an 8 s aerospace turbojet example; see `kits/draftforge/KIT.md`.

## Which briefs belong here?

Automatically select DRAFTFORGE for briefs involving:
- "Gambar teknik / denah arsitektur / cetak biru (blueprint) 3D"
- "Visualisasi paten teknik, skema mesin, atau perakitan CAD mekanis"
- "Penjelasan otomotif, mesin pesawat, rangka kapal, atau roket bergaya blueprint"
- "Animasi garis vektor putih-biru dengan garis ukuran (dimensi mm/meter) dan stamp approval teknik"
- "Transisi dari sketsa 2D kertas gambar teknik menjadi model 3D nyata"

Describe the look in friendly Indonesian: *"Gaya blueprint cetak biru teknik dengan garis vektor CAD putih/cyan di atas kertas biru gelap, lengkap dengan garis ukuran dimensi (meter/mm) dan stamp stempel teknik arsitektur."*

## Signature visual and narrative grammar

- **Authentic Blueprint Navy Palette:** The background is classic blueprint navy (`#091b36` / `#061327`) with fine millimeter grid lines and major 100mm grid accents.
- **Pure Vector CAD Line Art:** Crisp white (`#ffffff`) and technical cyan (`#4fc3f7`) wireframe line strokes that simulate drafting ink.
- **Dynamic Dimension Lines:** Golden measurement arrows that extend from parts with real measurement callouts (`12.50 m`, `Ø 45 mm`, `R 18.0`).
- **Exploded View along Centerlines:** Machine parts slide apart strictly along their physical assembly axis, joined by long-dash-dot centerlines.
- **Title Block Stamp:** Official ISO/ANSI engineering title block in the bottom-right corner displaying Project Title, Sheet Number, Scale (1:25), Revision (REV. 03), and APPROVED status stamp.
- **Graphic Scale Bar & Sheet Margin:** Double-line architectural border with coordinate zone letters/numbers and metric scale bar.

## Act structure that works (8–20s films)

1. **Drafting Rollout (0–25%):** The dark blueprint paper and millimeter grid establish; camera looks down in orthographic technical view as vector lines draw into place.
2. **Dimensioning & Isometric Tilt (25–65%):** Camera smoothly arcs from 2D top-down into a 30° isometric drafting perspective; dimension callouts snap into place; moving components (rotors, pistons, valves) actuate.
3. **Exploded Assembly & Technical Hold (65–100%):** Components separate into an exploded view along the centerline; status stamp flashes `APPROVED` in the title block; camera frames a pristine heroic technical composition.

## Determinism & QA checklist

- **Strict Determinism:** All pen draw-ins, rotations, explosions, and camera motions are pure functions of `f = (frame / fps) * 60`.
- **Centerline Consistency:** Exploded parts must remain strictly aligned to their primary shaft/axis; no arbitrary drifting or tumbling.
- **Legibility:** Maintain clean line weights without z-fighting against background grids.

