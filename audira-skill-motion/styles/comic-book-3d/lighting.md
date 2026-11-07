# STYLE DNA: Comic Book 3D (COMICFORGE) — Lighting & Atmosphere
# AUDIRA STYLE DNA LIBRARY

---

## 1. Graphic Key
No physical lights are needed: the halftone shader evaluates one fixed key direction `(0.55, 0.75, 0.45)`.

- **Lit band:** `N·L > 0.3` → flat base colour.
- **Mid band:** `-0.2 < N·L < 0.3` → base colour printed with 45° screen-space dots of the shade colour.
- **Dark band:** solid shade with a second, lighter dot screen.
- **Toon highlight:** hard white spot where `N·H > 0.965` (suits, steel, drone).

## 2. Atmosphere
Sky is a printed C+M gradient with magenta dots densest at the horizon and a halftone moon. No fog, no bloom.
