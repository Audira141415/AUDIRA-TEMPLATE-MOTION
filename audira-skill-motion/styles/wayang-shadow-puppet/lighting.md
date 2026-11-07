# STYLE DNA: Wayang Shadow Puppet — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Single Blencong Rig

```
  [Dalang side]                      [Kelir z=0]                  [Audience side]
  Blencong 1900K  ---> Puppets --->  front: lit cloth + shadow    back: amber glow + black shadow
        |                                                               ^
        +--- flicker 0.86-1.00                    cool rim 0.5 ---------+
```

### 1.1 Light Source Specifications
1. **Blencong Key:** point light `#FF9E3D`, intensity `9 x flicker`, distance 14, decay 1.5, at `[0, 2.85, 1.75]`.
2. **Indigo Ambient:** `#4A3A6A` at 0.35 + hemisphere `#3A3466 / #2A1608` at 0.5 so the hall never goes black.
3. **Audience Rim:** directional `#7F8CC8`, 0.5, from behind the screen to outline puppets and pillars.
4. **Studio Reflections:** PMREM `RoomEnvironment` at `environmentIntensity 0.18` so bronze and prada gold read as metal.

### 1.2 Shadow Logic
- Shadow centre and scale from `projectToKelir`: $k = L_z / (L_z - z_p)$.
- Opacity softens as $k$ grows: front 0.6, back 0.95, both multiplied by `clamp(1 - 0.28 (k - 1), 0.55, 1)`.
- Back cloth glow: radial gradient `#FFD27E` to `#E8892E` to `#4A1A08`, brightness `0.8 + 0.25 x flicker`.
