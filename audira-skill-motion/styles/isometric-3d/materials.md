# STYLE DNA: Isometric Hand-Inked Cutaway Machinery & Diorama — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Parameter | Value | Description |
| --- | --- | --- |
| **Material Archetype** | `semi_matte_powdercoat` | Primary shader surface formulation |
| **Roughness** | `0.55` | Microfacet scattering coefficient (0.0 to 1.0) |
| **Metalness** | `0.25` | Conductor vs dielectric ratio |
| **Clearcoat** | `0.1` | Secondary specular coat for wet/lacquered surfaces |
| **Normal Map Type** | `fine_sandblast` | Surface micro-relief bump texture |

---

## 2. Specular & Reflection Boundaries
- Specular highlights are calibrated to prevent sensor blowout under intense studio key lights.
- Diffuse albedo preserves high color contrast while respecting broadcast-safe luma range (16–235).
