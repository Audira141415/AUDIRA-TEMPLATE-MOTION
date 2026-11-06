# WORKFLOW: Text-to-Video
# AUDIRA MOTION WORKFLOWS

This workflow transforms a textual concept, creative brief, or commercial script into a fully animated 3D vertical video.

---

## 1. Input Requirements
- Topic or core narrative idea (e.g. "Evolusi ponsel lipat", "Peluncuran aplikasi AI").
- Target audience & emotional tone (e.g. playful, corporate premium, gritty cinematic).
- Audio choice: Voice-Over MP3 supplied OR Music/SFX only.

---

## 2. Step-by-Step Execution Pipeline

### Step 1: Guided Briefing & Style Resolution
- Prompt the user to confirm the single visual style from the 33 Audira Style Catalog.
- Infer the best match automatically (e.g. toy/miniature brief -> `styles/3d-toy-diorama/`).
- Confirm duration: Default 15 seconds (or audio length if VO provided).

### Step 2: 5-Beat Storyboard Scripting
Decompose text into 5 chronological visual beats:
1. `0.0s - 2.0s`: **Hook Beat** (High impact visual drop + hero headline)
2. `2.0s - 5.0s`: **Setup Beat** (Context explanation, secondary prop reveal)
3. `5.0s - 10.0s`: **Climax Beat** (Core value demonstration, interactive motion)
4. `10.0s - 13.0s`: **Resolution Beat** (Satisfying conclusion, character gesture)
5. `13.0s - 15.0s`: **CTA Beat** (Brand logo, handle, conversion punch)

### Step 3: DNA Injection & Scene Construction
- Load style DNA modules: `geometry.md`, `materials.md`, `lighting.md`, `camera.md`, `motion.md`.
- Ensure character seed and color palette tokens remain invariant across all 5 beats.

### Step 4: Preview Render & Look-Dev Check
- Render 540×960 @ 30 FPS preview or extract stills at beat keyframes.
- Inspect against visual QA standards.

### Step 5: Master Render & Social Export
- Render master 1080×1920 @ 60 FPS MP4.
- Generate multi-platform social captions (TikTok, IG Reels, Shorts, Facebook, X).

