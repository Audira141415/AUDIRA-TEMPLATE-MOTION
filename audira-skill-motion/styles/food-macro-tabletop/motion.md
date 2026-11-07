# STYLE DNA: Food Macro Tabletop — Motion & Temporal Dynamics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Frame Rate & Cadence
- **Target Frame Rate:** `60 FPS` final, `30 FPS` preview; everything derived from `useCurrentFrame()`.
- **Rhythm:** luxurious slow motion; one landing every ~0.6 s.

---

## 2. Motion Choreography
1. **Drop & Land (`dropLand`):** fall progress $p^2$ over 1.1–1.2 s, then bounce $0.08\,e^{-7a}|\sin 16a|$ and squash $0.25\,e^{-10a}$.
2. **Slow Tumble:** rotation speed decays with fall progress so items settle still.
3. **Steam:** looping lifecycle $u=(t/T+\phi)\bmod 1$, opacity $\sin(\pi u)$, scale grows $0.6 \to 1.9$.
4. **Drip:** droplet grows 0.5 s, stretches as it falls ($y \propto a^2$), ripple ring expands for 1 s.
5. **Payoff Lift:** chopstick tip rises 1.05 units with cubic in-out; noodle strands follow with a gentle sway.
