# CORE MODULE: Visual Reference Analyzer (Step 01)
# AUDIRA MOTION INTELLIGENCE ENGINE

The **Visual Reference Analyzer** is the first step in the Reference-Driven AI Motion Pipeline. Its mission is to deconstruct any visual reference (uploaded image, Instagram Reel, TikTok video, 3D still, Pinterest moodboard, or product render) into measurable, objective visual attributes.

---

## 1. Analysis Dimensions

Every reference input is parsed across 6 fundamental visual dimensions:

### 1.1 Composition & Spatial Layout
- **Frame Ratio & Safe Zones:** Default 9:16 vertical (1080×1920) with 120px top/bottom system UI clearance.
- **Rule of Thirds & Golden Ratio:** Subject placement, horizon line, visual anchor point.
- **Depth Staging:** Foreground framing elements, middle ground subject layer, background depth separation.
- **Visual Weight & Clutter:** Negative space ratio (recommended >= 40% for premium editorial feel).

### 1.2 Subject & Character Anatomy
- **Anatomy Style:** Stylized blocky toy, realistic humanoid, deformed chibi, low-poly faceted, or abstract geometric.
- **Proportions:** Head-to-body ratio (e.g. 1:2.5 for chibi/toy, 1:7.5 for realistic cgi).
- **Silhouette Readability:** Identifiable shape language in pure black silhouette.
- **Face & Expressions:** Painted eyes, OLED visor, cel-shaded facial rig, or featureless mannequin.

### 1.3 Geometry & Mesh Topology
- **Primitive Archetypes:** Rounded cylinders, beveled cubes, lathe primitives, voxel grids, or subdivision surfaces.
- **Edge Treatment:** Bevel radius (e.g. 2px-8px for tactile plastic vs sharp 0.5px for hard sci-fi CAD).
- **Detail Density:** Micro-bevels, panel lines, seam lines, or organic clay thumbprints.

### 1.4 Materials & PBR Surface Physics
- **Albedo / Base Color:** Diffuse color palette, saturation levels, warm/cool bias.
- **Roughness Spectrum:** 
  - Ultra-glossy / Liquid / Mirror: `0.05 - 0.15`
  - Satin / Semi-gloss: `0.25 - 0.45`
  - Matte plastic / Toy / Paper: `0.60 - 0.85`
  - Raw clay / Chalk / Charcoal: `0.85 - 0.98`
- **Metalness:** Dielectric (`0.0`) vs Pure Metallic (`1.0`).
- **Subsurface Scattering (SSS):** Skin, wax, clay, silicone translucency.
- **Transmission / Refraction:** Frosted glass, acrylic, water, crystal (IOR 1.33 - 1.52).
- **Surface Texture Normal:** Noise bump, paper grain, brushed metal, clay striations.

### 1.5 Lighting & Illumination Dynamics
- **Rig Structure:** Three-point studio rig (Key, Fill, Rim) vs Environment HDRI vs Theatrical footlights.
- **Color Temperature (Kelvin):**
  - Warm incandescent / Golden hour: `2700K - 3400K`
  - Neutral daylight studio: `5000K - 5600K`
  - Cool sci-fi / Cyber neon: `6500K - 9000K`
- **Contrast Ratio:** High key (soft shadows, 2:1 ratio) vs Chiaroscuro / Film Noir (dramatic hard shadows, 8:1 ratio).
- **Contact Shadows & Ambient Occlusion (AO):** Ground contact shadow radius, self-shadowing depth.

### 1.6 Motion Grammar & Temporal Dynamics (For Video References)
- **Cadence / Frame Rate:** 24 FPS (cinematic film), 30 FPS (commercial broadcast), 60 FPS (ultra-smooth tech explainer).
- **Camera Movement:** Static locked, orbital tracking, linear dolly push-in, dynamic snap-zoom, hand-held organic drift.
- **Physics Weight:** Spring stiffness (`k`), damping (`c`), squash-and-stretch elasticity, gravity acceleration.

---

## 2. Reference Decomposition Output Schema

When analyzing an input reference, the analyzer outputs a structured analysis card:

```markdown
### Visual Reference Analysis Card
- **Primary Style Identified:** [e.g. 3D Toy Diorama / Film Noir / Cyberpunk]
- **Dominant Palette:** Primary: `#HEX`, Secondary: `#HEX`, Accent: `#HEX`, Neutral: `#HEX`
- **Character / Subject Language:** [Geometric blocky, rounded bevels, tactile matte finish]
- **Environment Staging:** [Miniature theatrical stage with dark background & footlights]
- **Lighting Archetype:** [Warm 3200K key + 5600K rim separator + ground AO]
- **Material Fingerprint:** [Matte plastic 0.78 roughness, walnut wood plank floor]
- **Camera Grammar:** [Static eye-level macro rig, 35mm equivalent FOV 32°, no camera shake]
- **Temporal Rhythm:** [60 FPS, spring damping 14, calm deliberate gesture pacing]
```

---

## 3. Reference Analyzer Decision Tree

```
User uploads/links visual reference
              │
              ▼
   Extract Still Frames (0s, mid, end)
              │
              ▼
   Analyze 6 Dimensions (Layout, Anatomy, Geometry, Material, Light, Motion)
              │
              ▼
   Match Closest Style in Audira 33 Catalog
              │
              ├── Exact Match Found (e.g. Toy Diorama) ──► Load styles/3d-toy-diorama/
              │
              └── Novel / Hybrid Combination ──────────► Form new DNA via core/visual-dna-extractor.md
```

