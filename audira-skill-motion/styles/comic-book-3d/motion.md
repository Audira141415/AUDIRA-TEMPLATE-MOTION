# STYLE DNA: Comic Book 3D (COMICFORGE) — Motion & Temporal Dynamics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Cadence
- 60 fps clock (`f = frame / fps * 60`), smooth motion — no stepped frames.

## 2. Choreography
1. **Anticipation:** crouch 0.5 s before the leap (hips drop 0.32).
2. **Flight:** quadratic Bezier from rooftop to target, ease-in-out; speed lines stream along the flight vector.
3. **Impact:** shards follow a seeded velocity with drag + gravity; burst pops with `easeOutBack(k=2.6)`.
4. **Recoil & Hover:** exponential recoil then a 2.6 rad/s hover bob, turn back toward camera.
