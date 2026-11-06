# WORKFLOW: Reference-to-Video
# AUDIRA MOTION WORKFLOWS

This workflow reproduces the aesthetic, pacing, lighting, and composition of an existing visual reference (Instagram Reel, TikTok video, 3D commercial still, or movie scene) into an original Audira-branded 3D animation.

---

## 1. Input Requirements
- User provides a reference URL (e.g. Instagram, TikTok, YouTube) or uploads an image/video file.
- User clarifies brand or custom messaging to inject (e.g. "Ganti karakter jadi maskot Audira", "Pakai teks tentang peluncuran fitur baru").

---

## 2. Step-by-Step Execution Pipeline

### Step 1: Reference Ingestion & Extraction (`core/reference-analyzer.md`)
1. Download reference or capture 3 keyframe stills:
   - Frame 0 (Hook / Staging)
   - Mid-Frame (Core Action / Gesture)
   - Final Frame (Resolution / CTA)
2. Extract the 6 visual dimensions:
   - Color palette hex codes (5 tokens)
   - Geometry silhouette & bevel radius
   - Surface PBR roughness & material archetype
   - Lighting rig (Kelvin, angle, shadow ratio)
   - Camera lens FOV & movement discipline
   - Motion cadence & spring physics

### Step 2: Visual DNA Synthesis (`core/visual-dna-extractor.md`)
- Match with existing style from `styles/` (e.g. `styles/3d-toy-diorama/`).
- If custom, serialize a new `dna.json` manifest locking all parameters.

### Step 3: Directorial Translation (`core/motion-director.md`)
- Replace the original content with the user's brief while preserving the motion grammar.
- Map the beat breakdown to 15s (900 frames @ 60 FPS).
- Set character gestures (anticipation, squash & stretch, secondary settle).

### Step 4: Production Generation (`core/ai-motion-generator.md`)
- **Remotion Route:** Instantiate the appropriate kit composition (e.g. `kits/toydiorama/src/Composition.tsx`), inject brand tokens, set props.
- **Generative AI Route:** Compile structured prompt with locked DNA tokens, camera constraints, and negative firewall.

### Step 5: Visual QA & Final Polish (`core/visual-qa.md`)
- Check stills against `references/quality-bar/`.
- Validate 9:16 safe-zone clearance (160px top, 280px bottom).
- Render final 1080×1920 @ 60 FPS MP4.

