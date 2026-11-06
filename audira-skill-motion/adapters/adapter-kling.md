# ADAPTER: Kling AI (1.5 / Professional Mode)
# AUDIRA MULTI-MODEL PROMPT COMPILERS

This adapter converts any Audira Modular Style DNA into optimized prompt syntax for **Kling AI 1.5** (Standard & Professional Modes).

---

## 1. Kling AI Syntactic Profile

- **Maximum Effective Prompt Length:** 120–180 words.
- **Aspect Ratio Command:** `--ar 9:16` (Vertical format).
- **Movement Responsiveness:** Kling excels with physical object interactions, cloth physics, fluid dynamics, and controlled character gestures.
- **Motion Scale:** Kling responds to camera velocity descriptors (`slow steady dolly in`, `locked static tripod shot`).

---

## 2. Compilation Formula

```text
[Master Style Trigger], [Character/Subject Action], [Environment & Staging], [PBR Material & Textures], [Lighting & Color Temperature], [Camera Rig & Movement Constraints], [Visual Quality Tokens], --ar 9:16 --neg [Negative Firewall]
```

---

## 3. Style Examples

### Example A: `3d-toy-diorama`
```text
High-end commercial 3D stylized toy diorama animation. A cute blocky character wearing denim overalls raises its right hand and waves cheerfully on a miniature walnut wooden theatrical stage. Miniature glowing amber 2700K footlights along stage apron, soft matte plastic and tactile clay textures, dark background with subtle 5600K rim lighting. Camera is locked on a static eye-level macro tripod, zero camera shake, no zoom, no pan. Smooth toy movement with physical spring settle, Octane render 3D, 8k resolution, masterpiece. --ar 9:16 --neg photorealistic human, real human skin, uncanny valley, flat 2d cartoon, reflective glossy chrome, erratic camera movement, morphing limbs, distorted hands
```

### Example B: `film-noir`
```text
Classic 1940s film noir detective scene in rich monochrome chiaroscuro. A solitary detective in a wide-brim fedora and trench coat turns his head slowly in a damp dark brick alley under a vintage flickering streetlamp. Harsh venetian blinds shadow pattern projected across the brick wall, glistening wet asphalt road with crisp puddle reflections, atmospheric street fog. Slow low-angle forward tracking shot, cinematic anamorphic lens, 35mm film grain texture, high contrast. --ar 9:16 --neg oversaturated colors, rainbow neon, cheerful daylight, cartoon faces, modern cars, low contrast grey, washed out lighting
```

