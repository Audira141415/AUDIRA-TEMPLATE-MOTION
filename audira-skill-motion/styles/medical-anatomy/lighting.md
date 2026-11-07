# STYLE DNA: Medical Anatomy — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Clinical Hologram Rig

```
        [Key 5800K, front-high]
                 │
                 ▼
 [Teal Rim] ──► [Organ] ◄── [Teal projector under-light, point, short range]
                 │
                 ▼
        [Additive hologram floor + light cone]
```

### 1.1 Light Source Specifications
1. **Key:** directional `[3, 5, 5]`, `#FFF3EE`, intensity `2.2` (clearcoat highlights sell the wet-but-clean look).
2. **Teal Rim:** directional `[-4, 2, -3]`, `#3FE0D0`, intensity `1.4`.
3. **Projector Under-light:** point `[0, -0.9, 0.6]`, intensity `3`, distance `5`.
4. **Ambient:** `0.35`, `#CFF7F2`.
5. **Unlit elements:** blood cells, rings, scan ring, pulse ring are not tone-mapped. Keep the projector rim matte (roughness 0.75) or it flares.
