# STYLE DNA: Chibi 3D Plastic Bricks & Tabletop Macro Stop-Motion — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Parameter | Value | Description |
| --- | --- | --- |
| **Material Archetype** | `glossy_abs_plastic` | Primary shader surface formulation |
| **Roughness** | `0.2` | Microfacet scattering coefficient (0.0 to 1.0) |
| **Metalness** | `0` | Conductor vs dielectric ratio |
| **Clearcoat** | `0.6` | Secondary specular coat |
| **Normal Map Type** | `molded_abs_seam` | Surface micro-relief bump texture |

---

## 2. Specular & Reflection Boundaries
- Specular highlights calibrated to eliminate sensor blowout under high-key illumination.
- Diffuse albedo maintains high WCAG contrast against dark backgrounds.
