# STYLE DNA: Risograph Zine Print (RISOFORGE) — Materials & Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. Material Table

| Surface | Type | Notes |
| --- | --- | --- |
| Paper stock | MeshStandard, roughness 1 | seeded fibre CanvasTexture |
| Cutting mat | MeshStandard, roughness 0.85 | grid CanvasTexture |
| Staples | MeshStandard, metalness 0.9 | roughness 0.25 |
| Riso ink | ShaderMaterial, multiply | density, screen angle, grain, dropouts |

## 2. Ink Shader
`out = mix(white, ink, coverage)`, blended `src × dst` with depthWrite off; coverage = solid or halftone dot, × (0.8 + 0.2 grain), with 7% speckle dropouts. Ends with `colorspace_fragment` so hex inks print true.
