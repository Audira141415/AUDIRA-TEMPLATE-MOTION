# ADAPTER: Midjourney v6.1 & Niji 6 (Look-Dev Master Stills)
# AUDIRA MULTI-MODEL PROMPT COMPILERS

This adapter generates master look-development keyframe stills used as visual anchors or Image-to-Video seeds.

---

## 1. Midjourney Flag Parameters

- **Aspect Ratio:** `--ar 9:16` (Mandatory vertical mobile).
- **Style Flag:** `--style raw` (Prevents generic AI Midjourney aesthetics; enforces exact prompt tokens).
- **Stylize:** `--stylize 100` to `--stylize 180` (Balanced fidelity).
- **Chaos:** `--c 0` (Zero randomness for reproducible branding).
- **Model Version:** `--v 6.1` (or `--niji 6` for anime/chibi).

---

## 2. Compilation Template

```text
/imagine prompt: [Subject Description], [Style Taxonomy Trigger], [Environment & Props], [Material PBR Tokens: roughness, albedo, SSS], [Lighting Temperature & Rig: 3200K key, rim separator, AO], [Camera Lens & Framing: 50mm macro, f/2.8], Octane Render, 3D render, Clean composition, Commercial cinematography --ar 9:16 --style raw --v 6.1 --stylize 120 --c 0
```

---

## 3. Style Examples

### Example A: `3d-toy-diorama`
```text
/imagine prompt: Commercial stylized 3D toy diorama, a charming blocky wooden toy character with rounded beveled edges standing on a miniature walnut stage platform, warm glowing amber footlights along the floor edge, soft matte plastic and tactile clay material, small paper label with washi tape annotation, dark atmospheric studio background, soft 3-point theatrical lighting with 3200K warm key light and 5600K cool rim light, static eye-level macro camera framing, Octane 3D render, clean composition, award-winning editorial design --ar 9:16 --style raw --v 6.1 --stylize 120 --c 0
```

### Example B: `watercolor-storybook`
```text
/imagine prompt: European children's picture book illustration, 3D layered cold-press watercolor paper diorama, rough 300gsm deckled edges, translucent watercolor washes with visible pigment edge pooling and natural granulation, soft hand-drawn graphite pencil outlines, a whimsical little bear character in a blue wool vest holding a glowing dandelion, rolling pastel meadow hills, soft morning sunlight, 35mm shallow focus --ar 9:16 --style raw --v 6.1 --stylize 140 --c 0
```

