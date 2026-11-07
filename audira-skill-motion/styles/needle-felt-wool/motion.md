# STYLE DNA: Needle-Felt Wool — Motion & Temporal Dynamics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Frame Rate & Cadence
- **Render:** `60 FPS` final, `30 FPS` preview.
- **Puppet cadence:** 12 poses per second (`stepT`), seeded pose jitter ±0.003 units; camera smooth.

---

## 2. Motion Choreography
1. **Pop-up:** `easeOutBack` rise from below the hillock (0.5–1.6 s).
2. **Hops:** six hops, arc $0.28\sin(\pi\,\mathrm{frac}(6p))$, landing squash 0.18 decaying in 20% of a hop.
3. **Tree shake:** $0.08\sin(40a)e^{-3.5a}$ on the trunk, doubled on canopy balls, apples counter-swing.
4. **Apple drop:** quadratic fall with a small arc into the paws (`foxHandLocal`), catch squash 0.15.
5. **Raise & hearts:** `easeOutBack` arm lift lifts the apple overhead; five felt hearts pop with `easeOutBack` and float up.
6. **Ambient:** pompom clouds sway on their threads, flowers nod (all stepped).
