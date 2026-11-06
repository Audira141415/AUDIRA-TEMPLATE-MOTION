const fs = require('fs');
const path = require('path');

const STYLES_DIR = path.join(__dirname, '..', 'styles');

const finalBatch = [
  {
    id: 'buildforge-construction',
    name: 'Architectural Construction Assembled Piece-by-Piece',
    kit: 'buildforge',
    category: 'Architecture / Step-by-Step Assembly',
    palette: { background: '#10141D', primary: '#FF9900', secondary: '#232F3E', accent: '#00A8E8', neutral: '#879596', text: '#FFFFFF' },
    geometry: { type: 'structural_steel_concrete_slabs', bevelRadius: 0.02, polyBudget: 'mid_modular_assembly', silhouette: 'clean_bim_structural' },
    materials: { type: 'structural_concrete_matte_steel', roughness: 0.70, metalness: 0.40, normalMap: 'formwork_concrete' },
    lighting: { archetype: 'construction_site_sun_overcast', keyLight: { kelvin: 5600, intensity: 1.6, angle: [45, 55, 10] }, fillLight: { kelvin: 6500, intensity: 0.5 }, rimLight: { kelvin: 5200, intensity: 0.8 } },
    camera: { type: 'architectural_rising_crane', focalLengthMm: 45, fovDeg: 38, depthOfField: { enabled: false }, motionConstraint: 'elevation_rise_orbit' },
    motion: { fps: 60, physicsModel: 'crane_drop_hydraulic_damp', characterCadence: 'sequential_layer_assembly' }
  },
  {
    id: 'chalk-blackboard',
    name: 'Quantum Blackboard & Dusty 3D Chalk Equations',
    kit: 'chalkcraft',
    category: 'Theoretical Physics / Education Chalk',
    palette: { background: '#1B2421', primary: '#FFFFFF', secondary: '#F4D06F', accent: '#39A9DB', neutral: '#839088', text: '#FFFFFF' },
    geometry: { type: 'dusty_chalk_splines', bevelRadius: 0.01, polyBudget: 'particle_splines', silhouette: 'hand_drawn_tensor_equations' },
    materials: { type: 'slate_blackboard_chalk_dust', roughness: 0.98, metalness: 0.00, normalMap: 'slate_rock_microtexture' },
    lighting: { archetype: 'lecture_hall_spotlight', keyLight: { kelvin: 4200, intensity: 1.4, angle: [25, 45, 0] }, fillLight: { kelvin: 5000, intensity: 0.4 }, rimLight: { kelvin: 4000, intensity: 0.5 } },
    camera: { type: 'chalk_macro_track', focalLengthMm: 60, fovDeg: 32, depthOfField: { enabled: true, fStop: 2.2 }, motionConstraint: 'stroke_tracing_glide' },
    motion: { fps: 60, physicsModel: 'handwriting_velocity_ease', characterCadence: 'chalk_dust_settle' }
  },
  {
    id: 'thermal-infrared',
    name: 'FLIR Infrared Thermal Heatmap & Hotspot Telemetry',
    kit: 'thermalforge',
    category: 'Thermal Imaging / Sensor Telemetry',
    palette: { background: '#02000A', primary: '#FF2A00', secondary: '#8A00FF', accent: '#FFF000', neutral: '#002B7F', text: '#FFFFFF' },
    geometry: { type: 'thermal_gradient_mesh', bevelRadius: 0.02, polyBudget: 'mid_poly_scanner', silhouette: 'heat_signature_silhouette' },
    materials: { type: 'ironbow_false_color_gradient', roughness: 0.50, metalness: 0.00, normalMap: 'flir_sensor_noise' },
    lighting: { archetype: 'zero_light_thermal_emission', keyLight: { kelvin: 6500, intensity: 1.0, angle: [0, 0, 0] }, fillLight: { kelvin: 6500, intensity: 0.0 }, rimLight: { kelvin: 6500, intensity: 0.0 } },
    camera: { type: 'flir_recon_optical', focalLengthMm: 50, fovDeg: 35, depthOfField: { enabled: false }, motionConstraint: 'target_lock_tracking' },
    motion: { fps: 60, physicsModel: 'heat_dissipation_flow', characterCadence: 'sensor_crosshair_pulse' }
  },
  {
    id: 'timeforge-evolution',
    name: 'Physical Object Historical Evolution Through Eras',
    kit: 'timeforge',
    category: 'Historical Evolution / Morphing Artifact',
    palette: { background: '#121214', primary: '#C5A059', secondary: '#2C2D35', accent: '#E0E2EC', neutral: '#606270', text: '#FFFFFF' },
    geometry: { type: 'morphing_historical_topology', bevelRadius: 0.03, polyBudget: 'matched_vertex_morph', silhouette: 'era_specific_silhouette' },
    materials: { type: 'era_reactive_pbr', roughness: 0.50, metalness: 0.30, normalMap: 'patina_aging_scratches' },
    lighting: { archetype: 'museum_exhibit_key', keyLight: { kelvin: 3200, intensity: 1.7, angle: [35, 45, 10] }, fillLight: { kelvin: 4800, intensity: 0.4 }, rimLight: { kelvin: 5200, intensity: 1.2 } },
    camera: { type: 'exhibit_turntable_360', focalLengthMm: 55, fovDeg: 32, depthOfField: { enabled: true, fStop: 2.8 }, motionConstraint: 'continuous_temporal_orbit' },
    motion: { fps: 60, physicsModel: 'chronological_morph_spring', characterCadence: 'dated_milestone_ticks' }
  },
  {
    id: 'urban-massing',
    name: 'Architectural White Model City & Sun Shadow Studies',
    kit: 'urbanforge',
    category: 'Urban Planning / White Massing',
    palette: { background: '#0D0E11', primary: '#FFFFFF', secondary: '#E2E5EA', accent: '#00D2FF', neutral: '#2D323F', text: '#FFFFFF' },
    geometry: { type: 'foam_board_white_massing', bevelRadius: 0.005, polyBudget: 'clean_orthogonal_city', silhouette: 'monochrome_skyline_blocks' },
    materials: { type: 'matte_architectural_plaster', roughness: 0.92, metalness: 0.00, normalMap: 'plaster_styrofoam_grain' },
    lighting: { archetype: 'heliodon_solar_arc', keyLight: { kelvin: 4800, intensity: 2.0, angle: [30, 45, 0] }, fillLight: { kelvin: 6500, intensity: 0.4 }, rimLight: { kelvin: 5500, intensity: 0.6 } },
    camera: { type: 'heli_isometric_flyover', focalLengthMm: 65, fovDeg: 30, depthOfField: { enabled: false }, motionConstraint: 'sweeping_skyline_dolly' },
    motion: { fps: 60, physicsModel: 'sun_shadow_sweep_timeline', characterCadence: 'timelapse_shadow_travel' }
  },
  {
    id: 'vintage-manuscript',
    name: 'Da Vinci Antique Manuscript & Copperplate Engraving',
    kit: 'vintageforge',
    category: 'Renaissance Manuscript / Parchment',
    palette: { background: '#2E2215', primary: '#3B2716', secondary: '#C8A97E', accent: '#7A1C16', neutral: '#D8C2A0', text: '#2A180E' },
    geometry: { type: 'florentine_parchment_scroll', bevelRadius: 0.01, polyBudget: 'mid_deckled_scroll', silhouette: 'sepia_renaissance_lines' },
    materials: { type: 'aged_vellum_parchment', roughness: 0.95, metalness: 0.00, normalMap: 'leather_parchment_crinkle' },
    lighting: { archetype: 'candle_flicker_warm', keyLight: { kelvin: 2400, intensity: 1.3, angle: [30, 40, 10] }, fillLight: { kelvin: 2800, intensity: 0.4 }, rimLight: { kelvin: 2200, intensity: 0.7 } },
    camera: { type: 'manuscript_macro_pan', focalLengthMm: 70, fovDeg: 28, depthOfField: { enabled: true, fStop: 2.4 }, motionConstraint: 'copperplate_hatching_reveal' },
    motion: { fps: 60, physicsModel: 'ink_quill_drawing_flow', characterCadence: 'renaissance_invention' }
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

**Style ID:** \`${s.id}\`  
**Internal Engine Kit:** \`kits/${s.kit}/\`  
**Classification:** ${s.category}  
**Target Engines:** Remotion + React Three Fiber, Kling AI, Midjourney v6, Runway Gen-3

---

## 1. Aesthetic Essence & Visual Identity
- **Visual Core:** Definitive implementation of ${s.name}. Integrates ${s.geometry.silhouette} architecture with ${s.materials.type} material fidelity and studio lighting via ${s.lighting.archetype}.
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

  console.log(`[SUCCESS] Generated 6-part DNA for: ${s.id}`);
}

finalBatch.forEach(generateMarkdownSuite);
console.log(`Scaffolding complete for ${finalBatch.length} final styles!`);

