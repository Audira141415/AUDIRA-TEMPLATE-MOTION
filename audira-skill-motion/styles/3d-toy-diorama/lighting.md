# STYLE DNA: 3D Toy Diorama — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. The Theatrical Studio Lighting Rig

The Toy Diorama style uses a specialized 4-source theatrical studio setup:

```
                  [Rim Light (5600K)]
                           │
                           ▼
     [Dark Backdrop / Scenery Flats]
                           │
       ┌───────────[Toy Character]───────────┐
       │                                     │
  [Fill Light]                         [Key Light]
 (4800K, 0.4x)                        (3200K, 1.4x)
       │                                     │
       └──────────────[Stage]────────────────┘
                           ▲
             [Footlights (2700K Glow)]
```

### 1.1 Light Source Specifications
1. **Key Light (Primary Spotlight):**
   - Color Temperature: `3200K` (Warm golden tungsten)
   - Intensity: `1.4`
   - Angle: $35^\circ$ elevation, $45^\circ$ azimuth
   - Shadow: Soft penumbra (`shadowBias: -0.0001`, `shadowMapSize: 2048`)
2. **Fill Light:**
   - Color Temperature: `4800K` (Soft neutral daylight)
   - Intensity: `0.35`
   - Purpose: Lifts deep shadows on the character's unlit side without washing out contrast.
3. **Rim / Kicker Separator:**
   - Color Temperature: `5600K` – `6500K` (Cool daylight)
   - Intensity: `0.85`
   - Purpose: Creates a sharp hairline edge separating character shoulders from the dark background.
4. **Theatrical Footlights:**
   - Color Temperature: `2700K` (Cozy candle/incandescent amber)
   - Position: Array along the front edge of the stage floor.
   - Purpose: Illuminates the character's lower torso and casts gentle upward shadows onto the scenery flats.

---

## 2. Ambient Occlusion & Shadows
- **Ambient Occlusion (AO):** High-density micro-contact shadows under character feet and prop bases (`radius: 0.3`, `intensity: 0.8`).
- **Background Falloff:** Quadratic inverse-square falloff ensuring the cyclorama background remains deep and mysterious (`#0D0F14`).

