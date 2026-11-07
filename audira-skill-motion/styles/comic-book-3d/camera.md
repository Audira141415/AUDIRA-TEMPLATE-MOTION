# STYLE DNA: Comic Book 3D (COMICFORGE) — Camera & Optical Framing
# AUDIRA STYLE DNA LIBRARY

---

## 1. Camera Specifications
- **Rig Type:** Panel Flythrough + Chase.
- **Vertical FOV:** `40°`, punches in to `32°` on impact, widens `+4°` in the chase.
- **Clip:** near `0.1`, far `120`.

## 2. Movement Grammar
- **Page Push (0–3.6 s):** start 14 units from a printed page so the gutters and neighbour panels read, then ease straight through the panel-shaped hole of page 1 (z=20) and page 2 (z=12.5).
- **Hero Hold:** slow arc at chest height, low angle.
- **Chase:** offset `(-3.4, 0.2, 4.4)` from the hero, target ahead of the flight line, roll `-0.12 rad`.
- **Impact:** deterministic sine shake decaying `exp(-5t)` + 8° FOV punch-in.
- **Crane Back:** ease-in-out pull up and back to reveal the burst over the skyline.
