# STYLE DNA: Ukiyo-e Woodblock — Motion & Temporal Dynamics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Frame Rate & Cadence
- **Target Frame Rate:** `60 FPS` final, `30 FPS` preview; all motion from the 60-based clock `f`.
- **Rhythm:** tidal; continuous heave, one decisive break.

---

## 2. Motion Choreography
1. **Layer Heave:** $h(t) = A\sin(1.6t + \phi) + 0.5A\sin(0.7t + 1.7\phi)$, with $A$ growing from 0.03 (far) to 0.10 (front).
2. **Layer Slide:** $0.12\sin(\omega t + k)$, $\omega$ from 0.5 (far) to 0.9 (front): opposite phases sell the paper depth.
3. **Boats:** ride their neighbouring wave's heave and roll $\pm0.1$ rad.
4. **Sun Rise:** v from 0.7 to 2.0 over 0.5–9.5 s (smoothstep). Clouds drift ±0.03 u/s.
5. **Crest Break (8.8–10 s):** lean +0.07 rad, shift -0.2 u, scale +4%.
6. **Spray Burst (9.2–11.6 s):** ballistic $x = x_0 + v_x\tau$, $y = y_0 + v_y\tau - 1.4\tau^2$, fading out.
7. **Seal Stamp (10.1–10.5 s):** scale 1.8 to 1.0 with ease-out-back and a 0.4 rad twist settling to 0.
