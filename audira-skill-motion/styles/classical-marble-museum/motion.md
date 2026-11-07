# STYLE DNA: Classical Marble Museum — Motion & Temporal Dynamics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Frame Rate & Cadence
- **Target Frame Rate:** `60 FPS` final, `30 FPS` preview; everything derives from `t = frame / fps`.
- **Rhythm:** Slow, reverent, museum-quiet.

---

## 2. Motion Choreography
1. **Orbit:** $\theta(t) = \text{lerp}(0.38, -0.62, \text{easeInOutCubic}(t/12))$, radius pull-back $1.75 \to 4.3$.
2. **Subject:** static stone (a 0.004 rad settle only).
3. **Skylight Swell:** spot and beam follow `skylight(t)`; the payoff brightens the face and rim.
4. **Dust Motes:** rise through the beam at 0.015 cycles/s with slow swirl and twinkle.
5. **Label Card:** fades and lifts 24 px into place (9.0–9.9 s).

---

## 3. Story Beats (12 s example)
- 0–2 s Hook: close three-quarter on the carved face, veins and curls in skylight.
- 2–8.5 s Development: the orbit reveals bust, plinth, columns and the gilded frame.
- 8.4–11 s Payoff: the sun lands on the face; "Bust of an Unknown Thinker" label slides in.
