# STYLE DNA: Y2K Chrome — Motion & Temporal Dynamics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Frame Rate & Cadence
- **Target Frame Rate:** `60 FPS` final, `30 FPS` preview; all motion from `useCurrentFrame()`.
- **Rhythm:** bouncy pop: impacts, merges and the morph land on clear beats.

---

## 2. Motion Choreography
1. **Drop:** falls with $p^2$ and stretches up to 1.9×; crown droplets fly out on a parabola at impact.
2. **Impact squash:** $s(t) = A\sin(13a)e^{-3.2a}$ added to y-scale (volume-preserving on x/z).
3. **Liquid wobble:** three travelling sine lobes, amplitude 0.05–0.12 decaying after the drop.
4. **Metaball merge:** satellites spiral in with cubic easing; the blob bulges toward them with $\max(0,\hat d\cdot\hat n)^6$.
5. **Sparkle morph:** `easeOutElastic` blend from blob to star (8.6–9.9 s), spin decays to front.
6. **Bubbles:** looping rise $u=(t/T+\phi)\bmod 1$, gentle wobble; half of them pop at 10.1 s (scale ×1.75, vanish in 0.25 s).
