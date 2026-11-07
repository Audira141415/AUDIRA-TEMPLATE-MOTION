# STYLE DNA: Food Macro Tabletop — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Tungsten Key + Hot Backlight Rig

```
            [Hot Rim Spot 2800K, behind-left]
                         │  (lights steam + glaze edges)
                         ▼
 [Cool Kicker 7000K] ─► [Hero Dish] ◄── [Warm Softbox Key 3200K, front-right, shadows]
                         │
                         ▼
             [Walnut table: soft contact shadows]
```

### 1.1 Light Source Specifications
1. **Key:** directional `#FFD6A0`, intensity `2.3`, shadow map 2048, bias `−0.0004`.
2. **Backlight rim:** spot `#FFB36B`, intensity `34`, decay `1.6`, penumbra `0.9`; essential for steam.
3. **Secondary rim:** directional `#FFB36B`, intensity `0.9` from back-right.
4. **Cool kicker:** directional `#AFC6FF`, intensity `0.35` for edge separation.
5. **Environment:** procedural `RoomEnvironment` PMREM at `environmentIntensity 0.28` for food gloss.
