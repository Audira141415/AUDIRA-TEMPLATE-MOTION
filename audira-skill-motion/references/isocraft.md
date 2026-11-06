# ISOCRAFT Reference

> **Style ID:** 21  
> **Name:** ISOCRAFT  
> **Pilar:** 2. Karakter & Cerita Taktil  
> **Summary:** Objek 3D isometrik dengan garis tinta cel-shading tebal, bayangan datar tanpa blur, dan mekanisme internal see-through.  

---

## 1. Visual Identity
- **Primary Aesthetic:** Objek 3D isometrik dengan garis tinta cel-shading tebal, bayangan datar tanpa blur, dan mekanisme internal see-through.
- **Color Tokens:**
  - `paperWarm`: `#F5F2EB`
  - `inkBlack`: `#1C1E21`
  - `shadowBlue`: `#7A9BB8`
  - `bodyCoral`: `#E06D53`
  - `bodyMint`: `#5FA084`
  - `metalSteel`: `#D1D8E0`
  - `accentYellow`: `#F4C430`

## 2. Best Practices
1. **Determinism:** Never read `Date.now()` or call `Math.random()` in render loop. Always use `f` frame parameter.
2. **Camera Pacing:** Move the camera along spatial axes to reveal components.
3. **Contrast:** Maintain readable text and overlay within standard safe zones (Top 180px, Bottom 380px).
