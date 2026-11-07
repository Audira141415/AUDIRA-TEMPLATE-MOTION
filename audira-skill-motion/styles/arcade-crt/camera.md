# STYLE DNA: Arcade Cabinet & CRT (ARCADECRT) — Camera & Optical Framing
# AUDIRA STYLE DNA LIBRARY

---

## 1. Camera Specifications
- **Rig Type:** Push-through-glass → Side Tracking.
- **Vertical FOV:** `40°` wide, `34°` in the push, `44°` inside.
- **Clip:** near `0.02` (the lens touches the glass), far `250`.

## 2. Movement Grammar
- **Wide:** slow drift `(−1.7,1.75,4.9) → (−1.1,1.65,4.3)`.
- **Push:** ease-in-out to 1.1 units along the screen normal, then a power-2.2 ease-in to 0.16 units.
- **Dive:** flash masks the switch at 7.3 s.
- **Inside:** offset from the hero lerps through close → tracking `(−2.4,1.3,9.6)` → low star angle → pull back `(−4,1.6,12.5)`.
