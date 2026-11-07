# STYLE DNA: Gacha Card Reveal — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Summon Stage Rig

```
                   [Top Spot, white, shadows]
                              │
                              ▼
 [Rarity Rim, back-left] ─► [Capsule / Card] ◄── [Warm Front Fill #FFE9C4]
                              ▲
             [Rarity practical point light in the capsule core]
                              │
             [Additive beams, rings, bloom — all rarityColor(t)]
```

### 1.1 Light Source Specifications
1. **Top spot:** white, intensity `60`, decay 1.5, angle 0.5, penumbra 0.8, casts shadows.
2. **Core practical:** point light in `rarityColor(t)`, `6 + 20·flash(t)`, distance 9.
3. **Rarity rim:** directional `rarityColor(t)`, `1.1`, from back-left.
4. **Front fill:** directional `#FFE9C4`, `0.6`.
5. **Environment:** `RoomEnvironment` at `0.35` for floor and foil reflections.
6. **HUD flash:** white overlay `min(0.85, 0.55·flash)`.
