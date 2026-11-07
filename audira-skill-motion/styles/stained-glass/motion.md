# STYLE DNA: Stained Glass — Motion & Temporal Dynamics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Frame Rate & Cadence
- **Target Frame Rate:** `60 FPS` final, `30 FPS` preview; everything derives from `t = frame / fps`.
- **Rhythm:** Measured and reverent, like a glazier's hands.

---

## 2. Motion Choreography
1. **Pane Fly-In:** 0.95 s flight from the nave side (z +2.4…+5, scattered, tumbling) with `easeOutBack` (overshoot 1.4) into the lead.
2. **Seating Glint:** brightness `+0.9·e^{-3.2(t - seat)}` the moment a pane lands.
3. **Order:** rose heart (0.15 s) → rose rings (+0.45 s per ring) → quarries from apex to sill (1.7–7.6 s, ±0.5 s jitter).
4. **Dust Motes:** drift along the beam volume at 0.012 cycles/s with sine wander, twinkle `0.4 + 0.6·(0.5+0.5 sin)^2`.
5. **Sun Burst:** flare sprite scales `0.8 → 3.4` and the floor pool reaches full strength (8.6–10.4 s).

---

## 3. Story Beats (12 s example)
- 0–2 s Hook: gold and ruby panes fly past the lens into the rose.
- 2–8.5 s Development: pull back while the quarries fill the lancet; the counter climbs to 273.
- 8.6–11 s Payoff: the sun flares through the rose; jewel light pools across the flagstones.
