# CORE MODULE: Visual DNA Extractor (Step 02)
# AUDIRA MOTION INTELLIGENCE ENGINE

The **Visual DNA Extractor** transforms raw visual analysis into a rigid, deterministic, and machine-readable specification. Once extracted, this "DNA" acts as the unchangeable seed for prompt generators, 3D shader parameters, and animation rigs.

---

## 1. Visual DNA Core Schema

Every style must produce or reference a standardized JSON specification:

```json
{
  "$schema": "https://audira.io/schemas/visual-dna.v1.json",
  "styleId": "3d-toy-diorama",
  "name": "Stylized 3D Toy Diorama",
  "version": "1.0.0",
  "palette": {
    "background": "#0F1117",
    "primary": "#E0A96D",
    "secondary": "#202020",
    "accent": "#FF5E3A",
    "neutral": "#EBE3D5",
    "text": "#FFFFFF"
  },
  "geometry": {
    "type": "blocky_beveled",
    "bevelRadius": 0.08,
    "polyBudget": "low_to_mid",
    "cornerSmoothing": "continuous",
    "silhouette": "chunky_geometric"
  },
  "materials": {
    "type": "pbr_dielectric",
    "roughness": 0.78,
    "metalness": 0.04,
    "clearcoat": 0.0,
    "transmission": 0.0,
    "subsurfaceScatter": 0.12,
    "normalMapType": "micro_plastic_grain"
  },
  "lighting": {
    "archetype": "three_point_theatrical",
    "keyLight": { "kelvin": 3200, "intensity": 1.4, "angle": [35, 45, 20] },
    "fillLight": { "kelvin": 5200, "intensity": 0.35, "angle": [-40, 20, 10] },
    "rimLight": { "kelvin": 6500, "intensity": 0.85, "angle": [180, 60, -30] },
    "ambientOcclusion": { "intensity": 0.75, "radius": 0.4 },
    "shadowSoftness": 0.35
  },
  "camera": {
    "type": "theatrical_macro",
    "focalLengthMm": 50,
    "fovDeg": 32,
    "position": [0, 1.2, 4.8],
    "target": [0, 0.8, 0],
    "depthOfField": { "enabled": true, "fStop": 2.8, "focusDistance": 4.8 },
    "shake": false,
    "motionConstraint": "strictly_static"
  },
  "motion": {
    "fps": 60,
    "physicsModel": "spring_damped",
    "spring": { "stiffness": 180, "damping": 16, "mass": 1.0 },
    "characterCadence": "snappy_organic",
    "blinkCadenceFrames": 180,
    "propEntryStyle": "vertical_slide_overshoot"
  },
  "graphicDesign": {
    "typography": "Editorial Sans / Heavy",
    "badgeStyle": "taped_kraft_paper",
    "safeZoneMarginPx": 120
  }
}
```

---

## 2. Extraction Pipeline Rules

1. **Quantize Colors to 5 Hex Tokens:** No messy gradients; define exact background, primary, secondary, accent, and neutral colors.
2. **Lock PBR Roughness & Metalness:** Express surface properties in numbers (0.0 to 1.0) rather than vague adjectives like "shiny" or "rough".
3. **Define Strict Camera Constraints:** Explicitly declare whether camera pan/tilt/zoom is permitted or strictly prohibited.
4. **Isolate Physics Curves:** Specify spring stiffness and damping numbers so animation easing is mathematically repeatable across scenes.
5. **Generate Prompt Anchors:** Synthesize the DNA into a 3-sentence master prompt snippet for text-to-video AI tools.

