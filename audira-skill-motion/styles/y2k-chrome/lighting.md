# STYLE DNA: Y2K Chrome — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Sky Environment Reflection Rig

```
         [Overhead softbox panel ×3]     [pink / lime / cyan streak panels]
                       │                              │
                       └──────► PMREM sky env ◄────────┘
                                     │
                                     ▼
              [Chrome blob, rings, bubbles reflect sky + streaks]
                                     ▲
           [White key 6500K] ────────┴──────── [Cyan rim #6AF5FF]
```

### 1.1 Light Source Specifications
1. **Environment:** `makeEnvScene()` → PMREM (blur 0.02), `environmentIntensity 1`. This is the main light for chrome.
2. **Key:** directional white, `1.6`, from upper front-right (for clouds and bubbles).
3. **Rim:** directional `#6AF5FF`, `0.8`, from back-left.
4. **Ambient:** `#DFF3FF`, `0.4`.
5. **Sun glow:** additive sprite, not a light.
