# STYLE DNA: Dreamcore Surreal — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Pastel Sky-Dome Rig

```
        [Gradient sky dome → baked PMREM environment]
                          │
                          ▼
   [Low warm sun beyond the arch] ─► [Tile + water] ◄── [Lilac fill from behind camera]
                          │
                          ▼
             [Doorways: HDR sky + additive light pools]
```

### 1.1 Light Source Specifications
1. **Sun:** directional `#FFF4E0`, intensity 1.3, from beyond the arch (`[-6, 10, -20]`).
2. **Fill:** directional `#CDBCF5` 0.5 from behind the camera; hemisphere sky/water 0.35; ambient `#FFC7E4` 0.1.
3. **Environment:** the sky shader rendered to PMREM, `environmentIntensity 0.45`.
4. **Fog:** `FogExp2 #F6D9EE`, density 0.013.
5. **Finishing:** bloom 0.25 → 0.45 at the payoff, threshold 0.95 → ACES exposure 0.68 → vignette 0.32 → grain 0.03.
