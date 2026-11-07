# STYLE DNA: Gacha Card Reveal — Motion & Temporal Dynamics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Frame Rate & Cadence
- **Target Frame Rate:** `60 FPS` final, `30 FPS` preview; all motion from `useCurrentFrame()`.
- **Rhythm:** suspense (0–6 s) → explosion (6 s) → reveal (8.5–9.5 s) → hold.

---

## 2. Motion Choreography
1. **Shake:** seeded 30 Hz jitter, amplitude $0.015 + 0.03(\text{tier}+1)$ plus a ramp in the last 0.8 s before the burst.
2. **Tier upgrade:** colour cross-fade 0.4 s, flash $e^{-6a}$, shockwave ring expands 3.5 units in 0.8 s, label slams with `easeOutBack(k=2.2)`.
3. **Burst:** flash $1.4e^{-3.5a}$, halves fly apart (`easeOutCubic`, 0.9 s), shockwave 7 units.
4. **Confetti:** position $p_0 + v\frac{1-e^{-1.6a}}{1.6} + \frac12 g a^2$, tumbling at 0–12 rad/s, fade over 5.5 s; second puff at the flip.
5. **Card:** rise `easeOutCubic` (1.55 s), spin $9(1-\text{rise})$ rad, flip π → 0 with `easeOutBack(1.3)`, idle float ±0.04.
