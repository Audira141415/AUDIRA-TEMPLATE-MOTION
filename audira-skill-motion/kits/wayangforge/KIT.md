# WAYANGFORGE — Kit Guide

> Style ID: 47. Wayang kulit shadow theatre in 3D: carved, perforated leather puppets (original designs) held on horn rods in front of a glowing kelir screen, lit by a single blencong oil lamp. The camera starts on the colourful dalang side, orbits around the carved frame post and lands on the audience side where only sharp ornate shadows remain. Warm amber light, deep indigo and soga-brown batik.

## Quick Start

```tsx
import { WayangforgeExample } from "./example/WayangforgeExample";
import { KelirStage3D } from "./scene/KelirStage3D";
import { WayangPuppets3D } from "./scene/WayangPuppets3D";
import { getWayangCamera } from "./camera/rig";
import { WayangOverlay } from "./camera/Overlay";
import { computeWayangState, projectToKelir, BLENCONG, KELIR } from "./core/motion";
import { makePuppetTextures, makeKawungTexture, makeParangTexture } from "./lib/materials";
```

Compositions: `WayangforgePreview` (540x960@30) and `WayangforgeFinal` (1080x1920@60), 12 s.

## Signature Motion & Style Rules

1. **One light tells the story:** the blencong (`#FF9E3D` point light, decay 1.5, value-noise flicker 0.86–1.0) is the key for puppets, cloth and shadows. Everything else is low indigo ambient and a cool rim from the audience side.
2. **Projected shadows, not shadow maps:** every puppet has a matching black, slightly blurred silhouette texture placed on both faces of the kelir via `projectToKelir` (centre and magnification `k = Lz / (Lz - z)`). Moving a puppet toward the lamp makes its shadow bigger and softer, exactly like the real theatre, at zero shadow-map cost.
3. **Tatahan perforations:** puppet textures are drawn on canvas and punched with `destination-out` (dots, teardrops, rows) so light passes through both the colour side and the shadow.
4. **Two faces of the kelir:** front = lit cloth (`MeshStandardMaterial` + faint emissive); back = glowing amber cloth (`MeshBasicMaterial`, hot radial gradient) where the shadows read near-black.
5. **Batik everywhere but the cloth:** kawung on the carved top panel and pillar bases, parang band along the screen edges, an indigo kawung carpet on the floor.
6. **Camera:** flame macro, pull back to the twirling gunungan, slow arc, then a 3.6 s orbit around the frame post to the shadow side.
7. **Original figures only:** the kesatria, raksasa and gunungan here are generic ornamental designs, not specific traditional characters.

## Story Arc (example)

| Time | Beat |
| --- | --- |
| 0–2 s | Hook: blencong flame macro, pull back to the gunungan twirling at centre |
| 2–5.6 s | Gunungan steps aside, kesatria and raksasa enter and face off (colour side) |
| 5.6–9.2 s | Camera orbits around the frame post; shadows and puppets seen together |
| 9.2–11 s | Payoff on the shadow side: kesatria lunges to the lamp (shadow swells), raksasa topples, gunungan sweeps in |
| 11–12 s | Gunungan planted (tancep kayon), hold |

## Known Limits

- Shadow projection uses the puppet centre; shadows of puppets tilted strongly about Y are approximated by squashing width with `|cos(rotY)|`.
- Puppets are single planes; very low grazing angles (camera exactly side-on) show them as lines, which is intended during the orbit.
- The flame is a small emissive teardrop with an additive sprite; on the bright cloth the halo is subtle.
