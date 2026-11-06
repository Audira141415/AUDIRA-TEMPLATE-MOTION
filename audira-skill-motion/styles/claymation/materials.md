# STYLE DNA: Tactile Stop-Motion Claymation & Plasticine Diorama — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Parameter | Value | Description |
| --- | --- | --- |
| **Material Archetype** | `clay_plasticine_sss` | Primary shader surface formulation |
| **Roughness** | `0.88` | Microfacet scattering coefficient (0.0 to 1.0) |
| **Metalness** | `0` | Conductor vs dielectric ratio |
| **Clearcoat** | `0.00` | Secondary specular coat for wet/lacquered surfaces |
| **Normal Map Type** | `fingerprint_clay_stipple` | Surface micro-relief bump texture |

---

## 2. Specular & Reflection Boundaries
- Specular highlights are calibrated to prevent sensor blowout under intense studio key lights.
- Diffuse albedo preserves high color contrast while respecting broadcast-safe luma range (16–235).
