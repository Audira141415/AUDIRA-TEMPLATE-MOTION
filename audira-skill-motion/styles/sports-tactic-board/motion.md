# STYLE DNA: Sports Tactic Board — Motion & Temporal Dynamics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Frame Rate & Cadence
- **Target Frame Rate:** `60 FPS` final, `30 FPS` preview; all motion is a function of seconds.
- **Rhythm:** match tempo: a pass every ~1.2 s, a held beat for each coaching step.

---

## 2. Motion Choreography
1. **Player Tracks:** timed `(x, z)` keys with cubic ease-in-out plus a seeded ±0.03 idle shuffle.
2. **Ball:** sits 0.24 ahead of its holder; passes ease between holders with a sine lift (0.04 ground pass, 0.55 switch).
3. **Lanes:** draw on 0.6 s before the pass, fade 0.2–1.0 s after.
4. **Runs:** dashed arrow grows along a quadratic Bézier over ~1 s, fades when the run completes.
5. **Goal:** back net bulge `exp(-3.2 d) · |sin(9 d)|`, gold pulses under the scorer, score bug flips, GOAL flash 1.4 s.
6. **Replay:** gold tube of the full ball path draws over ~2 s while the camera orbits.
