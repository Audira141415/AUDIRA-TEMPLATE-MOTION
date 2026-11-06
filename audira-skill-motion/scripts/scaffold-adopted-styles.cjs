const fs = require('fs');
const path = require('path');

const STYLES_DIR = path.join(__dirname, '..', 'styles');

const adoptedStyles = [
  {
    id: 'hd-2d',
    styleNumber: 35,
    name: 'HD-2D Diorama & Tilt-Shift Pixel World',
    kit: 'hd2d',
    category: 'Gaming Cinematic / 2D Sprites in 3D Diorama',
    palette: {
      background: '#0B0E14',
      primary: '#E5A93C', // Warm lantern glow
      secondary: '#18202F', // Deep midnight blue
      accent: '#FF4A3D', // Hero scarlet scarf
      neutral: '#D4D9E2', // Mist silver
      ink: '#08090C',
      text: '#FFFFFF'
    },
    geometry: {
      type: 'box_and_billboard_diorama',
      bevelRadius: 0.02,
      polyBudget: 'low_geo_with_dense_sprites',
      silhouette: 'stepped_retro_diorama'
    },
    materials: {
      type: 'pixel_art_billboard_pbr',
      roughness: 0.85,
      metalness: 0.00,
      clearcoat: 0.00,
      normalMap: 'bayer_dithered_palette'
    },
    lighting: {
      archetype: 'dual_temperature_diorama',
      keyLight: { kelvin: 6500, intensity: 0.6, angle: [30, 45, 0] }, // Cold ambient fog
      fillLight: { kelvin: 7000, intensity: 0.3 },
      rimLight: { kelvin: 5500, intensity: 0.8 },
      practicals: { kelvin: 2400, intensity: 2.2, type: 'shadow_casting_point_lights' },
      ambientOcclusion: { intensity: 0.85, radius: 0.35 }
    },
    camera: {
      type: 'elevated_tilt_shift_macro',
      focalLengthMm: 50,
      fovDeg: 32,
      depthOfField: { enabled: true, fStop: 1.8, tiltShiftBand: true },
      motionConstraint: 'high_three_quarter_glide'
    },
    motion: {
      fps: 60,
      physicsModel: 'dual_cadence_stepped_and_smooth',
      characterCadence: '8fps_stepped_sprites_with_60fps_camera',
      blinkCadenceFrames: 180
    }
  },
  {
    id: 'memphis-diorama',
    styleNumber: 36,
    name: 'Memphis 3D Tabletop Diorama & Terrazzo Model',
    kit: 'memphisdiorama',
    category: '1980s Design / Architectural Tabletop Model',
    palette: {
      background: '#FFFCF6', // Warm white paper
      primary: '#FFD234', // Canary yellow
      secondary: '#FF5A5F', // Coral pink
      accent: '#5CC8FF', // Sky blue
      neutral: '#5EDFB0', // Mint green
      shadowPurple: '#705890', // Cool hard purple shadow
      ink: '#25214A', // Deep indigo outline
      text: '#25214A'
    },
    geometry: {
      type: 'memphis_tabletop_primitives',
      bevelRadius: 0.015,
      polyBudget: 'clean_architectural_massing',
      silhouette: 'geometric_playful_shapes'
    },
    materials: {
      type: 'flat_memphis_with_halftone_shade',
      roughness: 0.90,
      metalness: 0.00,
      clearcoat: 0.00,
      normalMap: 'terrazzo_and_halftone_dots'
    },
    lighting: {
      archetype: 'hard_sun_with_purple_shadows',
      keyLight: { kelvin: 5400, intensity: 1.8, angle: [45, 55, 0] },
      fillLight: { kelvin: 5400, intensity: 0.2 },
      rimLight: { kelvin: 5400, intensity: 0.0 },
      ambientOcclusion: { intensity: 0.4, radius: 0.2 }
    },
    camera: {
      type: 'tabletop_model_overview',
      focalLengthMm: 45,
      fovDeg: 38,
      depthOfField: { enabled: false }, // Memphis stays flat and sharp
      motionConstraint: 'high_isometric_orbit'
    },
    motion: {
      fps: 60,
      physicsModel: 'procedural_ambient_loops',
      characterCadence: 'distant_ambient_cycles',
      squashStretchSpring: { stiffness: 200, damping: 14 }
    }
  },
  {
    id: 'data-physical',
    styleNumber: 37,
    name: '3D Data Physicalization & Sculptural Stats',
    kit: 'dataphysical',
    category: 'Information Sculpture / Commercial Luxury Data',
    palette: {
      background: '#C4BEB4', // Seamless warm greige sweep
      baseWalnut: '#2A1B14', // Crafted wooden slab
      primaryMetal: '#C8CCD1', // Machined aluminum
      acrylicTeal: '#9FD3D6', // Transparent teal acrylic
      brassGold: '#D2B07A', // Ruler milestone brass
      accentOrange: '#D4521C', // Focal reading accent
      ink: '#1C1D20',
      text: '#FFFFFF'
    },
    geometry: {
      type: 'stacked_countable_plates_and_bars',
      bevelRadius: 0.01,
      polyBudget: 'instanced_precision_mesh',
      silhouette: 'sculptural_data_monoliths'
    },
    materials: {
      type: 'luxury_pbr_transmission',
      roughness: 0.18,
      metalness: 0.88,
      clearcoat: 0.40,
      normalMap: 'brushed_radial_aluminum'
    },
    lighting: {
      archetype: 'apple_commercial_macro_studio',
      keyLight: { kelvin: 3400, intensity: 1.8, angle: [25, 40, 10] },
      fillLight: { kelvin: 5600, intensity: 0.4 },
      rimLight: { kelvin: 6500, intensity: 1.5 },
      ambientOcclusion: { intensity: 0.9, radius: 0.25 }
    },
    camera: {
      type: 'cinematic_macro_pull_back',
      focalLengthMm: 65,
      fovDeg: 26,
      depthOfField: { enabled: true, fStop: 2.0 },
      motionConstraint: 'continuous_macro_dolly_out'
    },
    motion: {
      fps: 60,
      physicsModel: 'cascade_drop_assembly',
      characterCadence: 'gravity_stack_damping'
    }
  },
  {
    id: 'satellite-briefing',
    styleNumber: 38,
    name: '3D Satellite & OSINT Geospatial Reconnaissance',
    kit: 'satellitebriefing',
    category: 'Geospatial / OSINT Reconnaissance',
    palette: {
      background: '#070B0E', // Deep space void
      groundAnalyst: '#4A5358', // Desaturated terrain grey
      primaryOcean: '#102A45', // Deep true ocean
      markWhite: '#F2F5F6', // Thin measurement vectors
      readingAmber: '#FFBE55', // Focal measurement accent
      claimBlue: '#2E70CE', // Territorial boundary
      text: '#ECEFF4'
    },
    geometry: {
      type: 'nested_georeferenced_tiles',
      bevelRadius: 0.00,
      polyBudget: 'multi_lod_planetary_tiles',
      silhouette: 'planetary_to_street_mesh'
    },
    materials: {
      type: 'analyst_clarity_imagery',
      roughness: 0.80,
      metalness: 0.00,
      clearcoat: 0.00,
      normalMap: 'topographic_elevation_relief'
    },
    lighting: {
      archetype: 'directional_orbital_sunlight',
      keyLight: { kelvin: 5800, intensity: 2.2, angle: [45, 60, 0] },
      fillLight: { kelvin: 6500, intensity: 0.3 },
      rimLight: { kelvin: 9000, intensity: 1.6 },
      ambientOcclusion: { intensity: 0.5, radius: 0.5 }
    },
    camera: {
      type: 'logarithmic_orbit_to_ground_zoom',
      focalLengthMm: 35,
      fovDeg: 55,
      depthOfField: { enabled: false },
      motionConstraint: 'continuous_log_descent'
    },
    motion: {
      fps: 60,
      physicsModel: 'logarithmic_altitude_decay',
      characterCadence: 'radar_reticle_snap'
    }
  },
  {
    id: 'liminal-corridors',
    styleNumber: 39,
    name: 'Liminal 3D Corridors & 90s Found Footage',
    kit: 'backrooms',
    category: 'Liminal Space / Psychological Mystery',
    palette: {
      background: '#0A0B09',
      wallpaperYellow: '#D5BD66', // Sickly mustard wallpaper
      carpetOchre: '#8C763C', // Dingy institutional carpet
      trimWood: '#4D3D26', // Dark laminate trim
      fluorescentWhite: '#F5F2DC', // Overhead troffer glow
      alarmRed: '#FF2222', // Solo emergency exit lamp
      text: '#FFFFFF'
    },
    geometry: {
      type: 'procedural_maze_corridors',
      bevelRadius: 0.005,
      polyBudget: 'modular_office_panels',
      silhouette: 'endless_orthogonal_hallways'
    },
    materials: {
      type: 'grimy_office_pbr',
      roughness: 0.75,
      metalness: 0.05,
      clearcoat: 0.00,
      normalMap: 'carpet_weave_and_peeling_wallpaper'
    },
    lighting: {
      archetype: 'flat_fluorescent_array_with_flicker',
      keyLight: { kelvin: 4200, intensity: 1.2, angle: [0, 90, 0] },
      fillLight: { kelvin: 4000, intensity: 0.7 },
      rimLight: { kelvin: 4200, intensity: 0.0 },
      ambientOcclusion: { intensity: 0.9, radius: 0.3 }
    },
    camera: {
      type: 'handheld_vhs_camcorder_rig',
      focalLengthMm: 28,
      fovDeg: 62,
      depthOfField: { enabled: true, fStop: 2.8, autofocusHunt: true },
      motionConstraint: 'handheld_walking_bob_with_tremor'
    },
    motion: {
      fps: 30, // Authentic 90s tape framerate
      physicsModel: 'walking_gait_harmonic',
      characterCadence: 'first_person_cautious_step'
    }
  },
  {
    id: 'visual-investigation',
    styleNumber: 40,
    name: 'Visual Journalism & Forensic Courtroom Desk',
    kit: 'visualinvestigation',
    category: 'Investigative Journalism / Legal Reconstruction',
    palette: {
      background: '#0B0C0E', // Dark cold desk
      panelCharcoal: '#141619', // Evidence card background
      hairlineGrey: '#2E3238', // Precision grid
      evidenceRed: '#FF4A2E', // Highlighter wipe & alert marker
      telegramPaper: '#E4E0D4', // Authentic document scan
      inkBlack: '#1D1D1B', // Document typography
      text: '#ECEAE4'
    },
    geometry: {
      type: 'flat_multi_panel_evidence_desk',
      bevelRadius: 0.01,
      polyBudget: 'clean_2d_planes_in_3d_canvas',
      silhouette: 'courtroom_plan_and_dossier'
    },
    materials: {
      type: 'scanned_archival_paper_and_highlighter',
      roughness: 0.95,
      metalness: 0.00,
      clearcoat: 0.00,
      normalMap: 'document_crease_and_grain'
    },
    lighting: {
      archetype: 'forensic_desk_overhead_softbox',
      keyLight: { kelvin: 5000, intensity: 1.4, angle: [0, 85, 0] },
      fillLight: { kelvin: 5000, intensity: 0.6 },
      rimLight: { kelvin: 5000, intensity: 0.2 },
      ambientOcclusion: { intensity: 0.6, radius: 0.2 }
    },
    camera: {
      type: 'orthographic_forensic_desk_tracker',
      focalLengthMm: 55,
      fovDeg: 30,
      depthOfField: { enabled: false }, // Everything razor sharp
      motionConstraint: 'punch_zoom_to_highlight'
    },
    motion: {
      fps: 60,
      physicsModel: 'cut_in_with_marker_wipe',
      characterCadence: 'clock_synchronized_evidence'
    }
  }
];

