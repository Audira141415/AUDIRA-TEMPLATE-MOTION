# STYLE DNA: Sports Tactic Board — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Stadium Floodlight Rig

```
        [Floodlight Key 6500K, high, shadows]
                       │
                       ▼
 [Cool Rim 7500K] ──► [Pitch + Tokens] ◄── [Hemisphere: sky #CFE0FF / grass bounce #1A2A10]
                       │
                       ▼
        [Crisp contact shadows under every token]
```

### 1.1 Light Source Specifications
1. **Floodlight Key:** directional `[5, 12, 5]`, intensity `2.4`, 2048 shadow map, bounds ±7/±8.
2. **Cool Rim:** directional from behind the far goal `[-6, 6, -12]`, intensity `0.9`, `#9CC3FF`.
3. **Hemisphere Fill:** `0.55` keeps the grass saturated without flattening the tokens.
4. **Emissive accents:** lanes, arrows, halos and floodlight panels are `toneMapped={false}` so they read as broadcast graphics.
5. **Fog:** `#070B10` from 16 to 38 units, so the bowl falls off into darkness.
