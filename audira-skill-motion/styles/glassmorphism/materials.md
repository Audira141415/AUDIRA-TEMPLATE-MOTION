# STYLE DNA: VisionOS Spatial Glassmorphism & Liquid Prisms — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Parameter | Value | Description |
| --- | --- | --- |
| **Material Archetype** | `frosted_refractive_glass` | Primary shader surface formulation |
| **Roughness** | `0.15` | Microfacet scattering coefficient (0.0 to 1.0) |
| **Metalness** | `0` | Conductor vs dielectric ratio |
| **Clearcoat** | `1` | Secondary specular coat |
| **Normal Map Type** | `liquid_dispersion_caustic` | Surface micro-relief bump texture |

---

## 2. Specular & Reflection Boundaries
- Specular highlights calibrated to eliminate sensor blowout under high-key illumination.
- Diffuse albedo maintains high WCAG contrast against dark backgrounds.
