# STYLE DNA: Physical Object Historical Evolution Through Eras — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Parameter | Value | Description |
| --- | --- | --- |
| **Material Archetype** | `era_reactive_pbr` | Primary shader surface formulation |
| **Roughness** | `0.5` | Microfacet scattering coefficient (0.0 to 1.0) |
| **Metalness** | `0.3` | Conductor vs dielectric ratio |
| **Clearcoat** | `0.00` | Secondary specular coat |
| **Normal Map Type** | `patina_aging_scratches` | Surface micro-relief bump texture |

---

## 2. Specular & Reflection Boundaries
- Specular highlights calibrated to eliminate sensor blowout under high-key illumination.
- Diffuse albedo maintains high WCAG contrast against dark backgrounds.
