# CORE MODULE: AI Motion Generator (Step 04)
# AUDIRA MOTION INTELLIGENCE ENGINE

The **AI Motion Generator** converts the structured Visual DNA and directorial storyboard into tailored production prompts and code pipelines for targeted AI video generators and 3D rendering engines.

---

## 1. Multi-Target Compiler Matrix

The engine formats prompts according to the specific syntactic strengths of each AI model:

### 1.1 Remotion + React Three Fiber (Deterministic 3D Code Engine)
- **Output:** Executable React/Three.js code components, spring physics curves, and GLSL shaders.
- **Strength:** 100% deterministic, zero hallucination, exact typography, frame-accurate VO sync, reproducible 1080×1920 60 FPS renders.

### 1.2 Kling AI (1.5 / Professional Mode)
- **Prompt Structure:**
  ```text
  [Style Master Anchor], [Subject & Action], [Environment & Staging], [Lighting & Atmosphere], [Camera Rig & Movement], --ar 9:16 --neg [Negative Prompts]
  ```
- **Example:**
  `High quality 3D stylized toy diorama animation of a cute blocky character wearing denim overalls waving hand on a miniature theatrical wooden stage. Warm 3200K footlights glow, soft matte plastic and tactile clay textures, dark background with subtle rim lighting. Static macro camera, eye-level perspective, no zoom, no pan. Smooth toy movement, physical weight. --ar 9:16 --neg photorealistic human, flat 2d cartoon, glossy reflections, camera shake, morphing limbs`

### 1.3 Runway Gen-3 Alpha
- **Prompt Structure:**
  ```text
  Hyper-detailed cinematic [Style], [Subject Action], [Camera Specification], [Lighting Archetype], [Texture Quality].
  ```
- **Camera Direction Syntax:** `Static eye-level macro shot, fixed tripod, no pan, no tilt, locked framing`.

### 1.4 Midjourney v6 / Niji 6 (Keyframe & LookDev Still Generation)
- **Parameter Flags:** `--ar 9:16 --style raw --v 6.1 --stylize 120 --c 0`
- **Output:** Master visual anchor image used as the initial image prompt for Image-to-Video generation.

---

## 2. Dynamic Prompt Assembly Algorithm

```python
def compile_motion_prompt(style_dna, action_beat, target_engine="generic"):
    prompt_tokens = [
        style_dna["name"],
        f"Subject: {action_beat['character']} performing {action_beat['gesture']}",
        f"Environment: {style_dna['geometry']['silhouette']} in {action_beat['staging']}",
        f"Materials: {style_dna['materials']['type']}, roughness {style_dna['materials']['roughness']}",
        f"Lighting: {style_dna['lighting']['archetype']}, key {style_dna['lighting']['keyLight']['kelvin']}K",
        f"Camera: {style_dna['camera']['type']}, {style_dna['camera']['motionConstraint']}",
        f"Animation: {style_dna['motion']['physicsModel']}, {style_dna['motion']['characterCadence']}",
        "8k render, octane render, pbr textures, masterpiece"
    ]
    return ", ".join(prompt_tokens)
```

---

## 3. Negative Prompt Firewall (Universal Anti-Slop Injection)

Every compiled generative prompt must append the mandatory Negative Prompt Firewall:

```text
AVOID / NEGATIVE PROMPT:
photorealistic human skin pores, uncanny valley facial distortion, 2d vector flat art, cheap low-res artifacts, erratic shaky cam, random camera jump cuts, changing character clothing colors between frames, extra fingers, floating unattached limbs, excessive mirror chrome glare, blurry typography, text gibberish, glitch tearing.
```

