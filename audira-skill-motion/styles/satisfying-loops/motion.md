# STYLE DNA: Satisfying Loops — Motion & Temporal Dynamics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Frame Rate & Cadence
- **Target Frame Rate:** `60 FPS` final, `30 FPS` preview; all motion from `useCurrentFrame()`.
- **Rhythm:** metronomic: slices every 0.4 s, fill layers ~1 s each, drops every 0.55–0.65 s.

---

## 2. Motion Choreography
1. **Blade plunge:** `easeInQuad` down in 0.26 s, lift in 0.2 s, step to the next cut line.
2. **Slice flip:** rotate −90° about the bottom-right edge with cubic in-out while translating `(k·W, k·W)` onto the stack, small arc lift $0.12\sin(\pi e)$, then `settle()`.
3. **Layer fill:** clipping plane height eased with cubic in-out from line to line, stream colour switches per layer, meniscus settle $0.006\sin(14a)e^{-6a}$.
4. **Perfect fit:** piece falls with $p^2$, spin decays to exactly 0 at contact, slides `BOARD_T` into the hole in 0.42 s, white pulse ring, final emissive glow.
