# STYLE DNA: Glass Terrarium — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Window Sun Rig (Day-Night)

```
   [Sun/Moon key: orbits, colour + elevation from dayState, shadows]
                           │
                           ▼
 [Cool back fill] ──► [Glass Jar] ◄── [Hemisphere: sky colour / warm table bounce]
                           │
                           ▼
       [Night: green mushroom point light + fireflies + warm bokeh]
```

### 1.1 Light Source Specifications
1. **Key:** directional from `dayState().sunPos`; morning `#FFC98A` 2.0, noon `#FFF6E8` 2.8, dusk `#FF8A4A` 1.8, night `#7FA2FF` 0.7; 2048 shadow map ±3.
2. **Fill:** directional `[-4, 3, -4]`, `#CFE6FF`, 0.6.
3. **Ambient / Hemisphere:** follow the cycle (0.55 → 0.7 → 0.4 → 0.16).
4. **Bioluminescence:** point light at the mushroom cluster, intensity `1.6 · night`, distance 1.6; cap emissive `1.6 · night`.
