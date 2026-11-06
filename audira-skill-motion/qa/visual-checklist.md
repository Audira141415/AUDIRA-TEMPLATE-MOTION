# QA GATE: Visual Checklist
# AUDIRA QUALITY ASSURANCE PROTOCOL

Before approving any preview or final render, run through this rigorous visual checklist.

---

## 1. Composition & Framing Audit
- [ ] **Safe Zone Clearances (1080×1920):**
  - [ ] Top 160px is free of titles, character eyes, or vital graphic elements.
  - [ ] Bottom 280px is free of captions, CTA buttons, or fine-print details.
  - [ ] Left & Right 80px side margins have breathing room.
  - [ ] Right rail 140px has no interactive buttons obscured by TikTok/Reels icons.
- [ ] **Visual Hierarchy:**
  - [ ] There is one unambiguous focal point per frame.
  - [ ] Background clutter does not compete with hero subject.
  - [ ] Text contrast meets WCAG AA (contrast ratio >= 4.5:1 against backdrop).

---

## 2. Character & Asset Audit
- [ ] **Silhouette Clarity:** Subject is instantly recognizable in silhouette form.
- [ ] **Mesh Integrity:** No clipping, inverted normals, or self-intersecting geometry.
- [ ] **Material Fidelity:** PBR roughness, specular, and bump mapping match the style DNA.
- [ ] **Scale & Proportion:** Character scale matches props believably.

---

## 3. Lighting & Depth Audit
- [ ] **Three-Point Separation:** Subject has a distinct rim/kicker light separating it from the background.
- [ ] **Ground Contact Shadows:** Subject firmly touches the floor via soft ambient occlusion (no unintentional floating).
- [ ] **Color Temperature Balance:** Warm key and cool rim lights harmonize without ugly muddy color clashes.

---

## 4. Typography & Overlay Audit
- [ ] **Spelling & Grammar:** Title, kicker, annotations, and social handle are error-free.
- [ ] **Font Hierarchy:** Bold editorial headline > clear sub-headline > taped label annotation.
- [ ] **No Text Truncation:** Long sentences do not wrap awkwardly or clip beyond screen edges.

---

## 5. Semantic Comprehension & Editorial Gate (The Mute Test)
*Crucial gate for journalistic, narrative, and explainer content to avoid abstract nonsense:*
- [ ] **The Mute Test (Uji Pemahaman Tanpa Suara):**
  - [ ] Can a viewer identify **WHO** is speaking or being discussed on mute? (Face, named silhouette, title badge).
  - [ ] Can a viewer understand **WHAT** is being argued or demonstrated on mute? (Legible quote snippet, real evidence screenshot, labeled diagram).
  - [ ] Can a viewer identify **WHEN / WHERE** it takes place? (Timeline stamp, labeled court/location plan).
- [ ] **Anti-Metaphor Law:**
  - [ ] No absurd object metaphors for human conflict (e.g. do NOT turn a graduation date into a gear, an election list into a pole, or a handshake into floating gloves).
  - [ ] Real people in journalistic topics must be represented by real photos (via `media-use`), named cutouts, or explicitly labeled figures.
- [ ] **Zero Empty Containers:**
  - [ ] No empty speech bubbles.
  - [ ] No blank floating sheets of paper or empty cards. Every card must contain real readable data.
- [ ] **Topic-to-Engine Compatibility:**
  - [ ] Courtroom, political, legal debate, or investigative news topics MUST use `audira-video-motion-graphic` + `media-use` + `hyperframes` as primary engine.
  - [ ] `audira-motion` 3D is strictly reserved for technical forensic mechanisms (e.g. Error Level Analysis, microchip forensic cutaway).

