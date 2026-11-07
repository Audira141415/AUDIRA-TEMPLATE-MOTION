# STYLE DNA: Geohazard Cross-Section — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Museum Lab Rig

```
        [Key 5200K, high front-right, shadows]
                       │
                       ▼
 [Cool Fill 8000K] ──► [Earth Block] ◄── [Mantle underglow point light, orange]
                       │
                       ▼
            [Plinth + grid fade into fog]
```

### 1.1 Light Source Specifications
1. **Key:** directional `[4, 8, 6]`, intensity `2.1`, 2048 shadow map (town and trees cast on the hill).
2. **Fill:** directional `[-6, 3, 4]`, `#9CC8FF`, intensity `0.7`.
3. **Mantle Underglow:** point light `[0, -3.6, 3.2]`, intensity `3`, distance `6`, plus mantle emissive map at `0.28`.
4. **Event emissives:** fault, rings, route and beacon are unlit and not tone-mapped so they read as data.
5. **Fog:** `#0B141C`, 18 → 46 units.