function generateMarkdownSuite(s) {
  const dir = path.join(STYLES_DIR, s.id);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 1. style.md
  const styleMd = `# STYLE DNA: ${s.name} — Style Overview
# AUDIRA STYLE DNA LIBRARY

**Style ID:** \`${s.id}\` (Audira Style #${s.styleNumber})  
**Internal Engine Kit:** \`kits/${s.kit}/\`  
**Classification:** ${s.category}  
**Target Engines:** Remotion + React Three Fiber, Kling AI 1.5, Midjourney v6.1, Runway Gen-3

---

## 1. Aesthetic Essence & Visual Identity
- **Visual Core:** Authoritative implementation of ${s.name}.
- **Atmosphere:** Distinctive, brand-defining presence crafted strictly for 9:16 high-conversion mobile screens.
- **Directorial Intent:** Maximizes viewer retention through deliberate staging, crisp silhouette readability, and zero AI visual slop.

---

## 2. Palette & Color Tokens

\`\`\`json
${JSON.stringify(s.palette, null, 2)}
\`\`\`

---

## 3. Master Prompt Anchors

### Positive Generation Anchor:
> \`Commercial masterpiece 3D animation, ${s.name}, ${s.geometry.silhouette}, ${s.materials.type} surface finish with roughness ${s.materials.roughness}, illuminated by ${s.lighting.archetype}, camera ${s.camera.type} with focal length ${s.camera.focalLengthMm}mm, disciplined motion pacing, 8k render, octane render style, award winning motion design.\`

### Negative Avoidance Anchor:
> \`photorealistic human skin blemishes, uncanny valley distortions, flat low-effort 2d cartoons, muddy colors, harsh digital clipping, uncontrolled camera shake, cheap motion blur, character morphing, distorted geometry.\`
`;
  fs.writeFileSync(path.join(dir, 'style.md'), styleMd, 'utf8');

  // 2. geometry.md
  const geometryMd = `# STYLE DNA: ${s.name} — Geometry & Mesh Topology
# AUDIRA STYLE DNA LIBRARY

---

## 1. Primary Mesh Archetypes
- **Mesh Classification:** \`${s.geometry.type}\`
- **Bevel Radius:** \`${s.geometry.bevelRadius}\` units (Continuous curvature fillet chamfering).
- **Poly Count Budget:** \`${s.geometry.polyBudget}\` (Optimized for 60 FPS WebGL rendering).
- **Silhouette Character:** \`${s.geometry.silhouette}\`

---

## 2. Topology & Modeling Discipline
- Watertight manifold geometry; zero non-manifold edges or flipped face normals.
- Specular highlights reflect smoothly across chamfered edge bevels.
- Proportions strictly anchored to ergonomic human and spatial reference scales.
`;
  fs.writeFileSync(path.join(dir, 'geometry.md'), geometryMd, 'utf8');

  // 3. materials.md
  const materialsMd = `# STYLE DNA: ${s.name} — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Parameter | Value | Description |
| --- | --- | --- |
| **Material Archetype** | \`${s.materials.type}\` | Primary shader surface formulation |
| **Roughness** | \`${s.materials.roughness}\` | Microfacet scattering coefficient (0.0 to 1.0) |
| **Metalness** | \`${s.materials.metalness}\` | Conductor vs dielectric ratio |
| **Clearcoat** | \`${s.materials.clearcoat || '0.00'}\` | Secondary specular coat |
| **Normal Map Type** | \`${s.materials.normalMap}\` | Surface micro-relief bump texture |

---

## 2. Specular & Reflection Boundaries
- Specular highlights calibrated to eliminate sensor blowout under high-key illumination.
- Diffuse albedo maintains high WCAG contrast against dark backgrounds.
`;
  fs.writeFileSync(path.join(dir, 'materials.md'), materialsMd, 'utf8');

  // 4. lighting.md
  const lightingMd = `# STYLE DNA: ${s.name} — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Studio Lighting Rig: \`${s.lighting.archetype}\`

### Key Light (Primary Illumination):
- **Color Temperature:** \`${s.lighting.keyLight.kelvin}K\`
- **Intensity:** \`${s.lighting.keyLight.intensity}\`
- **Orientation Angle:** \`[${s.lighting.keyLight.angle.join(', ')}]\`

### Fill Light (Shadow Softener):
- **Color Temperature:** \`${s.lighting.fillLight.kelvin}K\`
- **Intensity:** \`${s.lighting.fillLight.intensity}\`

### Rim / Kicker Light (Edge Separator):
- **Color Temperature:** \`${s.lighting.rimLight.kelvin}K\`
- **Intensity:** \`${s.lighting.rimLight.intensity}\`
- **Purpose:** Separates subject cleanly from the backdrop.

---

## 2. Ambient Occlusion & Shadows
- High-fidelity ambient occlusion anchors objects firmly to ground surfaces.
- Soft shadow penumbra matches the physical softness of the specified light rig.
`;
  fs.writeFileSync(path.join(dir, 'lighting.md'), lightingMd, 'utf8');

  // 5. camera.md
  const cameraMd = `# STYLE DNA: ${s.name} — Camera & Optical Framing
# AUDIRA STYLE DNA LIBRARY

---

## 1. Optical Specifications
- **Rig Archetype:** \`${s.camera.type}\`
- **Focal Length:** \`${s.camera.focalLengthMm}mm\`
- **Vertical Field of View (FOV):** \`${s.camera.fovDeg}°\`
- **Depth of Field:** \`${s.camera.depthOfField.enabled ? 'Enabled (' + s.camera.depthOfField.fStop + ')' : 'Infinite / Disabled'}\`
- **Motion Constraint:** \`${s.camera.motionConstraint}\`

---

## 2. 9:16 Mobile Framing Guardrails
- Keep all focal action strictly centered inside the 920×1480px action area.
- Top 160px and bottom 280px remain clear of essential text and focal props.
`;
  fs.writeFileSync(path.join(dir, 'camera.md'), cameraMd, 'utf8');

  // 6. motion.md
  const motionMd = `# STYLE DNA: ${s.name} — Motion & Temporal Dynamics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Cadence & Target Framerate
- **Framerate:** \`${s.motion.fps} FPS\` constant.
- **Physics Framework:** \`${s.motion.physicsModel}\`
- **Character / Asset Cadence:** \`${s.motion.characterCadence}\`

---

## 2. Dynamic Choreography & Curves
- Use non-linear spring easing for all transformations.
- Ensure strict continuity across scene cuts: preserve angular momentum and velocity vectors.
`;
  fs.writeFileSync(path.join(dir, 'motion.md'), motionMd, 'utf8');

  // 7. dna.json
  const dnaJson = {
    "$schema": "https://audira.io/schemas/visual-dna.v1.json",
    "styleId": s.id,
    "styleNumber": s.styleNumber,
    "name": s.name,
    "kit": s.kit,
    "category": s.category,
    "palette": s.palette,
    "geometry": s.geometry,
    "materials": s.materials,
    "lighting": s.lighting,
    "camera": s.camera,
    "motion": s.motion
  };
  fs.writeFileSync(path.join(dir, 'dna.json'), JSON.stringify(dnaJson, null, 2), 'utf8');

  console.log(`[SUCCESS] Generated 6-part DNA for: ${s.id} (Style #${s.styleNumber})`);
}

adoptedStyles.forEach(generateMarkdownSuite);
console.log(`Scaffolding complete for ${adoptedStyles.length} adopted styles!`);
