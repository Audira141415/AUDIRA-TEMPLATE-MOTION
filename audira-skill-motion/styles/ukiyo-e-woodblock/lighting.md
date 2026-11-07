# STYLE DNA: Ukiyo-e Woodblock — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Flat Print Rig

```
        [Soft Key 5200K, from upper-left-front, PCF soft shadows]
                              |
                              v
   [Sky] [Sun] [Clouds] [Mountain] [Wave rows + Boats] [Crest] [Spray]
      ^ each sheet casts a paper drop shadow onto the sheet behind it
                              |
                [Warm Ambient 1.55 keeps ink colours flat]
```

### 1.1 Light Source Specifications
1. **Ambient:** `#FFF6E6`, intensity `1.55`. The print is mostly lit by ambient so colour fields stay flat.
2. **Soft Key:** directional `#FFF1DA`, intensity `1.1`, position `[-3, 4, 12]`, shadow map 2048, bias -0.0006, frustum ±12 x ±14.
3. **Tone Mapping:** `THREE.NoToneMapping` so vermilion and Prussian blue are not desaturated.

### 1.2 Atmosphere
- No fog: depth reads only through drop shadows, parallax and the bokashi sky.
- Background colour `#0F2747` matches the top of the sky so oversized views never show a seam.
