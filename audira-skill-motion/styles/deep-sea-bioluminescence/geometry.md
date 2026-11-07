# STYLE DNA: Deep-Sea Bioluminescence — Geometry & Mesh Topology
# AUDIRA STYLE DNA LIBRARY

---

## 1. Primary Mesh Archetypes
- **Jelly Bell:** `LatheGeometry` of a domed profile with a slight inward lip (48 radial segments), inner bell at 0.62 scale, four horseshoe torus glow organs, emissive rim torus.
- **Tentacles & Oral Arms:** 14 thin `TubeGeometry` tentacles + 4 thicker arms per jelly, rebuilt per frame from `CatmullRomCurve3` (travelling sine sway); old geometry is disposed.
- **Predator ("lanternmaw"):** seeded-bump sphere hide (72×54), overhanging upper jaw, hinged lower jaw, 26 needle-cone teeth, mirror eyes, fan fins (`ShapeGeometry`), photophore dots, tube stalk + esca sphere.
- **Particles:** 2,200 instanced icosahedron marine-snow flakes; 520 instanced plankton spheres with per-instance HDR colour.
- **Seabed:** 120×120 plane displaced with gaussian silt dunes.

---

## 2. Depth Staging
- Background: fog/background colour ramp + god-ray planes (additive, fog-free).
- Midground: jellies scheduled 2.4 units under the camera along its path.
- Foreground: marine snow passing the lens.
- HUD: sonar ring, depth counter, caption.
