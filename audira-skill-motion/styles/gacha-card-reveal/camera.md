# STYLE DNA: Gacha Card Reveal — Camera & Optical Framing
# AUDIRA STYLE DNA LIBRARY

---

## 1. Camera Specifications & Optics
- **Rig Type:** **Anticipation Push → 360° Spin → Hero Settle** (`getGacharevealCamera`).
- **Focal Length:** `45mm` equivalent (vertical FOV `46° → 40°`), +2° punch on every flash.
- **Position:** radius `5.2 → 4.1` during anticipation, up to `6.0` mid-spin, settle at `5.1`; height `1.5 → 1.2 → 2.25`.
- **Depth of Field:** none; additive glow and vignette carry depth.

---

## 2. Movement Grammar
- **Anticipation:** slow push toward the capsule with a ±0.1 rad sway.
- **Spin:** a full 2π orbit with cubic in-out across 5.5–8.9 s; radius swells by $\sin(\pi\,p)$.
- **Settle:** front-on to the card, target `y 1.82` so the card sits between the HUD bands.
- **Kick:** seeded 30 Hz jitter scaled by `flash(t)` (max 0.05 units).
