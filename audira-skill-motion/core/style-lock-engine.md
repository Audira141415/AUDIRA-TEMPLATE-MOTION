# CORE MODULE: Style Lock Engine
# AUDIRA MOTION INTELLIGENCE ENGINE

The **Style Lock Engine** enforces visual invariants across scenes, cuts, and multi-prompt generations. It acts as an aesthetic firewall that prevents AI hallucination, character mutation, lighting drift, and unwanted stylistic contamination.

---

## 1. The 5 Immutable Style Locks

When generating multi-scene videos or continuous sequences, the engine locks five critical layers:

### Lock 1: Character Anatomy & Seed Lock
- **Rig Invariance:** Head-to-body proportions, limb thickness, and facial features are locked.
- **Color Mapping:** Character garment hex codes and texture maps remain fixed across all camera angles.
- **Negative Enforcement:** Automatically injects anti-morphing negatives into generation prompts:
  `--no morphing, body proportion changes, extra limbs, face distortion, changing clothing color, inconsistent character geometry`.

### Lock 2: Material & Shader Lock
- **PBR Roughness Tolerance:** Prevents plastic from suddenly looking like glossy chrome or clay turning into liquid. Maximum allowable roughness drift: `±0.05`.
- **Specular Highlights:** High-specular reflections are bounded to preserve the matte/tactile aesthetic.
- **Texture Scale:** UV scale for paper fibers, plastic grain, or metal brush marks remains uniform across shots.

### Lock 3: Lighting Rig Invariance
- **Key Light Direction:** The primary key light angle cannot flip arbitrarily between consecutive shots (preserves 180-degree rule of illumination).
- **Color Temperature Rig:** Master Kelvin values (e.g. 3200K key, 5600K rim) are hard-coded across all scene configs.
- **Shadow Softness:** Ambient shadow density remains constant so cut transitions feel part of the same physical room.

### Lock 4: Camera Language Constraint
- **Field of View (FOV):** FOV must remain within the style's declared bracket (e.g. 30°–35° for diorama, 70°–85° for cyber HUD).
- **Movement Discipline:** If a style specifies `strictly_static`, no algorithmic panning or drifting is injected.
- **Eye-Level Horizon:** The vertical horizon line is locked to prevent disorienting jumps between cuts.

### Lock 5: Palette & Contrast Bounding
- **Background Luminance:** Bounded within `[0.05, 0.12]` for dark cinematic scenes or `[0.92, 0.98]` for clean minimal scenes.
- **Delta-E Color Tolerance:** CIEDE2000 color difference between scene assets must not exceed `ΔE < 3.2`.

---

## 2. Multi-Scene Drift Verification Protocol

Before accepting any newly generated scene into the final timeline, run the **Style Lock Audit**:

| Checkpoint | Target Metric | Fail Threshold | Auto-Remedy |
| --- | --- | --- | --- |
| Character Silhouette | SSIM > 0.88 against master rig | SSIM < 0.80 | Re-render with locked reference seed |
| Material Specularity | Roughness `0.78 ± 0.05` | Roughness `< 0.65` (too glossy) | Clamp roughness shader token |
| Lighting Temperature | 3200K ± 150K | 4500K+ (cool drift) | Enforce warm spotlight tint in post |
| Camera Horizon | Pitch angle `0.0° ± 1.5°` | Pitch `> 5.0°` | Reset camera rotation matrix to identity |
| Safe Margins | Margins `120px` top/bottom | Content inside margin | Re-scale and re-center composition |

