# STYLE DNA: Mosaic Tiles — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Raking Workshop Rig

```
   [Warm Key 3400K, low rake → rises with camera]
                    │
                    ▼
   [Tilted tesserae: glaze sheen varies tile to tile]  ◄── [Cool Fill 7500K]
                    │
                    ▼
   [Procedural RoomEnvironment → gold smalti reflections]
```

### 1.1 Light Source Specifications
1. **Key:** directional `#FFD9A0`, intensity 2.1, height `1.6 → 8.6` as the camera rises (smooth 7–10.5 s), slowly orbiting.
2. **Fill:** directional `#9DB4FF`, intensity 0.55, from the camera side.
3. **Sky/ground:** hemisphere `#FFE9C8 / #3A2618`, 0.5.
4. **Environment:** `RoomEnvironment` through `PMREMGenerator`, `scene.environmentIntensity = 0.32`.
5. **Finishing:** bloom 0.22 / radius 0.35 / threshold 0.95 → ACES (exposure 0.95) → vignette 0.4 → grain 0.022.
