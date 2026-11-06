# STYLE DNA: Film Noir — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. The Extreme Chiaroscuro Rig

The Film Noir lighting architecture is built on extreme contrast ratios ($8:1$ to $16:1$ key-to-fill):

```
                  [Misty Backlight (Streetlamp)]
                                │
                                ▼
                       [Detective Silhouette]
                                │
   [Venetian Blinds Gobo]       │
  (Hard Slanted Shadows)        │
            │                   │
            ▼                   ▼
    [Damp Brick Wall]   [Wet Ground Reflection]
```

### 1.1 Light Source Specifications
1. **Harsh Key Spotlight:**
   - Color Temperature: Pure Tungsten / Cool White (`4500K - 5500K` in monochrome balance).
   - Intensity: `2.2`
   - Shadow Penumbra: Razor sharp (`shadowBias: -0.00005`, `shadowMapSize: 4096`).
   - Gobo Filter: Venetian blind slats angled at $-32^\circ$.
2. **Fill Light:**
   - Intensity: `0.08 - 0.12` (Nearly black to preserve deep noir shadows).
3. **Streetlamp Rim / Hair Light:**
   - Position: High overhead and behind the subject.
   - Purpose: Carves the silhouette out of the black void with a bright silver rim highlight.
4. **Neon Accent Reflection:**
   - Amber/Cyan puddle reflection in the lower third for subtle selective color contrast.

