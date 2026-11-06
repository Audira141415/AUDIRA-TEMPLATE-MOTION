# QA GATE: Consistency Check
# AUDIRA QUALITY ASSURANCE PROTOCOL

This protocol verifies cross-scene and cross-asset consistency to eliminate visual drift.

---

## 1. Automated Metrics & Thresholds

| Metric | Target | Warning Threshold | Critical Fail (Reject) |
| --- | --- | --- | --- |
| **Character SSIM** | > 0.90 | 0.82 – 0.90 | < 0.82 (Noticeable mutation) |
| **Palette Delta-E (ΔE)** | < 2.5 | 2.5 – 4.0 | > 4.0 (Perceptible color shift) |
| **Lighting Vector Angle** | Delta < 5° | 5° – 15° | > 15° (Jarring light jump) |
| **Camera Horizon Tilt** | 0.0° ± 1.0° | 1.0° – 3.0° | > 3.0° (Drunken camera tilt) |
| **FPS Jitter / Stutter** | 0 dropped frames | 1–2 dropped frames | >= 3 dropped frames |

---

## 2. Shot-to-Shot Audit Procedure

1. **Extract End and Start Frames:**
   - Frame $E_1$: Final frame of Shot 1.
   - Frame $S_2$: Initial frame of Shot 2.
2. **Side-by-Side Split View:**
   - Compare character head size, skin/material roughness, and costume hex values.
   - Check floor line elevation; ensure the camera perspective does not randomly jump vertically.
3. **Motion Continuity Check:**
   - Verify that ongoing motion (e.g. falling confetti, waving hand, camera dolly) preserves its momentum vector across the cut point.

