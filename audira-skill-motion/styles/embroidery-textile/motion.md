# STYLE DNA: Embroidery & Textile — Motion & Temporal Dynamics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Frame Rate & Cadence
- **Target Frame Rate:** `60 FPS` final, `30 FPS` preview; all motion from the 60-based clock `f`.
- **Rhythm:** patient at first, accelerating, then a shimmering finish.

---

## 2. Motion Choreography
1. **Stitch Growth:** $g = \mathrm{smoothstep}((t - t_0) / 0.14)$; the stitch extends from its start point to full length.
2. **Schedule:** petal 1 over 0.3–2.4 s (39 stitches), petals 2–3 over 2.4–4.2 s, petals 4–5 over 4.2–5.6 s, stem + leaves 5.2–7.6 s, knots from 6.0 s (12 ms apart), gold ring 7.4–9.2 s, gold outlines 9.0–10.5 s.
3. **Needle:** tip = lerp(a, b, g); height $0.015 + 0.09\sin(\pi g)$ so it lifts mid-stitch and pierces at both ends; after 10.7 s it rises away.
4. **Live Thread:** Catmull-Rom from the needle eye up and out of frame, rebuilt every frame, coloured by the active thread.
5. **Glint Sweep:** $x = \mathrm{lerp}(-1.4, 1.4, k)$, power $\sin(\pi k)$, $k = \mathrm{smoothstep}(8.6 \to 11.2)$.
6. **Counter:** overlay shows stitches laid (about 62 per second).
