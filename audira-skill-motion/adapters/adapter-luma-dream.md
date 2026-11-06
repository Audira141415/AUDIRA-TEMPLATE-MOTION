# ADAPTER: Luma Dream Machine (Camera Tracks & Keyframe Morphing)
# AUDIRA MULTI-MODEL PROMPT COMPILERS

This adapter handles keyframe transition prompt pairs and camera trajectory syntax for **Luma Dream Machine**.

---

## 1. Luma Dream Machine Syntactic Profile

- **Camera Trajectory Tokens:** `Static tripod`, `Orbit right`, `Pan left`, `Dolly push-in`, `Crane up`.
- **Morphing / Transition Handling:** Luma excels at physical continuous transformations between two uploaded images (Start Frame -> End Frame).

---

## 2. Compilation Template

```text
[Camera Trajectory Token]: [Action Transition from State A to State B]. Seamless physical morphing, consistent character identity, constant lighting temperature at [Kelvin]K, preserve [Material Type] textures throughout movement.
```

---

## 3. Style Example: `timeforge-evolution`
```text
Static camera orbit 360: The antique 1920s rotary phone smoothly transforms into a 1960s beige bakelite model, and then morphs into a modern 2026 curved titanium smartphone. The lighting shifts chronologically from warm tungsten amber candle glow into pristine studio daylight white. Continuous object scale, zero flickering.
```

