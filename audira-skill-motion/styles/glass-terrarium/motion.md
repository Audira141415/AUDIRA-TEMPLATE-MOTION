# STYLE DNA: Glass Terrarium — Motion & Temporal Dynamics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Frame Rate & Cadence
- **Target Frame Rate:** `60 FPS` final, `30 FPS` preview; time in seconds.
- **Rhythm:** meditative; 12 s = 06:00 → 23:00 (clock in the HUD).

---

## 2. Motion Choreography
1. **Day cycle:** keyed sky/sun/ambient at 0, 3.5, 6.8, 8.6, 9.8 s with smoothstep blends.
2. **Ferns:** each frond yaws `0.04·sin(1.1t + k·0.7)`.
3. **Condensation:** droplets grow 60% → 100% over 6 s; ~10% slide down and respawn at their own rate.
4. **Pool:** ripple rings at 5.3 s and 8.1 s.
5. **Snail:** eased glide along `snailAt`, foot stretch ±6% at 4.5 rad/s, eye stalks sway.
6. **Night:** mushrooms glow, 18 fireflies blink and orbit, bokeh brightens.
