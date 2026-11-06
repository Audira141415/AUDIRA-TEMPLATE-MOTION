# STYLE DNA: Architectural Construction Assembled Piece-by-Piece — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Parameter | Value | Description |
| --- | --- | --- |
| **Material Archetype** | `structural_concrete_matte_steel` | Primary shader surface formulation |
| **Roughness** | `0.7` | Microfacet scattering coefficient (0.0 to 1.0) |
| **Metalness** | `0.4` | Conductor vs dielectric ratio |
| **Clearcoat** | `0.00` | Secondary specular coat |
| **Normal Map Type** | `formwork_concrete` | Surface micro-relief bump texture |

---

## 2. Specular & Reflection Boundaries
- Specular highlights calibrated to eliminate sensor blowout under high-key illumination.
- Diffuse albedo maintains high WCAG contrast against dark backgrounds.
