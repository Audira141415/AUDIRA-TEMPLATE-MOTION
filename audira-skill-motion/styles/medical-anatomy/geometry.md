# STYLE DNA: Medical Anatomy — Geometry & Mesh Topology
# AUDIRA STYLE DNA LIBRARY

---

## 1. Primary Mesh Archetypes
- **Myocardium:** 96x72 sphere deformed by `heartify` (tapered apex shifted to the patient's left, broad base, interventricular groove).
- **Chambers:** four ellipsoids (RA, RV blue; LA, LV red) that squeeze on dub (atria) and lub (ventricles).
- **Valves:** two tori between atria and ventricles.
- **Vessels:** `TubeGeometry` on Catmull-Rom centre-lines: aorta (r 0.15) + branches, pulmonary trunk (0.13) + right branch, SVC, IVC, two pulmonary veins; coronary arteries as thin surface tubes.
- **Blood:** 300 instanced cells per circuit (2 paths each), seeded ±0.045 jitter.
- **Suite:** backdrop dome, projector plane + rim cylinder + light cone, three partial tori, scan ring + disc, 120 motes.

---

## 2. Staging Layers
- Layer 1 (Foreground): motes and the nearest clinical ring arcs.
- Layer 2 (Subject): the heart, vessels and flow.
- Layer 3 (Middle Ground): rings, scan slice, halo.
- Layer 4 (Background): imaging-suite dome with scan lines.
- Layer 5 (HUD): vitals + ECG, projected labels, caption, disclaimer.
