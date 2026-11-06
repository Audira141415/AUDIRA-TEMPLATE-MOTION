# ADAPTER: Runway Gen-3 Alpha
# AUDIRA MULTI-MODEL PROMPT COMPILERS

This adapter formats Audira Modular Style DNA for **Runway Gen-3 Alpha**.

---

## 1. Runway Gen-3 Alpha Syntactic Profile

- **Format:** Strict Directorial Prose (Subject first, camera motion second, lighting/environment third).
- **Camera Directives:** Highly sensitive to explicit camera motion sentences at the start or end of the prompt (e.g. `The camera remains completely stationary on a tripod`, `The camera slowly tracks backwards while keeping the subject centered`).
- **Texture Realism:** Excels at handling volumetric light beams, atmospheric smoke, and PBR surface glossiness.

---

## 2. Compilation Template

```text
[Camera Directive]: [Subject & Physical Action Beat]. [Environment Details & Staging]. [Material Specifications & Surface Physics]. [Lighting Scheme & Atmosphere]. Photorealistic 3D rendering, cinematic composition, award-winning art direction.
```

---

## 3. Style Examples

### Example A: `3d-toy-diorama`
```text
The camera remains completely static on a fixed macro tripod with zero camera movement. A stylized blocky 3D toy character with rounded edges waves its arm warmly while standing on a miniature wooden theater stage. Below the character, seven small warm incandescent footlights cast a cozy upward glow. The background features layered cardboard cutout mountain flats in soft pastel colors against a dark void. The character has a matte plastic finish with gentle clay texture. Warm 3200K key light with a cool rim light defining the character silhouette. Commercial quality, high production value 3D animation.
```

### Example B: `devforge`
```text
The camera performs a slow cinematic orbit around a floating translucent dark glass code editor window. Bright electric cyan and green monospace code streams rapidly across the virtual screen. A stylized 3D golden coin pops out from the center of the code into the foreground with a bouncy overshoot motion. Dark cyber studio lighting with neon purple edge highlights and sharp reflections on the floating 3D assets.
```

