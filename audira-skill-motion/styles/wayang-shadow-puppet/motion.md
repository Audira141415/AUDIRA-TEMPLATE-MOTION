# STYLE DNA: Wayang Shadow Puppet — Motion & Temporal Dynamics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Frame Rate & Cadence
- **Target Frame Rate:** `60 FPS` final, `30 FPS` preview; all motion from the 60-based clock `f`.
- **Rhythm:** dalang sabetan: smooth entries, a held confrontation, one decisive strike, then the gunungan closes.

---

## 2. Motion Choreography
1. **Gunungan Twirl:** rotation about the rod $0.9\sin(2.6t)$ during the hook; exits right 2.0–3.4 s; sweeps back toward the lamp (z 0.22 to 1.05) 9.6–11 s so its shadow fills the screen.
2. **Rod Bob:** every puppet bobs $0.03\sin(3.1t + \phi)$ with a light sway on Z.
3. **Entries:** kesatria from x -3.1 to -0.85 (2.0–4.0 s), raksasa from x 3.2 to 0.95 (2.4–4.4 s), ease-in-out.
4. **Strike:** kesatria lunges +0.35 m and moves to z 0.75 (8.6–9.6 s), its shadow magnifies about 1.75x.
5. **Fall:** raksasa recoils +0.8 m, drops 0.25 m and tilts -0.55 rad (9.2–10.2 s).
6. **Flame:** $0.86 + 0.10\,n(6.5t) + 0.04\,n(17t)$ value noise drives light, glow sprite and cloth brightness together.
