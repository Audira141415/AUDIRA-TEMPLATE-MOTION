# CORE MODULE: Camera Director
# AUDIRA MOTION INTELLIGENCE ENGINE

The **Camera Director** defines the optical physics, framing discipline, lens selection, and movement choreography for 9:16 vertical storytelling.

---

## 1. Camera Archetypes & Lens Selection

| Camera Archetype | Focal Length | FOV (Vertical) | Depth of Field (f-stop) | Primary Use Cases | Movement Grammar |
| --- | --- | --- | --- | --- | --- |
| **Theatrical Macro** | 50mm – 85mm | 28° – 35° | f/2.0 – f/2.8 (shallow, soft bokeh) | Toy Diorama, Claymation, Brickcraft, Glasscraft | **Strictly Static**; zero tilt/pan/zoom to preserve diorama scale |
| **Cinematic Noir / Anamorphic** | 40mm – 50mm | 35° – 42° | f/1.8 – f/2.4 (cinematic falloff) | Film Noir, Documentary, Cinematic Realism | Slow moody track-in, subtle handheld breathing drift |
| **Architectural Orthographic** | 90mm – 120mm | Ortho / 15° | Infinite / f/11 (sharp planes) | CAD Draftforge, Urban Massing, Blueprint | Precision isometric pan, mechanical 45° rotation |
| **Action Telephoto / Mecha** | 70mm – 105mm | 24° – 30° | f/4.0 (focused subject) | Anime Toonforge, Action Mecha | Rapid snap-zoom, whip cuts, high-velocity parallax |
| **Sci-Fi Wide-Angle** | 20mm – 28mm | 65° – 80° | f/5.6 (deep telemetry visibility) | Cyberpunk HUD, Hologram Core, Devforge IDE | Gentle floating yaw orbit, smooth forward push-through |

---

## 2. 9:16 Vertical Safe Zone Rules (1080×1920)

Vertical mobile video platforms (TikTok, Reels, Shorts) place UI overlays on the video surface. Every shot must strictly enforce safety boundaries:

```
┌───────────────────────────────┐
│     TOP DANGER ZONE (160px)   │  <- Platform Header, Search, Sound Name
├───────────────────────────────┤
│                               │
│                               │
│        SAFE ACTION AREA       │
│                               │
│    All characters, titles,    │
│    key props & annotations    │
│    MUST live within this box  │  Width: 920px (80px margin left/right)
│                               │  Height: 1480px (160px top, 280px bottom)
│                               │
├───────────────────────────────┤
│   RIGHT DANGER ZONE (140px)   │  <- Like, Comment, Share, Avatar Icons
├───────────────────────────────┤
│    BOTTOM DANGER ZONE (280px) │  <- Caption text, Account name, Audio bar
└───────────────────────────────┘
```

1. **Top Buffer:** Keep 160px clear of primary typography or character head tops.
2. **Bottom Buffer:** Keep 280px clear of subtitles, call-to-actions, or focal props.
3. **Right Rail Buffer:** Avoid placing small essential buttons or icons in the right 140px.

---

## 3. Camera Rig Constraints & Safety Guardrails

- **No Unmotivated Jitter:** Disallow cheap camera wobble or random Perlin noise unless explicitly simulating a handheld documentary rig.
- **Continuous Focus Tracking:** The focal plane must stick firmly to the subject's primary focal anchor (e.g. character eyes or hero product logo).
- **Parallax Layering:** Staging must ensure at least 3 distinct depth planes:
  1. *Foreground:* Soft blurred framing prop (e.g. vintage footlight edge or venetian blind slit).
  2. *Middle ground:* Pin-sharp hero subject.
  3. *Background:* Atmospheric depth, soft bokeh backdrop, or textured diorama cyclorama wall.

