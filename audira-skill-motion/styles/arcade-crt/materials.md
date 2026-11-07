# STYLE DNA: Arcade Cabinet & CRT (ARCADECRT) — Materials & Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Material Table

| Surface | Type | Notes |
| --- | --- | --- |
| CRT | ShaderMaterial | canvas raster, barrel, RGB offset 0.0035, 128 scanlines, grille, vignette, power-on |
| Cabinet | MeshStandard | roughness 0.4, side-art CanvasTexture |
| Marquee / sign | MeshBasic | back-lit CanvasTexture + additive halo |
| Voxels | MeshStandard + instanceColor | brick checker, emissive cyan tops |
| Carpet | MeshStandard | cosmic CanvasTexture, faint emissive (UV-reactive look) |
