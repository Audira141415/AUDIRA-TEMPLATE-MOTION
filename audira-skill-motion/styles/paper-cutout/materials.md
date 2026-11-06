# STYLE DNA: Handcrafted Paper Diorama & Tiered Kirigami Stories — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Parameter | Value | Description |
| --- | --- | --- |
| **Material Archetype** | `matte_textured_cardstock` | Primary shader surface formulation |
| **Roughness** | `0.95` | Microfacet scattering coefficient (0.0 to 1.0) |
| **Metalness** | `0` | Conductor vs dielectric ratio |
| **Clearcoat** | `0.00` | Secondary specular coat |
| **Normal Map Type** | `paper_fiber_texture` | Surface micro-relief bump texture |

---

## 2. Specular & Reflection Boundaries
- Specular highlights calibrated to eliminate sensor blowout under high-key illumination.
- Diffuse albedo maintains high WCAG contrast against dark backgrounds.
