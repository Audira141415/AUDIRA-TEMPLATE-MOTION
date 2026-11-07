# STYLE DNA: Pencil Sketch to 3D (SKETCHFORGE) — Motion & Temporal Dynamics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Cadence
- 60 fps, smooth; pencil tip micro-tremor 0.006 units while drawing.

## 2. Choreography
1. **Draw:** strokes in order, time ∝ length (hatch weighted 0.35); edges get a second offset pass.
2. **Extrude:** lift delay = 0.55 × height/2.5, each over 0.45 of the phase, with a sin peel arc of 0.25.
3. **Clay:** clip plane rises −0.05 → 2.7 (ease-in-out).
4. **Colour:** clay → final colour, wire thins to 15%.
5. **Lift:** `easeOutBack(1.4)` to +0.55, then a gentle 2.2 rad/s bob; yaw 0.5 rad; smoke puffs cycle.
