# STYLE DNA: Scale Comparison — Motion & Temporal Dynamics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Frame Rate & Cadence
- **Target Frame Rate:** `60 FPS` final, `30 FPS` preview; time in seconds.
- **Rhythm:** about one subject every 1.8 s; ~13 orders of magnitude in 12 s.

---

## 2. Motion Choreography
1. **Exponent:** `e(t)` through subject keys with `k = 0.08·raw + 0.92·smootherstep(raw)`.
2. **Focus:** `C = lerp(Ca, Cb, (S − Sa)/(Sb − Sa))`, linear in S.
3. **Ruler:** major spacing chosen so it stays in [0.5, 5) render units; minor ticks fade with spacing.
4. **Backdrop:** `spaceMix = smoothstep((e − 3.6)/2.6)` drives background, fog, floor opacity, stars and lights.
5. **Life:** ant legs and antennae cycle, Earth and clouds rotate, the Sun turns, labels breathe ±1%.
