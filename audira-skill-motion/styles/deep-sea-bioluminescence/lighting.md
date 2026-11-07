# STYLE DNA: Deep-Sea Bioluminescence — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Self-Lit Darkness Rig

```
   [Surface Key 9000K, fades to 0 by ~1,000 m]
                   │
                   ▼
   [God-ray planes (additive)] ─► [Jelly point lights (cyan/magenta/violet, pulse-synced)]
                   │
                   ▼
   [Lure point light → reveals predator]  +  [cold cyan rim from behind]
```

### 1.1 Light Source Specifications
1. **Surface key:** directional `#7FC8F0`, intensity `2.4 × surfaceLight(t)`; hemisphere `#2B6E95 / #020509`.
2. **Creature practicals:** one point light per jelly, `distance 6`, `decay 1.6`, intensity `(1.4 + 2.6·pulse) × size`.
3. **Lure:** point light `#D8FFFB`, intensity `14 × lureLight(t)` (flicker 8.6–9.4 s), `distance 7`, `decay 1.2`.
4. **Fog:** `FogExp2`, density `0.085 → 0.115` with depth, colour = background.
5. **Finishing:** bloom strength 0.8, radius 0.5, threshold 0.78 → ACES filmic → vignette 0.42 → grain 0.03.
