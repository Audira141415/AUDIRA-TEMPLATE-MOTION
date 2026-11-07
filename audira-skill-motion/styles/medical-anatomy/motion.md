# STYLE DNA: Medical Anatomy — Motion & Temporal Dynamics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Frame Rate & Cadence
- **Target Frame Rate:** `60 FPS` final, `30 FPS` preview; time in seconds.
- **Rhythm:** 72 BPM (1.2 Hz) lub-dub: lub at phase 0.06, dub at 0.34.

---

## 2. Motion Choreography
1. **Beat:** organ scale `1 + 0.045·lub + 0.022·dub`; ventricles squeeze 14–16% on lub, atria 10% on dub.
2. **Reveal:** wall opacity 1 → 0.22 over 1.8–4.2 s; chambers and valves fade up.
3. **Flow:** `flowPhase` = per-beat surge (smoothstep over 35% of the cycle) + slow drift; blue circuit from 2.4 s, red from 5.0 s, each growing along its path over 1.6 s.
4. **Labels:** 5.6 / 6.4 / 7.2 / 8.0 s, 0.5 s fade, leader lines follow the projected anchor every frame.
5. **Instruments:** rings rotate at different rates, scan ring sweeps every ~3.1 s, floor pulse ring per beat, payoff flare from 8.8 s.
