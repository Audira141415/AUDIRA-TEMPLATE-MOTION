# STYLE DNA: Classical Marble Museum — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Museum Skylight Rig

```
            [Skylight opening (emissive) + additive beam]
                              │
                              ▼
   [Warm rim 3300K from behind] ─► [Bust] ◄── [Spot key 5200K from skylight]
                              │
                              ▼
            [Polished floor reflections via RoomEnvironment]
```

### 1.1 Light Source Specifications
1. **Spot key:** `#FFF2DC`, intensity `22 × skylight(t)`, angle 0.32, penumbra 0.75, aimed just below the eyes.
2. **Rim:** directional `#FFC98A`, `0.7 + 0.6 × skylight`, from behind-left.
3. **Wall warmers:** point lights `#FFDDB5` (1.2) and `#FFD7A0` over the painting (5, distance 4).
4. **Fill:** hemisphere 0.18 + ambient 0.06 — shadows on marble stay soft but present.
5. **Skylight curve:** `0.55 + 0.25·smooth(0,4) + 0.6·smooth(8.4,10.2)` — the sun "finds" the face at the payoff.
6. **Finishing:** bloom 0.15 → 0.3, threshold 0.95 → ACES exposure 0.85 → vignette 0.45 → grain 0.02.
