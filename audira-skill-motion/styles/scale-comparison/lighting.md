# STYLE DNA: Scale Comparison — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Studio-to-Solar Rig

```
   [Key 5600K, upper left, shadows] ──► [Subject] ◄── [Side light: cool in studio, warm solar in space]
                                          │
                                          ▼
                     [Contact shadow on the white studio floor]
```

### 1.1 Light Source Specifications
1. **Key:** directional `[-5, 8, 7]`, intensity `2.2`, 2048 shadow map (shadow bounds are in render units, so they never break with scale).
2. **Side:** directional `[6, 2, 3]`, intensity `0.6 → 2.2`, `#DDE8FF` in the studio, `#FFC27A` once in space.
3. **Ambient + Hemisphere:** fade out with `spaceMix` so planets get a real terminator.
4. **Sun:** unlit textured sphere, `toneMapped={false}`, corona sprite at 3.4 R with additive blending.
