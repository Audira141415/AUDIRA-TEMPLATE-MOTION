# STYLE DNA: Embroidery & Textile — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Warm Studio + Glint Sweep Rig

```
   [Warm Key 3600K, upper-left, soft shadows]        [Cool Rim, back-right]
                     |                                       |
                     v                                       v
        [Hoop + Linen + Stitches]  <-- [Glint Sweep point light travels x -2.2 -> 2.2]
                     |
           [Songket gold floats (metalness mask)]
                     ^
           [PMREM RoomEnvironment 0.35 for gold/steel reflections]
```

### 1.1 Light Source Specifications
1. **Key:** directional `#FFD9A6`, 1.55, `[-2.2, 4, 2.2]`, PCF soft shadows 2048, frustum ±3.
2. **Fill:** hemisphere `#FFE9D2` / `#2A0E18`, 0.4.
3. **Rim:** directional `#B9C4FF`, 0.7, from behind to outline threads and hoop.
4. **Glint Sweep:** point light `#FFF0D0`, intensity `7 x sin(pi k)`, distance 4, decay 1.5, at `[sweep x 1.6, 0.55, 0.9]`, 8.6–11.2 s.
5. **Environment:** `RoomEnvironment` via PMREM, `environmentIntensity 0.35`; gold `envMapIntensity 1.6`, needle 2.0.

### 1.2 Atmosphere
- Warm-dark backdrop `#140A0E` with linear fog 4.5–9 m so the songket fades softly; light radial vignette in the overlay.
