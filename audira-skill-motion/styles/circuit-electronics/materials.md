# STYLE DNA: Macro 3D PCB Electronics & Electron Stream — Materials & PBR Surface Physics
# AUDIRA STYLE DNA LIBRARY

---

## 1. PBR Material Parameters

| Parameter | Value | Description |
| --- | --- | --- |
| **Material Archetype** | `soldermask_green_copper` | Primary shader surface formulation |
| **Roughness** | `0.35` | Microfacet scattering coefficient (0.0 to 1.0) |
| **Metalness** | `0.85` | Conductor vs dielectric ratio |
| **Clearcoat** | `0.4` | Secondary specular coat |
| **Normal Map Type** | `etched_copper_traces` | Surface micro-relief bump texture |

---

## 2. Specular & Reflection Boundaries
- Specular highlights calibrated to eliminate sensor blowout under high-key illumination.
- Diffuse albedo maintains high WCAG contrast against dark backgrounds.
