const fs = require('fs');
const path = require('path');

const STYLES_DIR = path.join(__dirname, '..', 'styles');

const remainingStyles = [
  {
    id: 'paper-cutout',
    name: 'Handcrafted Paper Diorama & Tiered Kirigami Stories',
    kit: 'paperworld',
    category: 'Physical Craft / Paper Art',
    palette: { background: '#F4EAD4', primary: '#E76F51', secondary: '#2A9D8F', accent: '#E9C46A', neutral: '#264653', text: '#264653' },
    geometry: { type: 'creased_origami_sheets', bevelRadius: 0.01, polyBudget: 'mid_folded_planes', silhouette: 'layered_cutout_shadows' },
    materials: { type: 'matte_textured_cardstock', roughness: 0.95, metalness: 0.00, normalMap: 'paper_fiber_texture' },
    lighting: { archetype: 'diorama_shadowbox_sun', keyLight: { kelvin: 4000, intensity: 1.5, angle: [35, 45, 10] }, fillLight: { kelvin: 5000, intensity: 0.5 }, rimLight: { kelvin: 4500, intensity: 0.8 } },
    camera: { type: 'topdown_tilt_shift', focalLengthMm: 65, fovDeg: 30, depthOfField: { enabled: true, fStop: 2.8 }, motionConstraint: 'page_peel_reveal' },
    motion: { fps: 60, physicsModel: 'paper_fold_curl', characterCadence: 'delicate_kirigami' }
  },
  {
    id: 'chibi-3d',
    name: 'Chibi 3D Plastic Bricks & Tabletop Macro Stop-Motion',
    kit: 'brickcraft',
    category: 'Toy Assembly / Macro Stop-Motion',
    palette: { background: '#1A1D24', primary: '#D90429', secondary: '#EF233C', accent: '#FFD166', neutral: '#EDF2F4', text: '#FFFFFF' },
    geometry: { type: 'interlocking_stud_bricks', bevelRadius: 0.03, polyBudget: 'modular_primitives', silhouette: 'blocky_stud_minifig' },
    materials: { type: 'glossy_abs_plastic', roughness: 0.20, metalness: 0.00, clearcoat: 0.60, normalMap: 'molded_abs_seam' },
    lighting: { archetype: 'desk_lamp_macro_rig', keyLight: { kelvin: 3200, intensity: 1.6, angle: [45, 45, 0] }, fillLight: { kelvin: 4500, intensity: 0.4 }, rimLight: { kelvin: 5500, intensity: 1.0 } },
    camera: { type: 'macro_tabletop_probe', focalLengthMm: 85, fovDeg: 24, depthOfField: { enabled: true, fStop: 2.0 }, motionConstraint: 'stepped_stop_motion' },
    motion: { fps: 24, physicsModel: 'snap_fit_click', characterCadence: 'click_stud_assembly' }
  },
  {
    id: 'low-poly-3d',
    name: 'Faceted Low-Poly Minimalist Worlds & Pastel Sanctuary',
    kit: 'polyverse',
    category: 'Minimalist Geometric / Floating Island',
    palette: { background: '#D8E2DC', primary: '#FFE5D9', secondary: '#FFCAD4', accent: '#F4ACB7', neutral: '#9D8189', text: '#3E343A' },
    geometry: { type: 'flat_shaded_polygons', bevelRadius: 0.00, polyBudget: 'strictly_low_poly', silhouette: 'faceted_gemstone_nature' },
    materials: { type: 'untextured_flat_diffuse', roughness: 0.85, metalness: 0.00, clearcoat: 0.00, normalMap: 'faceted_face_normals' },
    lighting: { archetype: 'pastel_dawn_sky', keyLight: { kelvin: 3600, intensity: 1.3, angle: [30, 60, 0] }, fillLight: { kelvin: 6500, intensity: 0.6 }, rimLight: { kelvin: 4200, intensity: 0.9 } },
    camera: { type: 'isometric_zen_orbit', focalLengthMm: 75, fovDeg: 28, depthOfField: { enabled: false }, motionConstraint: 'slow_zen_rotation' },
    motion: { fps: 60, physicsModel: 'gentle_breeze_sine', characterCadence: 'tranquil_minimalist' }
  },
  {
    id: 'pixel-art',
    name: '2.5D Retro Pixel Art & 16-Bit Nostalgia Platformer',
    kit: 'pixelstory',
    category: 'Pixel Art / Retro 16-Bit',
    palette: { background: '#181425', primary: '#FF0055', secondary: '#265C42', accent: '#FEE761', neutral: '#639BFF', text: '#FFFFFF' },
    geometry: { type: 'pixel_billboard_voxels', bevelRadius: 0.00, polyBudget: 'sprite_quads', silhouette: 'stepped_pixel_grid' },
    materials: { type: 'nearest_neighbor_diffuse', roughness: 1.00, metalness: 0.00, clearcoat: 0.00, normalMap: 'none' },
    lighting: { archetype: 'ambient_chiptune_glow', keyLight: { kelvin: 5000, intensity: 1.0, angle: [0, 0, 0] }, fillLight: { kelvin: 5000, intensity: 0.5 }, rimLight: { kelvin: 5000, intensity: 0.0 } },
    camera: { type: 'side_scroller_ortho', focalLengthMm: 50, fovDeg: 30, depthOfField: { enabled: false }, motionConstraint: 'pixel_grid_scroll' },
    motion: { fps: 60, physicsModel: 'stepped_sprite_frames', characterCadence: '8frame_run_cycle' }
  },
  {
    id: 'precision-cgi',
    name: 'Industrial Luxury CGI & Exploded Mechanism',
    kit: 'precision',
    category: 'Commercial Product Luxury CGI',
    palette: { background: '#0B0C0E', primary: '#D4AF37', secondary: '#1B1D22', accent: '#E5E9F0', neutral: '#4C566A', text: '#ECEFF4' },
    geometry: { type: 'nurbs_cad_assembly', bevelRadius: 0.015, polyBudget: 'ultra_precision', silhouette: 'streamlined_ergonomic' },
    materials: { type: 'anodized_machined_metal', roughness: 0.18, metalness: 0.92, clearcoat: 0.30, normalMap: 'brushed_radial_aluminum' },
    lighting: { archetype: 'apple_commercial_softbox', keyLight: { kelvin: 5400, intensity: 1.8, angle: [45, 60, 20] }, fillLight: { kelvin: 5400, intensity: 0.5 }, rimLight: { kelvin: 6000, intensity: 1.8 } },
    camera: { type: 'macro_turntable_glide', focalLengthMm: 90, fovDeg: 22, depthOfField: { enabled: true, fStop: 2.0 }, motionConstraint: 'precision_exploded_glide' },
    motion: { fps: 60, physicsModel: 'damped_subassembly_explosion', characterCadence: 'hyper_calibrated' }
  },
  {
    id: 'glassmorphism',
    name: 'VisionOS Spatial Glassmorphism & Liquid Prisms',
    kit: 'glasscraft',
    category: 'Spatial UI / Iridescent Glass',
    palette: { background: '#030509', primary: '#7000FF', secondary: '#00F0FF', accent: '#FF007A', neutral: '#FFFFFF', text: '#FFFFFF' },
    geometry: { type: 'rounded_dielectric_slabs', bevelRadius: 0.06, polyBudget: 'mid_refractive', silhouette: 'floating_glass_cards' },
    materials: { type: 'frosted_refractive_glass', roughness: 0.15, metalness: 0.00, transmission: 0.94, clearcoat: 1.00, normalMap: 'liquid_dispersion_caustic' },
    lighting: { archetype: 'iridescent_chromatic_glow', keyLight: { kelvin: 6500, intensity: 2.0, angle: [30, 45, 0] }, fillLight: { kelvin: 8500, intensity: 0.6 }, rimLight: { kelvin: 10000, intensity: 2.4 } },
    camera: { type: 'spatial_hover_cam', focalLengthMm: 35, fovDeg: 45, depthOfField: { enabled: true, fStop: 2.4 }, motionConstraint: 'fluid_parallax_float' },
    motion: { fps: 60, physicsModel: 'viscous_fluid_damping', characterCadence: 'prismatic_shimmer' }
  },
  {
    id: 'molecular-nanotech',
    name: 'Microscopic Molecular Biology & Cryo-EM DNA Core',
    kit: 'nanoforge',
    category: 'Scientific / Nanotechnology',
    palette: { background: '#020B14', primary: '#00FFA3', secondary: '#0077B6', accent: '#FF0055', neutral: '#90E0EF', text: '#FFFFFF' },
    geometry: { type: 'procedural_dna_double_helix', bevelRadius: 0.02, polyBudget: 'molecular_vesicles', silhouette: 'cellular_capsid_spheres' },
    materials: { type: 'fluorescent_protein_sss', roughness: 0.40, metalness: 0.00, subsurfaceScatter: 0.35, normalMap: 'electron_density_cloud' },
    lighting: { archetype: 'cryo_em_fluorescence', keyLight: { kelvin: 8000, intensity: 1.6, angle: [0, 0, 0] }, fillLight: { kelvin: 7000, intensity: 0.4 }, rimLight: { kelvin: 9500, intensity: 1.5 } },
    camera: { type: 'nanoscopic_probe', focalLengthMm: 120, fovDeg: 18, depthOfField: { enabled: true, fStop: 1.4 }, motionConstraint: 'brownian_depth_drift' },
    motion: { fps: 60, physicsModel: 'molecular_thermal_vibration', characterCadence: 'helical_rotation' }
  },
  {
    id: 'ink-wash-calligraphy',
    name: 'East Asian Ink Wash (Sumi-e) & Misty Mountains',
    kit: 'inkstory',
    category: 'Traditional Asian Calligraphy',
    palette: { background: '#F5F2EB', primary: '#1A1817', secondary: '#4A4644', accent: '#C8322B', neutral: '#8A847F', text: '#1A1817' },
    geometry: { type: 'fluid_brush_stroke_extrusions', bevelRadius: 0.02, polyBudget: 'spline_ribbons', silhouette: 'flowing_shan_shui' },
    materials: { type: 'porous_rice_paper_soak', roughness: 0.98, metalness: 0.00, normalMap: 'raw_xuan_paper' },
    lighting: { archetype: 'zen_mist_diffuse', keyLight: { kelvin: 4800, intensity: 1.1, angle: [20, 60, 0] }, fillLight: { kelvin: 5200, intensity: 0.8 }, rimLight: { kelvin: 4500, intensity: 0.3 } },
    camera: { type: 'horizontal_scroll_glide', focalLengthMm: 50, fovDeg: 35, depthOfField: { enabled: false }, motionConstraint: 'shan_shui_unfurl' },
    motion: { fps: 60, physicsModel: 'viscous_ink_capillary_flow', characterCadence: 'poetic_qi_flow' }
  },
  {
    id: 'lidar-pointcloud',
    name: '3D LiDAR Laser Aerial Survey & Bathymetry',
    kit: 'lidarforge',
    category: 'Geospatial / Point Cloud Telemetry',
    palette: { background: '#05070A', primary: '#00F0FF', secondary: '#FFD700', accent: '#FF0055', neutral: '#1F2937', text: '#E5E7EB' },
    geometry: { type: 'dense_point_cloud_particles', bevelRadius: 0.00, polyBudget: '100k_point_buffer', silhouette: 'topographic_scanned_mesh' },
    materials: { type: 'additive_elevation_color_ramp', roughness: 0.10, metalness: 0.00, normalMap: 'none' },
    lighting: { archetype: 'laser_curtain_sweep', keyLight: { kelvin: 9000, intensity: 2.0, angle: [90, 0, 0] }, fillLight: { kelvin: 8000, intensity: 0.2 }, rimLight: { kelvin: 10000, intensity: 1.2 } },
    camera: { type: 'drone_aerial_nadir', focalLengthMm: 28, fovDeg: 65, depthOfField: { enabled: false }, motionConstraint: 'laser_sweep_glide' },
    motion: { fps: 60, physicsModel: 'linear_scanner_curtain', characterCadence: 'topographic_unveil' }
  },
  {
    id: 'circuit-electronics',
    name: 'Macro 3D PCB Electronics & Electron Stream',
    kit: 'circuitforge',
    category: 'Hardware / Semiconductor',
    palette: { background: '#06130B', primary: '#00E676', secondary: '#B8860B', accent: '#FFAB00', neutral: '#0F2D1A', text: '#E8F5E9' },
    geometry: { type: 'fr4_pcb_smd_chips', bevelRadius: 0.01, polyBudget: 'dense_trace_geometry', silhouette: 'bga_silicon_die_tracks' },
    materials: { type: 'soldermask_green_copper', roughness: 0.35, metalness: 0.85, clearcoat: 0.40, normalMap: 'etched_copper_traces' },
    lighting: { archetype: 'smt_inspection_ring_light', keyLight: { kelvin: 5600, intensity: 1.6, angle: [0, 90, 0] }, fillLight: { kelvin: 6000, intensity: 0.5 }, rimLight: { kelvin: 7000, intensity: 1.4 } },
    camera: { type: 'silicon_die_macro_dive', focalLengthMm: 100, fovDeg: 20, depthOfField: { enabled: true, fStop: 2.2 }, motionConstraint: 'copper_trace_follow' },
    motion: { fps: 60, physicsModel: 'electron_pulse_speed', characterCadence: 'bus_clock_transfer' }
  },
  {
    id: 'retro-synthwave',
    name: '80s Synthwave Outrun & Neon Horizon Grid',
    kit: 'retrowave',
    category: 'Retro Sci-Fi / 80s Cyber',
    palette: { background: '#0D0221', primary: '#FF007F', secondary: '#540D6E', accent: '#00F0FF', neutral: '#FFD166', text: '#FFFFFF' },
    geometry: { type: 'wireframe_infinite_grid_sun', bevelRadius: 0.00, polyBudget: 'retro_grid_lines', silhouette: 'wireframe_grid_horizon' },
    materials: { type: 'neon_wireframe_emissive', roughness: 0.10, metalness: 0.00, clearcoat: 0.00, normalMap: 'crt_scanline_phosphor' },
    lighting: { archetype: 'sunset_horizon_neon', keyLight: { kelvin: 2200, intensity: 2.5, angle: [0, 5, 0] }, fillLight: { kelvin: 9000, intensity: 0.5 }, rimLight: { kelvin: 12000, intensity: 2.0 } },
    camera: { type: 'outrun_highway_dolly', focalLengthMm: 30, fovDeg: 60, depthOfField: { enabled: false }, motionConstraint: 'infinite_forward_drive' },
    motion: { fps: 60, physicsModel: 'grid_velocity_scroll', characterCadence: 'synthwave_tempo' }
  },
  {
    id: 'neo-brutalism',
    name: '3D Neo-Brutalism Pop & Electric Neon Shadows',
    kit: 'brutalforge',
    category: 'Modern Web / Neo-Brutalist',
    palette: { background: '#FFE600', primary: '#000000', secondary: '#FF0055', accent: '#00F0FF', neutral: '#FFFFFF', text: '#000000' },
    geometry: { type: 'chunky_offset_blocks', bevelRadius: 0.02, polyBudget: 'low_chunky', silhouette: 'unblurred_hard_shadow_slabs' },
    materials: { type: 'ultra_matte_paper_plastic', roughness: 0.90, metalness: 0.00, clearcoat: 0.00, normalMap: 'flat_clean' },
    lighting: { archetype: 'noon_hard_sun_direct', keyLight: { kelvin: 5500, intensity: 2.5, angle: [45, 45, 0] }, fillLight: { kelvin: 5500, intensity: 0.0 }, rimLight: { kelvin: 5500, intensity: 0.0 } },
    camera: { type: 'isometric_pop_drop', focalLengthMm: 50, fovDeg: 35, depthOfField: { enabled: false }, motionConstraint: 'kinetic_hard_snap' },
    motion: { fps: 60, physicsModel: 'rigid_punch_overshoot', characterCadence: 'high_conversion_punch' }
  },
  {
    id: 'kintsugi-gold',
    name: 'Wabi-Sabi Matte Porcelain & Glowing Liquid Gold',
    kit: 'kintsugi',
    category: 'Philosophical Japanese Craft',
    palette: { background: '#121316', primary: '#D4AF37', secondary: '#24272E', accent: '#FFFFFF', neutral: '#E5E7EB', text: '#F3F4F6' },
    geometry: { type: 'fractured_ceramic_vessel', bevelRadius: 0.03, polyBudget: 'high_shattered_edges', silhouette: 'organic_vein_cracks' },
    materials: { type: 'matte_clay_porcelain_with_gold', roughness: 0.85, metalness: 0.02, clearcoat: 0.00, normalMap: 'ceramic_fracture_seam' },
    lighting: { archetype: 'candlelit_wabi_sabi_zen', keyLight: { kelvin: 2800, intensity: 1.4, angle: [35, 45, 10] }, fillLight: { kelvin: 4000, intensity: 0.3 }, rimLight: { kelvin: 3200, intensity: 1.2 } },
    camera: { type: 'macro_crack_orbit', focalLengthMm: 70, fovDeg: 28, depthOfField: { enabled: true, fStop: 2.0 }, motionConstraint: 'slow_meditative_orbit' },
    motion: { fps: 60, physicsModel: 'liquid_gold_capillary_fill', characterCadence: 'reverent_peace' }
  },
  {
    id: 'kinetic-typography',
    name: 'Spatial Giant 3D Kinetic Monolith Typography',
    kit: 'textvoyage',
    category: 'Motion Graphics / Giant Type',
    palette: { background: '#000000', primary: '#FFFFFF', secondary: '#FF3300', accent: '#7000FF', neutral: '#1C1C1E', text: '#FFFFFF' },
    geometry: { type: 'extruded_monolith_glyphs', bevelRadius: 0.05, polyBudget: 'extruded_text', silhouette: 'towering_monolithic_words' },
    materials: { type: 'brushed_titanium_concrete', roughness: 0.40, metalness: 0.50, clearcoat: 0.10, normalMap: 'cast_concrete_texture' },
    lighting: { archetype: 'monolith_horizon_spot', keyLight: { kelvin: 5000, intensity: 2.2, angle: [15, 30, 0] }, fillLight: { kelvin: 5000, intensity: 0.2 }, rimLight: { kelvin: 6500, intensity: 2.0 } },
    camera: { type: 'flythrough_glyph_canyon', focalLengthMm: 20, fovDeg: 78, depthOfField: { enabled: true, fStop: 4.0 }, motionConstraint: 'canyon_flythrough' },
    motion: { fps: 60, physicsModel: 'heavy_monolith_tumble', characterCadence: 'percussive_slam' }
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

remainingStyles.forEach(generateMarkdownSuite);
console.log(`Scaffolding complete for ${remainingStyles.length} additional styles!`);
