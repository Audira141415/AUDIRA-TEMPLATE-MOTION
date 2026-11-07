# STYLE DNA: Satisfying Loops — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Overhead Softbox Cyclorama Rig

```
                 [Overhead Softbox 6000K, VSM radius 14]
                                 │
                                 ▼
 [Pink Kicker, front-left] ─► [Station Object] ◄── [Hemisphere: sky #E9F0FF / ground #F6D7CF]
                                 │
                                 ▼
                   [Soft lilac contact shadows on sweep]
```

### 1.1 Light Source Specifications
1. **Softbox key:** directional `#FFF5EE`, intensity `1.45`, `VSMShadowMap`, `shadow-radius 14`, `blurSamples 16`.
2. **Hemisphere fill:** `0.55`, keeps shadows pastel.
3. **Kicker:** directional `#FFE7F0`, `0.45`, from front-left for clearcoat highlights.
4. **Environment:** procedural `RoomEnvironment` at `0.3` for clean candy reflections.
