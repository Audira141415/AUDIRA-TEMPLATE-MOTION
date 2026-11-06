# CORE MODULE: Visual Quality Control (Step 05)
# AUDIRA MOTION INTELLIGENCE ENGINE

The **Visual Quality Control (Visual QA)** engine is the final automated and human-in-the-loop gate before video delivery or release. It inspects five mandatory quality dimensions to guarantee studio-grade output.

---

## 1. The 5-Point Quality Scorecard

Every generated scene or completed render must achieve a **Pass Score (>= 90/100)** across these 5 gates:

| # | Gate Name | What is Evaluated | Pass Criteria | Fail Criteria (Reject) |
| --- | --- | --- | --- | --- |
| **01** | **Style Compliance** | Fidelity to active style DNA parameters | Materials, lighting temperature, and geometry match the loaded style DNA | Hallucinated style blending (e.g. realistic human face in a toy diorama) |
| **02** | **Character Integrity** | Multi-frame character persistence | Silhouette, proportions, clothing, and colors remain identical across beats | Morphing face, extra limbs, spontaneous costume shifts, or scale shrinking |
| **03** | **Composition & Safe Zone** | 9:16 vertical layout framing | Key subject centered; titles clear of top 160px and bottom 280px UI zones | Titles clipped by TikTok/Reels captions, off-center subject, poor headroom |
| **04** | **Motion & Cadence** | Natural physics, spring damping, FPS | Smooth 60 FPS (or stylistically locked stop-motion 12/24 FPS), spring overshoot | Uncontrolled camera shaking, linear sliding, rubbery unmotivated twitching |
| **05** | **Artifact & Code Hygiene** | Visual defects and audio integrity | Clean PBR surfaces, true black levels, audio locked to -14 LUFS, zero black frames | AI hallucination artifacts, tearing, color banding, audio clipping (> -1 dBFS) |

---

## 2. Automated Quality Inspection Script Workflow

```
       [Render Video / Extract Stills]
                     │
                     ▼
       ┌───────────────────────────┐
       │ 1. Frame Differential     │  Check for sudden frame pops or blank frames
       └─────────────┬─────────────┘
                     ▼
       ┌───────────────────────────┐
       │ 2. Safe-Zone Overlay Test │  Verify 1080x1920 UI clearance overlay
       └─────────────┬─────────────┘
                     ▼
       ┌───────────────────────────┐
       │ 3. Contrast & Luminance   │  Confirm WCAG AA >= 4.5:1 text readability
       └─────────────┬─────────────┘
                     ▼
       ┌───────────────────────────┐
       │ 4. Audio Loudness Meter   │  EBU R128 integrated loudness check (-14 LUFS)
       └─────────────┬─────────────┘
                     ▼
             [PASS / REVISE]
```

---

## 3. Human Look-Dev Inspection Checklist

1. **The 3-Second Thumbnail Test:** Does the hero frame stop the scroll instantly?
2. **Silhouette Test:** Can you clearly identify the character's emotional posture in 0.2 seconds?
3. **Lighting Separation:** Is there a crisp rim light separating the subject from dark theatrical backgrounds?
4. **Physicality:** Do props hit surfaces with believable weight and spring settle?
5. **No AI "Slop" Artifacts:** Are edges clean without AI finger melt, gelatinous morphing, or noisy grain?

