# CORE MODULE: Motion Director (Step 03)
# AUDIRA MOTION INTELLIGENCE ENGINE

The **Motion Director** governs temporal choreography, scene pacing, character performance, physics simulation, and multi-beat storytelling. It translates the creative script into precise frame-by-frame action beats.

---

## 1. The 12 Principles of Audira Motion

Adapted from classic animation principles for modern 3D code engines and AI generative pipelines:

1. **Squash and Stretch:** Volume must remain constant during impact and rebound. Maximum deformation: `15%` along the primary compression axis.
2. **Anticipation:** Every major movement must be preceded by a reverse micro-gesture (e.g. 4 frames of slight backward lean before a jump or arm wave).
3. **Staging:** One clear focal action per beat. Never have two high-contrast movements competing simultaneously in 9:16 vertical space.
4. **Straight Ahead vs Pose to Pose:** Primary narrative beats are blocked with key poses (0s, 3s, 6s), while secondary props use procedural spring physics.
5. **Follow Through and Overlapping Action:** When the character stops moving, hair, loose garments, badges, or antennae settle 6–10 frames later.
6. **Slow In and Slow Out (Easing):** Organic non-linear curves only. Never use linear easing (`easeLinear`) for character or camera motion.
7. **Arcs:** Natural gestures travel in elliptical trajectories rather than robotic straight vectors.
8. **Secondary Action:** Discrete character eye blinks every 3–4 seconds, breathing micro-pulses, and soft floor shadow reaction.
9. **Timing & Pacing:** High-intensity hooks in the first 2 seconds; deliberate pauses (12–18 frames) after important title reveals to allow audience comprehension.
10. **Exaggeration:** Controlled 10% exaggeration on prop entries (overshoot) to convey tangible physical weight.
11. **Solid Drawing / Geometry Volume:** Maintain dimensional mass; avoid paper-thin planar artifacts during 3D rotation.
12. **Appeal:** Memorable silhouette, clean color contrast, charming personality gestures, and premium polish.

---

## 2. Spring Physics Specification

Audira styles rely on deterministic spring math rather than random easing:

$$\text{Force} = -k \cdot (x - x_0) - c \cdot v$$

- **Stiffness ($k$):** Controls how quickly the object seeks its resting target. (Typical: `140 - 220`)
- **Damping ($c$):** Controls oscillation decay and eliminates perpetual jiggle. (Typical: `12 - 20`)
- **Mass ($m$):** Sets perceived weight of the object. (Typical: `0.8 - 1.5`)

```typescript
// Remotion Spring Example
const springProgress = spring({
  frame,
  fps,
  config: {
    damping: 16,
    stiffness: 180,
    mass: 1.0,
  },
});
```

---

## 3. Storyboard & Beat Architecture (Default 15-Second Commercial)

| Beat | Timestamp | Frames (60 FPS) | Directorial Goal | Visual Action |
| --- | --- | --- | --- | --- |
| **01. Hook** | 0.0s – 2.0s | 0 – 120 | Immediate visual intrigue | Hero subject drops or slides in with spring overshoot; bold editorial kicker appears |
| **02. Setup** | 2.0s – 5.0s | 120 – 300 | Establish context & mechanics | First key gesture or exploded layer reveal; secondary annotation tape attaches |
| **03. Climax / Core Value** | 5.0s – 10.0s | 300 – 600 | Deliver primary message | Main dynamic feature action; interactive prop handling or light pulse activation |
| **04. Resolution** | 10.0s – 13.0s | 600 – 780 | Confirm benefit & satisfy | Character friendly acknowledgment (wave/nod); clean telemetry lock |
| **05. Call to Action** | 13.0s – 15.0s | 780 – 900 | High conversion finish | Modern end card with social handle, brand accent, and high-contrast punch |

