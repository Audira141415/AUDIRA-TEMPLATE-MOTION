# STYLE DNA: Glitch Art & Datamosh (GLITCHFORGE) — Materials & Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Material Table

| Surface | Type | Notes |
| --- | --- | --- |
| Pearl sculpture | MeshPhysical | roughness 0.18, clearcoat 1, iridescence 0.6, sheen blue |
| Beads | MeshStandard | metalness 1, roughness 0.08 |
| Cyc / plinth | MeshStandard / Physical | roughness 0.85 / 0.25 |
| Ghosts | MeshBasic additive wireframe | signal red / blue |

## 2. Glitch Pass Order
Tears → macroblocks → datamosh (stale vectors + 72×128 quantise + posterise) → RGB split → pixel sort (14 taps, brightest above 0.55 luma) → signal lost (7 colour bars + snow) → unstable scanlines.
