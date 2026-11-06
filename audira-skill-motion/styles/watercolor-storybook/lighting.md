# STYLE DNA: Watercolor Storybook — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Natural Morning Skylight Rig

The Watercolor Storybook style avoids artificial studio flash in favor of soft, diffused outdoor morning light:

```
                    [Soft Sky Fill (6200K, Diffuse)]
                                  │
                                  ▼
   [Pop-Up Paper Layers] ──► [Character] ◄── [Golden Sun Key (3000K, Low Angle)]
                                  │
                                  ▼
                   [Soft Translucent Ground Shadows]
```

### 1.1 Light Source Specifications
1. **Low-Angle Morning Key Light:**
   - Color Temperature: `3000K` (Warm golden sunlight)
   - Intensity: `1.1`
   - Angle: $22^\circ$ elevation, $65^\circ$ azimuth
   - Shadow: Extremely soft diffuse falloff (`shadowBias: -0.0002`).
2. **Ambient Skylight Fill:**
   - Color Temperature: `6200K` (Pale morning sky blue)
   - Intensity: `0.65`
   - Purpose: Keeps pastel watercolor pigments vibrant without dark crushing.

