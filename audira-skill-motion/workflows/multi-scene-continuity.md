# WORKFLOW: Multi-Scene Continuity
# AUDIRA MOTION WORKFLOWS

This workflow maintains rigorous visual and narrative continuity across multi-scene projects (e.g. 30s–60s videos spanning 3 to 6 distinct shots).

---

## 1. The Core Continuity Challenges
In generative AI and multi-component 3D scenes, transitions frequently cause:
- **Character Drift:** Spontaneous changes in character face, height, clothing color, or accessories.
- **Lighting Discontinuity:** Key light suddenly flipping from left to right across a hard cut.
- **Scale Confusion:** Props changing size relative to character hands.
- **Palette Inconsistency:** Background switching from warm neutral to cold blue between cuts.

---

## 2. Continuity Enforcement Rules

### 2.1 The Master Asset Manifest
Before rendering Scene 01, lock the Master Asset Manifest in memory:
- **Character Rig:** `character_id`, mesh vertex count, texture UV hash, color hex map.
- **Stage Environment:** Fixed floor coordinates, backdrop distance, ambient shadow density.
- **Key Light Vector:** Fixed vector `[35, 45, 20]`, constant Kelvin temperature.

### 2.2 Shot-to-Shot Transition Protocols
- **Match Cut on Action:** If character begins raising their arm at `t = 2.8s` in Scene 1, Scene 2 must open at `t = 2.8s` with the arm already in the same angular velocity.
- **Whip Pan / Dissolve Easing:** If a camera motion transition is used, acceleration in Scene 1 must equal deceleration in Scene 2.
- **Sound Bridge (J-Cut / L-Cut):** Audio or sound effect begins 6–12 frames before the visual cut to create subconscious psychological continuity.

### 2.3 Continuity Verification Matrix
Before final assembly, compare the last frame of Shot $N$ with the first frame of Shot $N+1$:
1. Does the character have identical clothing tokens? (Yes/No)
2. Is the lighting orientation consistent with the scene space? (Yes/No)
3. Is typography sizing and margin alignment identical? (Yes/No)

